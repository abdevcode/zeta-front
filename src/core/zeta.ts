/**
 * Zeta Framework - Core
 * A lightweight frontend framework
 */

import { handleBinding } from "./data-binding/data-binding";
import { handleEvent } from "./event-handler/event-handler";
import { isSignal } from "./signal/signal";

type ComponentConstructor = new () => ZetaComponent;

export class ZetaComponent {
  private static registry: Map<string, ComponentConstructor> = new Map();
  protected element: HTMLElement | null = null;
  private textNodeBindings: Array<{ node: Text; template: string; expressions: Array<{ match: string; code: string }> }> = [];

  constructor(protected selector: string) {}

  static register(tagName: string, componentClass: ComponentConstructor): void {
    this.registry.set(tagName, componentClass);
  }

  mount(): void {
    console.log(`Mounting component to ${this.selector}`);
    this.element = document.querySelector(this.selector);
    if (this.element) {
      this.render();
    }
  }

  protected render(): void {
    if (this.element) {
      const template = this.getTemplate();
      
      // Set innerHTML with template (not yet replaced)
      this.element.innerHTML = template;
      
      // Cache text node bindings while patterns are still in place
      this.cacheTextNodeBindings();
      
      // Now replace the patterns with actual values
      this.updateAllTextNodes();
      
      // Bind event listeners
      this.bindEvents();
      
      // Setup signal subscriptions for reactive updates
      this.setupSignalSubscriptions();
      
      // Process custom components
      this.mountCustomComponents();
    }
  }

  private updateAllTextNodes(): void {
    this.updateTextNodes();
  }

  private setupSignalSubscriptions(): void {
    if (!this.element) return;
    
    // Iterate over all properties to set up subscriptions
    Object.keys(this).forEach(key => {
      const value = (this as any)[key];
      if (isSignal(value)) {
        value.subscribe(() => {
          this.updateTextNodes();
        });
      }
    });
  }

  private cacheTextNodeBindings(): void {
    if (!this.element) return;
    
    this.textNodeBindings = [];
    
    const walker = document.createTreeWalker(
      this.element,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node: Node | null;
    while (node = walker.nextNode()) {
      const textNode = node as Text;
      if (!textNode.nodeValue) continue;
      
      const template = textNode.nodeValue;
      
      // Find all {{ expression }} patterns
      const expressionPattern = /\{\{\s*(.+?)\s*\}\}/g;
      const expressions: Array<{ match: string; code: string }> = [];
      
      let match;
      while ((match = expressionPattern.exec(template)) !== null) {
        expressions.push({
          match: match[0],  // Full match like "{{ count() }}"
          code: match[1]    // Just the expression like "count()"
        });
      }
      
      if (expressions.length > 0) {
        this.textNodeBindings.push({ node: textNode, template, expressions });
      }
    }
  }

  private updateTextNodes(): void {
    this.textNodeBindings.forEach(({ node, template, expressions }) => {
      let newValue = template;
      
      expressions.forEach(({ match, code }) => {
        try {
          // Evaluate the expression in the context of the component
          const result = this.evaluateExpression(code);
          newValue = newValue.replace(match, String(result));
        } catch (error) {
          console.error(`Error evaluating expression "${code}":`, error);
          newValue = newValue.replace(match, '');
        }
      });
      
      node.nodeValue = newValue;
    });
  }
  
  private evaluateExpression(code: string): any {
    const context = new Proxy({}, {
      get: (_, prop) => {
        const value = (this as any)[prop];
        if (typeof value === 'function') return value.bind(this);
        return value;
      },
      has: (_, prop) => prop in this
    });
    
    return new Function('$ctx', `with($ctx) { return ${code}; }`)(context);
  }

  private bindEvents(): void {
    if (!this.element) return;

    handleEvent(this.element, this);
    handleBinding(this.element, this);
  }

  private mountCustomComponents(): void {
    if (!this.element) return;
    
    ZetaComponent.registry.forEach((ComponentClass, tagName) => {
      const elements = this.element!.querySelectorAll(tagName);
      elements.forEach((el) => {
        const component = new ComponentClass();
        component.element = el as HTMLElement;
        component.render();
      });
    });
  }

  protected getTemplate(): string {
    return ''; // Override in subclass
  }
}

export class Zeta {
  private components: ZetaComponent[] = [];

  constructor() {
    this.init();
  }

  private init(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.bootstrap());
    } else {
      this.bootstrap();
    }
  }

  private bootstrap(): void {
    this.components.forEach(component => component.mount());
  }

  registerComponent(component: ZetaComponent): void {
    this.components.push(component);
  }
}

export default Zeta;

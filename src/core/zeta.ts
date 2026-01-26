/**
 * Zeta Framework - Core
 * A lightweight frontend framework
 */

import { handleBinding } from "./data-binding/data-binding";
import { handleEvent } from "./event-handler/event-handler";
import { Signal } from "./signal/signal";

type ComponentConstructor = new () => ZetaComponent;

export class ZetaComponent {
  private static registry: Map<string, ComponentConstructor> = new Map();
  protected element: HTMLElement | null = null;
  private textNodeBindings: Map<string, Array<{ node: Text; template: string }>> = new Map();

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
    Object.keys(this).forEach(key => {
      const value = (this as any)[key];
      if (value instanceof Signal) {
        this.updateTextNodes(key, value.get());
      }
    });
  }

  private setupSignalSubscriptions(): void {
    if (!this.element) return;
    
    // Iterate over all properties of the component instance
    Object.keys(this).forEach(key => {
      const value = (this as any)[key];
      if (value instanceof Signal) {
        value.subscribe(() => {
          this.updateTextNodes(key, value.get());
        });
      }
    });
  }

  private cacheTextNodeBindings(): void {
    if (!this.element) return;
    
    this.textNodeBindings.clear();
    
    const walker = document.createTreeWalker(
      this.element,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node: Node | null;
    while (node = walker.nextNode()) {
      const textNode = node as Text;
      if (!textNode.nodeValue) continue;
      
      // Store the original template pattern for this text node
      const template = textNode.nodeValue;
      
      // Find all properties referenced in this text node
      const patterns = [
        /\{\{\s*(\w+)\s*\(\s*\)\s*\}\}/g, // match functions like {{ property() }}
        /\{\{\s*(\w+)\s*\}\}/g            // match properties like {{ property }}
      ];
      
      /**
       * Collect all unique properties found in the text node
       */
      const foundProperties = new Set<string>();
      patterns.forEach(pattern => {
        const matches = template.matchAll(pattern);
        for (const match of matches) {
          foundProperties.add(match[1]);
        }
      });

      // Store each text node only once per property
      foundProperties.forEach(property => {
        if (!this.textNodeBindings.has(property)) {
          this.textNodeBindings.set(property, []);
        }
        this.textNodeBindings.get(property)!.push({ node: textNode, template });
      });
    }
  }

  private updateTextNodes(property: string, value: any): void {
    const bindings = this.textNodeBindings.get(property);
    if (!bindings) return;

    const patterns = [
      new RegExp(`\\{\\{\\s*${property}\\s*\\(\\s*\\)\\s*\\}\\}`, 'g'),
      new RegExp(`\\{\\{\\s*${property}\\s*\\}\\}`, 'g')
    ];

    bindings.forEach(({ node, template }) => {
      let newValue = template;
      patterns.forEach(pattern => {
        newValue = newValue.replace(pattern, String(value));
      });
      node.nodeValue = newValue;
    });
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

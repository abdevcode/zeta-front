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
      
      // Process structural directives like @for
      this.processStructuralDirectives();
      
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

  private cacheTextNodeBindingsForElement(element: HTMLElement): void {
    const walker = document.createTreeWalker(
      element,
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
          const result = this.evaluateExpression(code, node);
          newValue = newValue.replace(match, String(result));
        } catch (error) {
          console.error(`Error evaluating expression "${code}":`, error);
          newValue = newValue.replace(match, '');
        }
      });
      
      node.nodeValue = newValue;
    });
  }
  
  private evaluateExpression(code: string, contextNode?: Node): any {
    const componentContext = this;
    const scopes: any[] = [componentContext];

    // Traverse up the DOM to find local contexts
    let currentNode: Node | null = contextNode || null;
    while (currentNode) {
      if ((currentNode as any).__zeta_context) {
        scopes.unshift((currentNode as any).__zeta_context);
      }
      currentNode = currentNode.parentNode;
    }

    const proxy = new Proxy({}, {
      get: (_, prop) => {
        // Check local scopes first
        for (const scope of scopes) {
          if (prop in scope) {
            const value = scope[prop];
            if (typeof value === 'function' && scope === componentContext) {
              return value.bind(componentContext);
            }
            return value;
          }
        }
        return undefined;
      },
      has: (_, prop) => {
        return scopes.some(scope => prop in scope);
      }
    });
    
    return new Function('$ctx', `with($ctx) { return ${code}; }`)(proxy);
  }

  private processStructuralDirectives(): void {
    if (!this.element) return;
    
    const elements = this.element.querySelectorAll('*');
    elements.forEach(el => {
      const forAttr = el.getAttribute('@for');
      if (forAttr) {
        this.handleForDirective(el as HTMLElement, forAttr);
      }
    });
  }

  private handleForDirective(el: HTMLElement, expression: string): void {
    // Parse "item in items"
    const match = expression.match(/^\s*(\w+)\s+in\s+(\w+)\s*$/);
    if (!match) {
      console.warn(`Invalid @for expression: "${expression}"`);
      return;
    }
    
    const [_, itemName, collectionName] = match;
    const collectionValue = (this as any)[collectionName];
    
    // Handle both signals and regular arrays
    let collection: any[];
    const isSignalCollection = isSignal(collectionValue);
    
    if (isSignalCollection) {
      collection = collectionValue();
    } else {
      collection = collectionValue;
    }
    
    if (!Array.isArray(collection)) {
      console.warn(`@for directive: "${collectionName}" is not an array.`);
      return;
    }
    
    // Store reference to the original element's parent and next sibling for re-rendering
    const parent = el.parentNode;
    const nextSibling = el.nextSibling;
    
    // Create a marker comment to identify the @for block
    const startMarker = document.createComment(`@for start: ${expression}`);
    const endMarker = document.createComment(`@for end: ${expression}`);
    
    // Render function to create the list
    const renderList = () => {
      // Remove all nodes between markers
      if (parent) {
        let node = startMarker.nextSibling;
        while (node && node !== endMarker) {
          const next = node.nextSibling;
          parent.removeChild(node);
          node = next;
        }
        
        // Create a document fragment to hold the cloned elements
        const fragment = document.createDocumentFragment();
        
        // Get the current collection value
        const currentCollection = isSignalCollection ? collectionValue() : collection;
        
        currentCollection.forEach((item: any) => {
          const clone = el.cloneNode(true) as HTMLElement;
          clone.removeAttribute('@for');
          
          // Attach local context directly to the DOM node
          (clone as any).__zeta_context = { [itemName]: item };
          
          // Cache text bindings for this clone
          this.cacheTextNodeBindingsForElement(clone);
          
          fragment.appendChild(clone);
        });
        
        // Update text nodes in the fragment
        this.updateTextNodes();
        
        // Insert the fragment before the end marker
        parent.insertBefore(fragment, endMarker);
        
        // Bind events for new elements
        if (this.element) {
          this.bindEvents();
        }
      }
    };
    
    // Replace the original element with markers
    if (parent) {
      parent.insertBefore(startMarker, el);
      parent.insertBefore(endMarker, el);
      parent.removeChild(el);
      
      // Initial render
      renderList();
      
      // Subscribe to signal changes if it's a signal
      if (isSignalCollection) {
        collectionValue.subscribe(() => {
          renderList();
        });
      }
    }
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

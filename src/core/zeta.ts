/**
 * Zeta Framework - Core
 * A lightweight frontend framework
 */

type ComponentConstructor = new () => ZetaComponent;

export class ZetaComponent {
  private static registry: Map<string, ComponentConstructor> = new Map();
  protected element: HTMLElement | null = null;

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

  protected data: any = {};

  protected render(): void {
    if (this.element) {
      let template = this.getTemplate();
      // Replace {{ propertyName }} with actual values (handles spaces)
      template = template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, prop) => {
        return this.data[prop] || '';
      });
      this.element.innerHTML = template;
      
      // Bind event listeners
      this.bindEvents();
      
      // Process custom components
      this.mountCustomComponents();
    }
  }

  private bindEvents(): void {
    if (!this.element) return;

    // Find all elements with @event attributes
    const elements = this.element.querySelectorAll('[\\@click], [\\@input], [\\@change], [\\@submit]');
    elements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      
      // Handle @click
      const clickHandler = htmlEl.getAttribute('@click');
      if (clickHandler) {
        htmlEl.removeAttribute('@click');
        htmlEl.addEventListener('click', (e) => {
          if (typeof (this as any)[clickHandler] === 'function') {
            (this as any)[clickHandler](e);
          }
        });
      }
      
      // Handle @input
      const inputHandler = htmlEl.getAttribute('@input');
      if (inputHandler) {
        htmlEl.removeAttribute('@input');
        htmlEl.addEventListener('input', (e) => {
          if (typeof (this as any)[inputHandler] === 'function') {
            (this as any)[inputHandler](e);
          }
        });
      }

      // Handle @change
      const changeHandler = htmlEl.getAttribute('@change');
      if (changeHandler) {
        htmlEl.removeAttribute('@change');
        htmlEl.addEventListener('change', (e) => {
          if (typeof (this as any)[changeHandler] === 'function') {
            (this as any)[changeHandler](e);
          }
        });
      }

      // Handle @submit
      const submitHandler = htmlEl.getAttribute('@submit');
      if (submitHandler) {
        htmlEl.removeAttribute('@submit');
        htmlEl.addEventListener('submit', (e) => {
          e.preventDefault();
          if (typeof (this as any)[submitHandler] === 'function') {
            (this as any)[submitHandler](e);
          }
        });
      }
    });
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

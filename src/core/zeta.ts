/**
 * Zeta Framework - Core
 * A lightweight frontend framework
 */

export class ZetaComponent {
  protected element: HTMLElement | null = null;

  constructor(protected selector: string) {}

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
    }
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

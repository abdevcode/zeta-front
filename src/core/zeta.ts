/**
 * Zeta Framework - Core
 * A lightweight frontend framework
 */

export class ZetaComponent {
  protected element: HTMLElement | null = null;

  constructor(protected selector: string) {}

  mount(): void {
    this.element = document.querySelector(this.selector);
    if (this.element) {
      this.render();
    }
  }

  protected render(): void {
    // Override in subclass
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

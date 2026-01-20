import { Zeta, ZetaComponent } from './index';

class AppComponent extends ZetaComponent {
  constructor() {
    super('#app');
    this.data = {
      message: 'Hello from Zeta Framework!'
    };
  }

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
    return `
      <h1>Zeta Framework</h1>
      <p>Your custom frontend framework is ready!</p>
      <p>{{ message }}</p>
    `;
  }
}

// Create component instance and mount it
const appComponent = new AppComponent();
appComponent.mount();

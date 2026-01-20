import { Zeta, ZetaComponent } from '../src/index';

class AppComponent extends ZetaComponent {
  constructor() {
    super('#app');
    this.data = {
      message: 'Hello from Zeta Framework!'
    };
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

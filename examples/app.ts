import { Signal, signal, Zeta, ZetaComponent } from '../src/index';
import { CounterComponent } from './components/counter/counter.component';

// Register custom components
ZetaComponent.register('counter-component', CounterComponent);

class AppComponent extends ZetaComponent {
  public message: Signal<string> = signal('Hello from Zeta Framework!');

  constructor() {
    super('#app');
  }

  protected getTemplate(): string {
    return `
      <h1>Zeta Framework</h1>
      <p>Your custom frontend framework is ready!</p>
      <p>{{ message() }}</p>
      <counter-component></counter-component>
    `;
  }
}

// Create component instance and mount it
const appComponent = new AppComponent();
appComponent.mount();

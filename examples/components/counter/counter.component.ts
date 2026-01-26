import { ZetaComponent } from "../../../src/core/zeta";
import { Signal, signal } from "../../../src/core/signal/signal";
import template from './counter.component.html';

export class CounterComponent extends ZetaComponent {
  public count: Signal<number> = signal(0);
  public name: Signal<string> = signal('John Doe');

  constructor() {
    super('');  // No selector needed for registered components
  }

  protected getTemplate(): string {
    return template;
  }

  increment(): void {
    this.count.update((n: number) => n + 1);
  }

  send(): void {
    console.log({
      count: this.count.get(),
      name: this.name.get()
    });
  }
}
import { ZetaComponent } from "../../../src/core/zeta";
import { computed, effect, Signal, signal } from "../../../src/core/signal/signal";
import template from './counter.component.html';

export class CounterComponent extends ZetaComponent {
  public count: Signal<number> = signal(0);
  private isEven: Signal<boolean> = computed(() => this.count.get() % 2 === 0);
  public name: Signal<string> = signal('John Doe');

  constructor() {
    super('');  // No selector needed for registered components
    effect(() => {
      console.log({
        count: this.count(),
        isEven: this.isEven()
      });
    });
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
      isEven: this.isEven.get(),
      name: this.name.get()
    });
  }
}
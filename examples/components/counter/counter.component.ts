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
        count: this.count.get(),
        isEven: this.isEven.get()
      });
    });
  }

  protected getTemplate(): string {
    return template;
  }

  increment(): void {
    this.count.update((n: number) => n + 1);
  }

  numberType(): void {
    const currentCount: number = this.count.get();
    console.log(`The current count is of type: ${typeof currentCount}`);
  }

  send(): void {
    console.log({
      count: this.count.get(),
      isEven: this.isEven.get(),
      name: this.name.get()
    });
  }
}
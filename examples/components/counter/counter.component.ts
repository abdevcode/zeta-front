import { ZetaComponent } from "../../../src/core/zeta";
import template from './counter.component.html';

export class CounterComponent extends ZetaComponent {
  constructor() {
    super('');  // No selector needed for registered components
    this.data = {
      count: 0
    };
  }

  protected getTemplate(): string {
    return template;
  }
}
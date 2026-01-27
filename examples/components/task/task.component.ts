import { ZetaComponent } from "../../../src/core/zeta";
import { ListComponent } from "./list/list.component";
import template from './task.component.html';

ZetaComponent.register('list-component', ListComponent);
export class TaskComponent extends ZetaComponent {
  constructor() {
    super('task-component');
  }

  protected getTemplate(): string {
    return template;
  }
}


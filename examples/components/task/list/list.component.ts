import { ZetaComponent } from "../../../../src";
import template from './list.component.html';

export class ListComponent extends ZetaComponent {
  public tasks = [
    { name: 'Task 1' },
    { name: 'Task 2' },
    { name: 'Task 3' }
  ];

  constructor() {
    super('list-component');
  }

  protected getTemplate(): string {
    return template;
  }
}
import { ZetaComponent } from "../../../../src";
import { signal } from "../../../../src/core/signal/signal";
import template from './list.component.html';

export class ListComponent extends ZetaComponent {
  public tasks = signal([
    { name: 'Task 1' },
    { name: 'Task 2' },
    { name: 'Task 3' }
  ]);

  constructor() {
    super('list-component');
  }

  protected getTemplate(): string {
    return template;
  }

  public addTask(): void {
    console.log('add task', this.tasks());
    this.tasks.update(current => [...current, { name: `Task ${current.length + 1}` }]);
  }

  public removeTask(): void {
    console.log('remove task');
    this.tasks.update(current => current.slice(0, -1));
  }

  public updateTask(): void {
    console.log('update task');
    this.tasks.update(current => {
      const updated = [...current];
      if (updated.length > 0) {
        updated[0] = { ...updated[0], name: 'Task 1 updated' };
      }
      return updated;
    });
  }
}
import { ZetaComponent } from '../src/index';
import { TaskComponent } from './components/task/task.component';

ZetaComponent.register('task-component', TaskComponent);
class AppComponent extends ZetaComponent {
  constructor() {
    super('#app');
  }

  protected getTemplate(): string {
    return '<task-component></task-component>'
  }
}

// Create component instance and mount it
const appComponent = new AppComponent();
appComponent.mount();

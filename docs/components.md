# Components

Components are the building blocks of Zeta applications. Each component encapsulates its own template, state, and behavior.

## Creating a Component

### Basic Component

```typescript
import { ZetaComponent } from './src/core/zeta';

export class MyComponent extends ZetaComponent {
  constructor() {
    super('my-component'); // CSS selector
  }

  protected getTemplate(): string {
    return `
      <div>
        <h1>My Component</h1>
      </div>
    `;
  }
}
```

### Component with External Template

```typescript
import { ZetaComponent } from './src/core/zeta';
import template from './my-component.html';

export class MyComponent extends ZetaComponent {
  constructor() {
    super('my-component');
  }

  protected getTemplate(): string {
    return template;
  }
}
```

**my-component.html:**
```html
<div>
  <h1>My Component</h1>
  <p>Content from external template</p>
</div>
```

## Component with State

```typescript
import { ZetaComponent } from './src/core/zeta';
import { signal } from './src/core/signal/signal';

export class CounterComponent extends ZetaComponent {
  // Reactive state
  count = signal(0);
  message = signal('Hello');

  constructor() {
    super('counter-component');
  }

  // Methods
  increment() {
    this.count.update(c => c + 1);
  }

  decrement() {
    this.count.update(c => c - 1);
  }

  reset() {
    this.count.set(0);
  }

  protected getTemplate(): string {
    return `
      <div>
        <h1>{{ message() }}</h1>
        <p>Count: {{ count() }}</p>
        <button @click="increment()">+</button>
        <button @click="decrement()">-</button>
        <button @click="reset()">Reset</button>
      </div>
    `;
  }
}
```

## Component Properties

### Public Properties

Public properties are accessible in templates:

```typescript
export class UserComponent extends ZetaComponent {
  // Public reactive state
  name = signal('John');
  age = signal(30);
  
  // Public non-reactive properties
  readonly maxAge = 120;
}
```

```html
<div>
  <p>Name: {{ name() }}</p>
  <p>Age: {{ age() }}</p>
  <p>Max Age: {{ maxAge }}</p>
</div>
```

### Private Properties

Private properties are not accessible in templates:

```typescript
export class UserComponent extends ZetaComponent {
  private apiKey = 'secret';
  private #internalState = signal(0);
}
```

## Component Methods

### Public Methods

Public methods can be called from templates:

```typescript
export class CalculatorComponent extends ZetaComponent {
  result = signal(0);

  add(a: number, b: number) {
    this.result.set(a + b);
  }

  multiply(a: number, b: number) {
    this.result.set(a * b);
  }

  clear() {
    this.result.set(0);
  }

  protected getTemplate(): string {
    return `
      <div>
        <p>Result: {{ result() }}</p>
        <button @click="add(5, 3)">5 + 3</button>
        <button @click="multiply(4, 7)">4 × 7</button>
        <button @click="clear()">Clear</button>
      </div>
    `;
  }
}
```

### Private Methods

Private methods are for internal use only:

```typescript
export class DataComponent extends ZetaComponent {
  data = signal<any[]>([]);

  public loadData() {
    this.fetchFromAPI()
      .then(result => {
        this.data.set(result);
      });
  }

  private async fetchFromAPI() {
    const response = await fetch('/api/data');
    return response.json();
  }

  private transformData(raw: any) {
    return raw.map((item: any) => ({
      id: item.id,
      name: item.name.toUpperCase()
    }));
  }
}
```

## Component Registration

### Registering Child Components

To use a component inside another component:

```typescript
import { ZetaComponent } from './src/core/zeta';
import { ButtonComponent } from './button.component';

// Register the child component
ZetaComponent.register('app-button', ButtonComponent);

export class ParentComponent extends ZetaComponent {
  protected getTemplate(): string {
    return `
      <div>
        <app-button></app-button>
      </div>
    `;
  }
}
```

### Registering with the App

```typescript
import { Zeta } from './src';
import { MyComponent } from './my-component';

const app = new Zeta();
const component = new MyComponent();
app.registerComponent(component);
```

## Component Communication

### Parent to Child (Props Pattern)

While Zeta doesn't have built-in props, you can pass data through the DOM:

```typescript
// Parent
export class ParentComponent extends ZetaComponent {
  userName = signal('Alice');

  protected getTemplate(): string {
    return `
      <child-component data-name="{{ userName() }}"></child-component>
    `;
  }
}

// Child
export class ChildComponent extends ZetaComponent {
  mount() {
    super.mount();
    const name = this.element?.getAttribute('data-name');
    console.log('Received name:', name);
  }
}
```

### Child to Parent (Events Pattern)

Use custom events to communicate from child to parent:

```typescript
// Child
export class ChildComponent extends ZetaComponent {
  notifyParent() {
    const event = new CustomEvent('child-event', {
      detail: { message: 'Hello from child' },
      bubbles: true
    });
    this.element?.dispatchEvent(event);
  }

  protected getTemplate(): string {
    return `
      <button @click="notifyParent()">Notify Parent</button>
    `;
  }
}

// Parent
export class ParentComponent extends ZetaComponent {
  mount() {
    super.mount();
    this.element?.addEventListener('child-event', (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log('Message from child:', customEvent.detail.message);
    });
  }
}
```

## Component Composition Patterns

### Container/Presenter Pattern

```typescript
// Presenter - Pure UI component
export class TaskItemComponent extends ZetaComponent {
  taskName = signal('');
  completed = signal(false);

  toggle() {
    this.completed.update(c => !c);
  }

  protected getTemplate(): string {
    return `
      <div>
        <input type="checkbox" @click="toggle()">
        <span>{{ taskName() }}</span>
      </div>
    `;
  }
}

// Container - Smart component with logic
export class TaskListComponent extends ZetaComponent {
  tasks = signal([
    { name: 'Task 1', completed: false },
    { name: 'Task 2', completed: true }
  ]);

  protected getTemplate(): string {
    return `
      <div @for="task in tasks">
        <task-item data-name="{{ task.name }}"></task-item>
      </div>
    `;
  }
}
```

### Layout Components

```typescript
export class PageLayout extends ZetaComponent {
  protected getTemplate(): string {
    return `
      <div class="page-layout">
        <header-component></header-component>
        <main-content></main-content>
        <footer-component></footer-component>
      </div>
    `;
  }
}
```

## Lifecycle Hooks

### Constructor

Initialize state and set up subscriptions:

```typescript
constructor() {
  super('my-component');
  
  // Initialize state
  this.count = signal(0);
  
  // Set up effects
  effect(() => {
    console.log('Count changed:', this.count());
  });
}
```

### mount()

Called when component is mounted to DOM:

```typescript
mount() {
  super.mount();
  
  // Access DOM element
  console.log('Mounted to:', this.element);
  
  // Fetch initial data
  this.loadData();
  
  // Add global event listeners
  window.addEventListener('resize', this.handleResize);
}
```

### render()

Called to render the component:

```typescript
protected render() {
  console.log('Rendering component');
  super.render();
  console.log('Render complete');
}
```

## Best Practices

### 1. Single Responsibility

Each component should have a single, well-defined purpose:

```typescript
// ✓ Good - focused responsibility
export class UserAvatar extends ZetaComponent { }
export class UserProfile extends ZetaComponent { }
export class UserSettings extends ZetaComponent { }

// ✗ Bad - too many responsibilities
export class UserEverything extends ZetaComponent { }
```

### 2. Immutable Updates

Always create new objects/arrays when updating signals:

```typescript
// ✓ Good
tasks.update(t => [...t, newTask]);
user.update(u => ({ ...u, name: 'New Name' }));

// ✗ Bad
tasks().push(newTask);
user().name = 'New Name';
```

### 3. Type Safety

Use TypeScript interfaces for complex data:

```typescript
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export class TaskComponent extends ZetaComponent {
  tasks = signal<Task[]>([]);
  
  addTask(title: string) {
    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false
    };
    this.tasks.update(t => [...t, newTask]);
  }
}
```

### 4. Meaningful Names

Use descriptive names for components and methods:

```typescript
// ✓ Good
export class TodoListComponent extends ZetaComponent {
  addNewTodo() { }
  markTodoAsComplete() { }
}

// ✗ Bad
export class Component1 extends ZetaComponent {
  do() { }
  handle() { }
}
```

### 5. Keep Templates Simple

Move complex logic to methods:

```typescript
// ✓ Good
export class UserComponent extends ZetaComponent {
  isAdult() {
    return this.age() >= 18;
  }

  protected getTemplate(): string {
    return `<p>Adult: {{ isAdult() }}</p>`;
  }
}

// ✗ Bad
protected getTemplate(): string {
  return `<p>Adult: {{ age() >= 18 ? 'Yes' : 'No' }}</p>`;
}
```

## Next Steps

- Learn about [Signals](./signals.md) for state management
- Explore [Templates](./templates.md) syntax
- Study [Directives](./directives.md)
- Check out [Examples](./examples.md)

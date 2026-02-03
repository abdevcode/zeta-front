# Core Concepts

Understanding these core concepts will help you build powerful applications with Zeta.

## Component-Based Architecture

Zeta uses a component-based architecture where each component:

- Encapsulates its own state and behavior
- Has a template for rendering UI
- Can be composed with other components
- Is self-contained and reusable

```typescript
export class MyComponent extends ZetaComponent {
  constructor() {
    super('my-component'); // CSS selector
  }

  protected getTemplate(): string {
    return '<div>My Component</div>';
  }
}
```

## Reactive State with Signals

Signals are the foundation of reactivity in Zeta. They provide:

- **Automatic dependency tracking** - Components automatically update when signals change
- **Granular updates** - Only affected parts of the UI re-render
- **Type safety** - Full TypeScript support

```typescript
import { signal } from './src/core/signal/signal';

const count = signal(0);

// Read value
console.log(count()); // 0

// Update value
count.set(5);

// Update based on current value
count.update(c => c + 1);

// Subscribe to changes
count.subscribe(() => {
  console.log('Count changed:', count());
});
```

## Template System

Zeta's template system supports:

### Interpolation

Display dynamic values using `{{ expression }}`:

```html
<h1>Hello, {{ name }}!</h1>
<p>Count: {{ count() }}</p>
<span>Result: {{ multiply(2, 3) }}</span>
```

### Event Binding

Bind events using the `@click` directive:

```html
<button @click="handleClick()">Click Me</button>
<input @input="handleInput($event)">
```

### Two-Way Data Binding

Bind form inputs with `@model`:

```html
<input type="text" @model="username">
```

### Structural Directives

Create dynamic lists with `@for`:

```html
<ul @for="item in items">
  <li>{{ item.name }}</li>
</ul>
```

## Component Lifecycle

Components in Zeta follow a simple lifecycle:

1. **Constructor** - Initialize the component
2. **mount()** - Mount the component to the DOM
3. **render()** - Render the template and bind events
4. **Updates** - Automatic updates when signals change

```typescript
export class MyComponent extends ZetaComponent {
  constructor() {
    super('my-component');
    // Initialize state here
  }

  mount() {
    // Called when component is mounted
    super.mount();
  }

  protected render() {
    // Called to render the component
    super.render();
  }
}
```

## Component Composition

Components can be nested and composed:

```typescript
// Register child component
ZetaComponent.register('child-component', ChildComponent);

// Use in parent template
export class ParentComponent extends ZetaComponent {
  protected getTemplate(): string {
    return `
      <div>
        <child-component></child-component>
      </div>
    `;
  }
}
```

## State Management

### Local State

Use signals for component-local state:

```typescript
export class CounterComponent extends ZetaComponent {
  count = signal(0);

  increment() {
    this.count.update(c => c + 1);
  }
}
```

### Computed Values

Derive values from other signals:

```typescript
import { computed } from './src/core/signal/signal';

export class MyComponent extends ZetaComponent {
  firstName = signal('John');
  lastName = signal('Doe');
  
  fullName = computed(() => {
    return `${this.firstName()} ${this.lastName()}`;
  });
}
```

### Effects

React to signal changes:

```typescript
import { effect } from './src/core/signal/signal';

export class MyComponent extends ZetaComponent {
  count = signal(0);

  constructor() {
    super('my-component');
    
    effect(() => {
      console.log('Count is now:', this.count());
    });
  }
}
```

## Data Flow

Zeta follows a unidirectional data flow:

1. **State** (signals) holds the source of truth
2. **Template** renders based on state
3. **Events** trigger state updates
4. **Reactivity** automatically updates the UI

```
State (Signal)
    ↓
 Template
    ↓
   DOM
    ↓
  Events
    ↓
State Updates → (cycle repeats)
```

## Reactivity System

Zeta's reactivity is based on:

### Signal Subscriptions

When you use a signal in a template, Zeta automatically subscribes to changes:

```typescript
// This automatically updates when count changes
<p>{{ count() }}</p>
```

### Manual Subscriptions

You can also manually subscribe:

```typescript
const unsubscribe = count.subscribe(() => {
  // React to changes
});

// Later, unsubscribe
unsubscribe();
```

### Batch Updates

Multiple signal updates are batched for efficiency:

```typescript
count.set(1);
count.set(2);
count.set(3);
// Only one UI update occurs
```

## Type Safety

Zeta is fully typed with TypeScript:

```typescript
// Signals are type-safe
const count = signal<number>(0);
count.set(5);     // ✓ OK
count.set('5');   // ✗ Type error

// Components can define their own types
interface Task {
  id: number;
  name: string;
  completed: boolean;
}

export class TaskList extends ZetaComponent {
  tasks = signal<Task[]>([]);
  
  addTask(name: string) {
    this.tasks.update(tasks => [
      ...tasks,
      { id: Date.now(), name, completed: false }
    ]);
  }
}
```

## Performance Considerations

### Immutable Updates

Always create new objects/arrays when updating signals:

```typescript
// ✓ Good - immutable
tasks.update(t => [...t, newTask]);

// ✗ Bad - mutation
tasks().push(newTask);
```

### Computed Values

Use computed values to avoid recalculating expensive operations:

```typescript
// ✓ Good - cached until dependencies change
filteredTasks = computed(() => {
  return this.tasks().filter(t => !t.completed);
});

// ✗ Bad - recalculated on every render
get filteredTasks() {
  return this.tasks().filter(t => !t.completed);
}
```

### Structural Directives

The `@for` directive efficiently updates only changed items.

## Next Steps

- Learn more about [Components](./components.md)
- Dive deeper into [Signals](./signals.md)
- Explore [Template Syntax](./templates.md)
- Study [Directives](./directives.md)

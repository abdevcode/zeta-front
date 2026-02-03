# API Reference

Complete API documentation for Zeta Framework.

## Core Classes

### ZetaComponent

Base class for all components.

```typescript
class ZetaComponent {
  constructor(selector: string)
  mount(): void
  protected render(): void
  protected getTemplate(): string
  static register(tagName: string, componentClass: ComponentConstructor): void
}
```

#### Constructor

```typescript
constructor(selector: string)
```

Creates a new component instance.

**Parameters:**
- `selector` - CSS selector for mounting the component

**Example:**
```typescript
export class MyComponent extends ZetaComponent {
  constructor() {
    super('my-component');
  }
}
```

#### mount()

```typescript
mount(): void
```

Mounts the component to the DOM and triggers rendering.

**Example:**
```typescript
const component = new MyComponent();
component.mount();
```

#### getTemplate()

```typescript
protected getTemplate(): string
```

Returns the HTML template for the component. Must be overridden in subclasses.

**Returns:** HTML template string

**Example:**
```typescript
protected getTemplate(): string {
  return `<div>Hello World</div>`;
}
```

#### register()

```typescript
static register(tagName: string, componentClass: ComponentConstructor): void
```

Registers a component for use as a custom element.

**Parameters:**
- `tagName` - HTML tag name for the component
- `componentClass` - Component class constructor

**Example:**
```typescript
ZetaComponent.register('my-button', ButtonComponent);
```

### Zeta

Main application class.

```typescript
class Zeta {
  constructor()
  registerComponent(component: ZetaComponent): void
}
```

#### Constructor

```typescript
constructor()
```

Creates a new Zeta application instance.

**Example:**
```typescript
const app = new Zeta();
```

#### registerComponent()

```typescript
registerComponent(component: ZetaComponent): void
```

Registers a component with the application.

**Parameters:**
- `component` - Component instance to register

**Example:**
```typescript
const app = new Zeta();
const component = new MyComponent();
app.registerComponent(component);
```

## Signal API

### signal()

```typescript
function signal<T>(initialValue: T): Signal<T>
```

Creates a new signal with the given initial value.

**Parameters:**
- `initialValue` - Initial value for the signal

**Returns:** Signal instance

**Example:**
```typescript
const count = signal(0);
const name = signal('Alice');
const items = signal<string[]>([]);
```

### Signal Interface

```typescript
interface Signal<T> {
  (): T
  (value: T): void
  get(): T
  set(value: T): void
  update(updater: (current: T) => T): void
  subscribe(subscriber: () => void): () => void
}
```

#### Call as Function (get)

```typescript
(): T
```

Gets the current value of the signal.

**Returns:** Current signal value

**Example:**
```typescript
const count = signal(0);
console.log(count()); // 0
```

#### get()

```typescript
get(): T
```

Gets the current value of the signal (alternative syntax).

**Returns:** Current signal value

**Example:**
```typescript
const count = signal(0);
console.log(count.get()); // 0
```

#### set()

```typescript
set(value: T): void
```

Sets a new value for the signal.

**Parameters:**
- `value` - New value to set

**Example:**
```typescript
const count = signal(0);
count.set(5);
```

#### update()

```typescript
update(updater: (current: T) => T): void
```

Updates the signal value based on the current value.

**Parameters:**
- `updater` - Function that receives current value and returns new value

**Example:**
```typescript
const count = signal(0);
count.update(c => c + 1);
```

#### subscribe()

```typescript
subscribe(subscriber: () => void): () => void
```

Subscribes to signal changes.

**Parameters:**
- `subscriber` - Function to call when signal changes

**Returns:** Unsubscribe function

**Example:**
```typescript
const count = signal(0);
const unsubscribe = count.subscribe(() => {
  console.log('Count changed:', count());
});

// Later
unsubscribe();
```

### computed()

```typescript
function computed<T>(fn: () => T): Signal<T>
```

Creates a computed signal that derives its value from other signals.

**Parameters:**
- `fn` - Function that computes the value

**Returns:** Computed signal

**Example:**
```typescript
const firstName = signal('John');
const lastName = signal('Doe');

const fullName = computed(() => {
  return `${firstName()} ${lastName()}`;
});
```

### effect()

```typescript
function effect(fn: () => void): () => void
```

Runs a side effect in response to signal changes.

**Parameters:**
- `fn` - Effect function to run

**Returns:** Cleanup function

**Example:**
```typescript
const count = signal(0);

effect(() => {
  console.log('Count is:', count());
});
```

### isSignal()

```typescript
function isSignal(value: any): value is Signal<any>
```

Checks if a value is a signal.

**Parameters:**
- `value` - Value to check

**Returns:** `true` if value is a signal

**Example:**
```typescript
const count = signal(0);
const num = 5;

isSignal(count); // true
isSignal(num);   // false
```

## Template Directives

### Interpolation

```html
{{ expression }}
```

Displays the result of an expression.

**Example:**
```html
<p>Count: {{ count() }}</p>
<p>Name: {{ name() }}</p>
<p>Result: {{ multiply(2, 3) }}</p>
```

### @click

```html
<element @click="handler()">
```

Binds a click event handler.

**Example:**
```html
<button @click="increment()">+</button>
<div @click="handleClick($event)">Click me</div>
```

### @model

```html
<input @model="signalName">
```

Two-way data binding for form inputs.

**Example:**
```html
<input type="text" @model="username">
<input type="email" @model="email">
<textarea @model="message"></textarea>
```

### @for

```html
<element @for="item in collection">
```

Renders an element for each item in a collection.

**Syntax:**
- `item` - Variable name for each item
- `collection` - Array or signal containing array

**Example:**
```html
<ul @for="task in tasks">
  <li>{{ task.name }}</li>
</ul>

<div @for="user in users">
  <p>{{ user.name }} - {{ user.email }}</p>
</div>
```

## Type Definitions

### ComponentConstructor

```typescript
type ComponentConstructor = new () => ZetaComponent
```

Type for component constructors.

### Signal Type

```typescript
interface Signal<T> {
  (): T;
  (value: T): void;
  get(): T;
  set(value: T): void;
  update(updater: (current: T) => T): void;
  subscribe(subscriber: () => void): () => void;
}
```

## Best Practices

### Component Definition

```typescript
// ✓ Good
export class MyComponent extends ZetaComponent {
  state = signal(initialValue);

  constructor() {
    super('my-component');
  }

  method() {
    // Use update for immutable changes
    this.state.update(s => ({ ...s, changed: true }));
  }

  protected getTemplate(): string {
    return template;
  }
}
```

### Signal Usage

```typescript
// ✓ Good - Immutable updates
items.update(arr => [...arr, newItem]);
user.update(u => ({ ...u, name: 'New' }));

// ✗ Bad - Mutations
items().push(newItem);
user().name = 'New';
```

### Template Expressions

```typescript
// ✓ Good - Simple expressions
{{ count() }}
{{ isValid() }}
{{ getName() }}

// ✗ Bad - Complex logic
{{ count() > 10 ? 'High' : 'Low' }}
{{ items().filter(i => i.active).length }}

// Instead, use computed or methods
isHigh = computed(() => this.count() > 10);
activeCount = computed(() => this.items().filter(i => i.active).length);
```

## Error Handling

### Component Errors

```typescript
export class MyComponent extends ZetaComponent {
  error = signal<string | null>(null);

  async loadData() {
    try {
      const data = await fetch('/api/data');
      // Process data
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  protected getTemplate(): string {
    return `
      <div>
        <div class="error">{{ error() }}</div>
      </div>
    `;
  }
}
```

### Validation

```typescript
export class FormComponent extends ZetaComponent {
  email = signal('');
  
  isValidEmail = computed(() => {
    const email = this.email();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  });

  submit() {
    if (!this.isValidEmail()) {
      console.error('Invalid email');
      return;
    }
    // Submit form
  }
}
```

## Next Steps

- Review [Core Concepts](./core-concepts.md)
- Check out [Examples](./examples.md)
- Build your own components!

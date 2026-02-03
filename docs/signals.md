# Signals

Signals are the core reactive primitive in Zeta. They provide fine-grained reactivity that automatically updates the UI when state changes.

## What is a Signal?

A signal is a container for a value that notifies subscribers when the value changes. Signals are:

- **Reactive** - UI automatically updates when signal values change
- **Type-safe** - Full TypeScript support
- **Efficient** - Only affected components re-render
- **Simple** - Easy to create and use

## Creating Signals

### Basic Signal

```typescript
import { signal } from './src/core/signal/signal';

const count = signal(0);
const name = signal('Alice');
const items = signal<string[]>([]);
```

### Typed Signals

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user = signal<User>({
  id: 1,
  name: 'Alice',
  email: 'alice@example.com'
});

const users = signal<User[]>([]);
```

## Reading Signal Values

### Using the Getter

Call the signal as a function to read its value:

```typescript
const count = signal(0);

console.log(count());  // 0
```

### Using .get() Method

Alternative syntax:

```typescript
const count = signal(0);

console.log(count.get());  // 0
```

### In Templates

Signals automatically track dependencies in templates:

```html
<p>Count: {{ count() }}</p>
<p>Name: {{ name() }}</p>
```

## Updating Signal Values

### Using .set()

Replace the entire value:

```typescript
const count = signal(0);
count.set(5);
console.log(count());  // 5

const user = signal({ name: 'Alice', age: 30 });
user.set({ name: 'Bob', age: 25 });
```

### Using .update()

Update based on the current value:

```typescript
const count = signal(0);

// Increment
count.update(c => c + 1);

// Decrement
count.update(c => c - 1);

// Multiply
count.update(c => c * 2);
```

### Immutable Updates

For objects and arrays, always create new instances:

```typescript
// Arrays
const items = signal(['a', 'b']);

// ✓ Good - immutable
items.update(arr => [...arr, 'c']);
items.update(arr => arr.filter(item => item !== 'a'));

// ✗ Bad - mutation
items().push('c');  // Won't trigger updates!

// Objects
const user = signal({ name: 'Alice', age: 30 });

// ✓ Good - immutable
user.update(u => ({ ...u, age: 31 }));

// ✗ Bad - mutation
user().age = 31;  // Won't trigger updates!
```

## Computed Signals

Computed signals derive their value from other signals and automatically recalculate when dependencies change.

### Basic Computed

```typescript
import { signal, computed } from './src/core/signal/signal';

const firstName = signal('John');
const lastName = signal('Doe');

const fullName = computed(() => {
  return `${firstName()} ${lastName()}`;
});

console.log(fullName());  // "John Doe"

firstName.set('Jane');
console.log(fullName());  // "Jane Doe"
```

### Complex Computed

```typescript
const items = signal([
  { name: 'Apple', price: 1.50, quantity: 3 },
  { name: 'Banana', price: 0.75, quantity: 5 }
]);

const total = computed(() => {
  return items().reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
});

console.log(total());  // 8.25
```

### Chaining Computed

```typescript
const radius = signal(5);

const area = computed(() => {
  return Math.PI * radius() * radius();
});

const areaString = computed(() => {
  return `${area().toFixed(2)} sq units`;
});

console.log(areaString());  // "78.54 sq units"
```

## Effects

Effects run side effects in response to signal changes.

### Basic Effect

```typescript
import { signal, effect } from './src/core/signal/signal';

const count = signal(0);

effect(() => {
  console.log('Count is:', count());
});

count.set(5);  // Logs: "Count is: 5"
```

### Multiple Dependencies

Effects automatically track all signals accessed:

```typescript
const firstName = signal('John');
const lastName = signal('Doe');

effect(() => {
  console.log(`Full name: ${firstName()} ${lastName()}`);
});

firstName.set('Jane');  // Logs: "Full name: Jane Doe"
lastName.set('Smith');  // Logs: "Full name: Jane Smith"
```

### Cleanup Effects

```typescript
const userId = signal(1);

effect(() => {
  const id = userId();
  console.log('Fetching user:', id);
  
  // This effect runs every time userId changes
  fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(data => console.log('User data:', data));
});
```

## Subscriptions

Subscribe to signal changes manually:

### Basic Subscription

```typescript
const count = signal(0);

const unsubscribe = count.subscribe(() => {
  console.log('Count changed to:', count());
});

count.set(5);  // Logs: "Count changed to: 5"

// Clean up when done
unsubscribe();
```

### Multiple Subscribers

```typescript
const temperature = signal(20);

const sub1 = temperature.subscribe(() => {
  console.log('Subscriber 1:', temperature());
});

const sub2 = temperature.subscribe(() => {
  console.log('Subscriber 2:', temperature());
});

temperature.set(25);
// Logs both:
// "Subscriber 1: 25"
// "Subscriber 2: 25"

// Clean up
sub1();
sub2();
```

## Signal Patterns

### Loading State

```typescript
export class DataComponent extends ZetaComponent {
  data = signal<any[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  async loadData() {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      this.data.set(result);
    } catch (err) {
      this.error.set('Failed to load data');
    } finally {
      this.loading.set(false);
    }
  }

  protected getTemplate(): string {
    return `
      <div>
        <div>{{ loading() ? 'Loading...' : '' }}</div>
        <div>{{ error() }}</div>
        <ul @for="item in data">
          <li>{{ item.name }}</li>
        </ul>
      </div>
    `;
  }
}
```

### Form State

```typescript
export class FormComponent extends ZetaComponent {
  email = signal('');
  password = signal('');
  
  isValid = computed(() => {
    return this.email().includes('@') && 
           this.password().length >= 8;
  });

  submit() {
    if (this.isValid()) {
      console.log('Form submitted');
    }
  }

  protected getTemplate(): string {
    return `
      <form>
        <input type="email" @model="email">
        <input type="password" @model="password">
        <button 
          @click="submit()" 
          disabled="{{ !isValid() }}">
          Submit
        </button>
      </form>
    `;
  }
}
```

### Toggle State

```typescript
export class ToggleComponent extends ZetaComponent {
  isOpen = signal(false);

  toggle() {
    this.isOpen.update(v => !v);
  }

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
  }

  protected getTemplate(): string {
    return `
      <div>
        <button @click="toggle()">
          {{ isOpen() ? 'Hide' : 'Show' }}
        </button>
        <div>{{ isOpen() ? 'Content visible' : '' }}</div>
      </div>
    `;
  }
}
```

### List Operations

```typescript
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export class TaskListComponent extends ZetaComponent {
  tasks = signal<Task[]>([]);

  addTask(title: string) {
    this.tasks.update(tasks => [
      ...tasks,
      { id: Date.now(), title, completed: false }
    ]);
  }

  removeTask(id: number) {
    this.tasks.update(tasks => 
      tasks.filter(t => t.id !== id)
    );
  }

  toggleTask(id: number) {
    this.tasks.update(tasks =>
      tasks.map(t => 
        t.id === id 
          ? { ...t, completed: !t.completed }
          : t
      )
    );
  }

  updateTask(id: number, title: string) {
    this.tasks.update(tasks =>
      tasks.map(t =>
        t.id === id
          ? { ...t, title }
          : t
      )
    );
  }

  // Computed values
  completedTasks = computed(() => {
    return this.tasks().filter(t => t.completed);
  });

  incompleteTasks = computed(() => {
    return this.tasks().filter(t => !t.completed);
  });

  taskCount = computed(() => {
    return this.tasks().length;
  });
}
```

## Performance Tips

### Batch Updates

Signals automatically batch updates:

```typescript
const count = signal(0);

count.set(1);
count.set(2);
count.set(3);
// Only triggers one UI update with final value: 3
```

### Avoid Unnecessary Signals

Don't use signals for static data:

```typescript
// ✓ Good
export class Component extends ZetaComponent {
  items = signal(['a', 'b', 'c']);  // Dynamic data
  maxItems = 100;  // Static constant
}

// ✗ Bad
export class Component extends ZetaComponent {
  maxItems = signal(100);  // Unnecessary signal
}
```

### Use Computed for Derived Values

```typescript
// ✓ Good - cached
const doubled = computed(() => count() * 2);

// ✗ Bad - recalculated every time
function getDoubled() {
  return count() * 2;
}
```

### Minimize Signal Reads

```typescript
// ✓ Good - read once
const value = signal();
if (value > 10) {
  console.log(value);
}

// ✗ Bad - read multiple times
if (signal() > 10) {
  console.log(signal());
}
```

## Debugging Signals

### Log Signal Changes

```typescript
const count = signal(0);

count.subscribe(() => {
  console.log('Count changed:', count());
});
```

### Track Effect Runs

```typescript
effect(() => {
  console.log('Effect running, count:', count());
});
```

### Inspect Signal Values

Use browser devtools to inspect component instances:

```typescript
// In browser console
$0.__proto__  // View component properties
```

## Common Pitfalls

### Mutating Signal Values

```typescript
// ✗ Wrong - mutation doesn't trigger updates
const items = signal([1, 2, 3]);
items().push(4);  // Won't update UI!

// ✓ Correct - immutable update
items.update(arr => [...arr, 4]);
```

### Forgetting to Call Signal

```typescript
// ✗ Wrong - passing the signal itself
<p>Count: {{ count }}</p>

// ✓ Correct - calling the signal
<p>Count: {{ count() }}</p>
```

### Synchronous Infinite Loops

```typescript
// ✗ Wrong - infinite loop
effect(() => {
  count.set(count() + 1);  // Triggers itself!
});

// ✓ Correct - conditional updates
effect(() => {
  if (count() < 10) {
    setTimeout(() => count.set(count() + 1), 1000);
  }
});
```

## Next Steps

- Learn about [Templates](./templates.md)
- Explore [Directives](./directives.md)
- See [Examples](./examples.md) for real-world patterns

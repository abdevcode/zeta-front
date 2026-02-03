# Directives

Directives are special attributes that add behavior to HTML elements in Zeta templates.

## Built-in Directives

### @click - Event Handling

Binds click event handlers to elements.

#### Basic Usage

```html
<button @click="handleClick()">Click Me</button>
```

```typescript
export class MyComponent extends ZetaComponent {
  count = signal(0);

  handleClick() {
    this.count.update(c => c + 1);
  }
}
```

#### With Parameters

```html
<button @click="increment(5)">+5</button>
<button @click="setColor('red')">Red</button>
```

```typescript
export class MyComponent extends ZetaComponent {
  count = signal(0);
  color = signal('blue');

  increment(amount: number) {
    this.count.update(c => c + amount);
  }

  setColor(newColor: string) {
    this.color.set(newColor);
  }
}
```

#### With Event Object

```html
<button @click="handleClick($event)">Click</button>
```

```typescript
export class MyComponent extends ZetaComponent {
  handleClick(event: Event) {
    console.log('Button clicked', event);
    event.preventDefault();
  }
}
```

### @model - Two-Way Data Binding

Binds form inputs to signals for automatic synchronization.

#### Text Input

```html
<input type="text" @model="username">
<p>Username: {{ username() }}</p>
```

```typescript
export class MyComponent extends ZetaComponent {
  username = signal('');
}
```

#### Email Input

```html
<input type="email" @model="email">
```

```typescript
export class MyComponent extends ZetaComponent {
  email = signal('');
}
```

#### Password Input

```html
<input type="password" @model="password">
```

```typescript
export class MyComponent extends ZetaComponent {
  password = signal('');
}
```

#### Textarea

```html
<textarea @model="message"></textarea>
```

```typescript
export class MyComponent extends ZetaComponent {
  message = signal('');
}
```

#### Number Input

```html
<input type="number" @model="age">
```

```typescript
export class MyComponent extends ZetaComponent {
  age = signal(0);
}
```

#### Form Example

```html
<form>
  <input type="text" @model="name" placeholder="Name">
  <input type="email" @model="email" placeholder="Email">
  <textarea @model="message" placeholder="Message"></textarea>
  <button @click="submit()">Submit</button>
</form>
```

```typescript
export class FormComponent extends ZetaComponent {
  name = signal('');
  email = signal('');
  message = signal('');

  submit() {
    console.log({
      name: this.name(),
      email: this.email(),
      message: this.message()
    });
  }
}
```

### @for - List Rendering

Renders an element for each item in a collection.

#### Basic Usage

```html
<ul @for="item in items">
  <li>{{ item }}</li>
</ul>
```

```typescript
export class ListComponent extends ZetaComponent {
  items = signal(['Apple', 'Banana', 'Cherry']);
}
```

#### With Objects

```html
<div @for="user in users">
  <h3>{{ user.name }}</h3>
  <p>{{ user.email }}</p>
</div>
```

```typescript
interface User {
  name: string;
  email: string;
}

export class UserListComponent extends ZetaComponent {
  users = signal<User[]>([
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' }
  ]);
}
```

#### Nested Loops

```html
<div @for="category in categories">
  <h2>{{ category.name }}</h2>
  <ul @for="product in category.products">
    <li>{{ product.name }}</li>
  </ul>
</div>
```

```typescript
interface Product {
  name: string;
  price: number;
}

interface Category {
  name: string;
  products: Product[];
}

export class CatalogComponent extends ZetaComponent {
  categories = signal<Category[]>([
    {
      name: 'Electronics',
      products: [
        { name: 'Laptop', price: 999 },
        { name: 'Mouse', price: 25 }
      ]
    },
    {
      name: 'Books',
      products: [
        { name: 'TypeScript Guide', price: 39 }
      ]
    }
  ]);
}
```

#### With Index (using properties)

```html
<div @for="task in tasks">
  <p>{{ task.id }}. {{ task.name }}</p>
</div>
```

```typescript
interface Task {
  id: number;
  name: string;
}

export class TaskListComponent extends ZetaComponent {
  tasks = signal<Task[]>([
    { id: 1, name: 'Task 1' },
    { id: 2, name: 'Task 2' }
  ]);
}
```

#### Dynamic Lists

Lists automatically update when the signal changes:

```typescript
export class TodoComponent extends ZetaComponent {
  todos = signal<string[]>(['Learn Zeta', 'Build App']);

  addTodo() {
    this.todos.update(t => [...t, 'New Task']);
  }

  removeTodo(index: number) {
    this.todos.update(t => t.filter((_, i) => i !== index));
  }

  protected getTemplate(): string {
    return `
      <div>
        <ul @for="todo in todos">
          <li>{{ todo }}</li>
        </ul>
        <button @click="addTodo()">Add</button>
      </div>
    `;
  }
}
```

## Combining Directives

### @for with @click

```html
<ul @for="task in tasks">
  <li>
    {{ task.name }}
    <button @click="removeTask({{ task.id }})">Delete</button>
  </li>
</ul>
```

```typescript
interface Task {
  id: number;
  name: string;
}

export class TaskComponent extends ZetaComponent {
  tasks = signal<Task[]>([
    { id: 1, name: 'Task 1' },
    { id: 2, name: 'Task 2' }
  ]);

  removeTask(id: number) {
    this.tasks.update(tasks => 
      tasks.filter(t => t.id !== id)
    );
  }
}
```

### @for with @model

```html
<div @for="item in items">
  <input type="checkbox" @model="item.completed">
  <span>{{ item.name }}</span>
</div>
```

## Directive Patterns

### Toggle List Items

```html
<ul @for="item in items">
  <li @click="toggleItem({{ item.id }})">
    {{ item.completed ? '✓' : '○' }} {{ item.name }}
  </li>
</ul>
```

```typescript
interface Item {
  id: number;
  name: string;
  completed: boolean;
}

export class ChecklistComponent extends ZetaComponent {
  items = signal<Item[]>([
    { id: 1, name: 'Item 1', completed: false },
    { id: 2, name: 'Item 2', completed: true }
  ]);

  toggleItem(id: number) {
    this.items.update(items =>
      items.map(item =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  }
}
```

### Editable List

```html
<ul @for="task in tasks">
  <li>
    <input type="text" @model="task.name">
    <button @click="saveTask({{ task.id }})">Save</button>
    <button @click="deleteTask({{ task.id }})">Delete</button>
  </li>
</ul>
```

### Sortable List

```html
<div>
  <button @click="sortAscending()">Sort A-Z</button>
  <button @click="sortDescending()">Sort Z-A</button>
  <ul @for="item in sortedItems">
    <li>{{ item.name }}</li>
  </ul>
</div>
```

```typescript
export class SortableListComponent extends ZetaComponent {
  items = signal([
    { name: 'Charlie' },
    { name: 'Alice' },
    { name: 'Bob' }
  ]);

  sortedItems = computed(() => {
    return [...this.items()].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  });

  sortAscending() {
    this.items.update(items =>
      [...items].sort((a, b) => a.name.localeCompare(b.name))
    );
  }

  sortDescending() {
    this.items.update(items =>
      [...items].sort((a, b) => b.name.localeCompare(a.name))
    );
  }
}
```

## Best Practices

### Use Immutable Updates with @for

```typescript
// ✓ Good
addItem() {
  this.items.update(arr => [...arr, newItem]);
}

// ✗ Bad
addItem() {
  this.items().push(newItem); // Won't trigger re-render
}
```

### Keep Event Handlers Simple

```typescript
// ✓ Good
handleClick() {
  this.doSomething();
}

protected getTemplate(): string {
  return `<button @click="handleClick()">Click</button>`;
}

// ✗ Bad - complex logic in template
protected getTemplate(): string {
  return `<button @click="count.update(c => c > 0 ? c - 1 : 0)">Click</button>`;
}
```

### Use Computed for Filtered Lists

```typescript
// ✓ Good
filteredItems = computed(() => {
  return this.items().filter(i => i.active);
});

protected getTemplate(): string {
  return `<ul @for="item in filteredItems">...</ul>`;
}

// ✗ Bad - filtering in template creates performance issues
```

## Common Patterns

### Search/Filter

```html
<div>
  <input type="text" @model="searchTerm" placeholder="Search...">
  <ul @for="item in filteredItems">
    <li>{{ item.name }}</li>
  </ul>
</div>
```

```typescript
export class SearchComponent extends ZetaComponent {
  items = signal([
    { name: 'Apple' },
    { name: 'Banana' },
    { name: 'Cherry' }
  ]);

  searchTerm = signal('');

  filteredItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.items().filter(item =>
      item.name.toLowerCase().includes(term)
    );
  });
}
```

### Pagination

```html
<div>
  <ul @for="item in paginatedItems">
    <li>{{ item.name }}</li>
  </ul>
  <button @click="previousPage()">Previous</button>
  <span>Page {{ currentPage() }} of {{ totalPages() }}</span>
  <button @click="nextPage()">Next</button>
</div>
```

```typescript
export class PaginatedListComponent extends ZetaComponent {
  items = signal([...Array(50)].map((_, i) => ({ name: `Item ${i + 1}` })));
  currentPage = signal(1);
  itemsPerPage = 10;

  paginatedItems = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.items().slice(start, start + this.itemsPerPage);
  });

  totalPages = computed(() => {
    return Math.ceil(this.items().length / this.itemsPerPage);
  });

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }
}
```

## Next Steps

- Learn about [Components](./components.md)
- Explore [Signals](./signals.md)
- Check out [Examples](./examples.md)

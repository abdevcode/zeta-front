# Examples

This guide shows how to build real-world components with Zeta, from simple counters to complex applications.

## Example 1: Counter

A simple counter with increment and decrement.

**counter.component.ts:**
```typescript
import { ZetaComponent } from '../../../src/core/zeta';
import { signal } from '../../../src/core/signal/signal';
import template from './counter.component.html';

export class CounterComponent extends ZetaComponent {
  count = signal(0);

  constructor() {
    super('counter-component');
  }

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
    return template;
  }
}
```

**counter.component.html:**
```html
<div class="counter">
  <h2>Counter: {{ count() }}</h2>
  <button @click="increment()">+</button>
  <button @click="decrement()">-</button>
  <button @click="reset()">Reset</button>
</div>
```

## Example 2: Todo List

A complete todo list with add, remove, and toggle functionality.

**todo-list.component.ts:**
```typescript
import { ZetaComponent } from '../../../src/core/zeta';
import { signal, computed } from '../../../src/core/signal/signal';
import template from './todo-list.component.html';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export class TodoListComponent extends ZetaComponent {
  todos = signal<Todo[]>([]);
  newTodoText = signal('');

  constructor() {
    super('todo-list-component');
  }

  // Computed values
  activeTodos = computed(() => {
    return this.todos().filter(t => !t.completed);
  });

  completedTodos = computed(() => {
    return this.todos().filter(t => t.completed);
  });

  // Methods
  addTodo() {
    const text = this.newTodoText().trim();
    if (text) {
      this.todos.update(todos => [
        ...todos,
        { id: Date.now(), text, completed: false }
      ]);
      this.newTodoText.set('');
    }
  }

  removeTodo(id: number) {
    this.todos.update(todos => todos.filter(t => t.id !== id));
  }

  toggleTodo(id: number) {
    this.todos.update(todos =>
      todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }

  clearCompleted() {
    this.todos.update(todos => todos.filter(t => !t.completed));
  }

  protected getTemplate(): string {
    return template;
  }
}
```

**todo-list.component.html:**
```html
<div class="todo-list">
  <h2>Todo List</h2>
  
  <!-- Input -->
  <div class="todo-input">
    <input 
      type="text" 
      @model="newTodoText" 
      placeholder="What needs to be done?">
    <button @click="addTodo()">Add</button>
  </div>

  <!-- Stats -->
  <div class="todo-stats">
    <span>{{ activeTodos().length }} active</span>
    <span>{{ completedTodos().length }} completed</span>
  </div>

  <!-- Todo items -->
  <ul class="todo-items" @for="todo in todos">
    <li>
      <input 
        type="checkbox" 
        @click="toggleTodo({{ todo.id }})">
      <span>{{ todo.text }}</span>
      <button @click="removeTodo({{ todo.id }})">Delete</button>
    </li>
  </ul>

  <!-- Clear completed -->
  <button @click="clearCompleted()">Clear Completed</button>
</div>
```

## Example 3: Form with Validation

A form with real-time validation.

**form.component.ts:**
```typescript
import { ZetaComponent } from '../../../src/core/zeta';
import { signal, computed } from '../../../src/core/signal/signal';
import template from './form.component.html';

export class FormComponent extends ZetaComponent {
  email = signal('');
  password = signal('');
  confirmPassword = signal('');
  submitted = signal(false);

  constructor() {
    super('form-component');
  }

  // Validation
  emailValid = computed(() => {
    const email = this.email();
    return email.includes('@') && email.includes('.');
  });

  passwordValid = computed(() => {
    return this.password().length >= 8;
  });

  passwordsMatch = computed(() => {
    return this.password() === this.confirmPassword();
  });

  formValid = computed(() => {
    return this.emailValid() && 
           this.passwordValid() && 
           this.passwordsMatch();
  });

  // Methods
  submit() {
    this.submitted.set(true);
    
    if (this.formValid()) {
      console.log('Form submitted!', {
        email: this.email(),
        password: this.password()
      });
      // Reset form
      this.email.set('');
      this.password.set('');
      this.confirmPassword.set('');
      this.submitted.set(false);
    }
  }

  protected getTemplate(): string {
    return template;
  }
}
```

**form.component.html:**
```html
<div class="form">
  <h2>Register</h2>
  
  <div class="form-field">
    <label>Email</label>
    <input type="email" @model="email">
    <span class="error">
      {{ submitted() && !emailValid() ? 'Invalid email' : '' }}
    </span>
  </div>

  <div class="form-field">
    <label>Password</label>
    <input type="password" @model="password">
    <span class="error">
      {{ submitted() && !passwordValid() ? 'Min 8 characters' : '' }}
    </span>
  </div>

  <div class="form-field">
    <label>Confirm Password</label>
    <input type="password" @model="confirmPassword">
    <span class="error">
      {{ submitted() && !passwordsMatch() ? 'Passwords do not match' : '' }}
    </span>
  </div>

  <button @click="submit()">Submit</button>
</div>
```

## Example 4: Data Fetching

Component that fetches and displays data from an API.

**user-list.component.ts:**
```typescript
import { ZetaComponent } from '../../../src/core/zeta';
import { signal } from '../../../src/core/signal/signal';
import template from './user-list.component.html';

interface User {
  id: number;
  name: string;
  email: string;
}

export class UserListComponent extends ZetaComponent {
  users = signal<User[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    super('user-list-component');
  }

  mount() {
    super.mount();
    this.loadUsers();
  }

  async loadUsers() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      this.users.set(data);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      this.loading.set(false);
    }
  }

  refresh() {
    this.loadUsers();
  }

  protected getTemplate(): string {
    return template;
  }
}
```

**user-list.component.html:**
```html
<div class="user-list">
  <h2>Users</h2>
  <button @click="refresh()">Refresh</button>

  <!-- Loading state -->
  <div>{{ loading() ? 'Loading...' : '' }}</div>

  <!-- Error state -->
  <div class="error">{{ error() }}</div>

  <!-- User list -->
  <ul @for="user in users">
    <li>
      <strong>{{ user.name }}</strong>
      <span>{{ user.email }}</span>
    </li>
  </ul>
</div>
```

## Example 5: Nested Components

Building complex UIs with nested components.

**user-card.component.ts:**
```typescript
import { ZetaComponent } from '../../../../src/core/zeta';
import { signal } from '../../../../src/core/signal/signal';
import template from './user-card.component.html';

export class UserCardComponent extends ZetaComponent {
  name = signal('');
  role = signal('');

  constructor() {
    super('user-card');
  }

  mount() {
    super.mount();
    // Read attributes
    this.name.set(this.element?.getAttribute('data-name') || '');
    this.role.set(this.element?.getAttribute('data-role') || '');
  }

  protected getTemplate(): string {
    return template;
  }
}
```

**user-card.component.html:**
```html
<div class="user-card">
  <h3>{{ name() }}</h3>
  <p>{{ role() }}</p>
</div>
```

**team.component.ts:**
```typescript
import { ZetaComponent } from '../../../src/core/zeta';
import { signal } from '../../../src/core/signal/signal';
import { UserCardComponent } from './user-card/user-card.component';
import template from './team.component.html';

ZetaComponent.register('user-card', UserCardComponent);

interface TeamMember {
  name: string;
  role: string;
}

export class TeamComponent extends ZetaComponent {
  members = signal<TeamMember[]>([
    { name: 'Alice', role: 'Developer' },
    { name: 'Bob', role: 'Designer' },
    { name: 'Charlie', role: 'Manager' }
  ]);

  constructor() {
    super('team-component');
  }

  protected getTemplate(): string {
    return template;
  }
}
```

**team.component.html:**
```html
<div class="team">
  <h2>Team Members</h2>
  <div @for="member in members">
    <user-card 
      data-name="{{ member.name }}" 
      data-role="{{ member.role }}">
    </user-card>
  </div>
</div>
```

## Example 6: Search and Filter

Component with search and filter functionality.

**product-list.component.ts:**
```typescript
import { ZetaComponent } from '../../../src/core/zeta';
import { signal, computed } from '../../../src/core/signal/signal';
import template from './product-list.component.html';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

export class ProductListComponent extends ZetaComponent {
  products = signal<Product[]>([
    { id: 1, name: 'Laptop', category: 'Electronics', price: 999 },
    { id: 2, name: 'Mouse', category: 'Electronics', price: 25 },
    { id: 3, name: 'Desk', category: 'Furniture', price: 300 },
    { id: 4, name: 'Chair', category: 'Furniture', price: 150 }
  ]);

  searchTerm = signal('');
  selectedCategory = signal('all');

  constructor() {
    super('product-list-component');
  }

  // Computed filtered list
  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const category = this.selectedCategory();

    return this.products().filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(term);
      const matchesCategory = category === 'all' || product.category === category;
      return matchesSearch && matchesCategory;
    });
  });

  protected getTemplate(): string {
    return template;
  }
}
```

**product-list.component.html:**
```html
<div class="product-list">
  <h2>Products</h2>

  <!-- Search -->
  <input 
    type="text" 
    @model="searchTerm" 
    placeholder="Search products...">

  <!-- Category filter -->
  <select @model="selectedCategory">
    <option value="all">All Categories</option>
    <option value="Electronics">Electronics</option>
    <option value="Furniture">Furniture</option>
  </select>

  <!-- Product list -->
  <div @for="product in filteredProducts">
    <div class="product">
      <h3>{{ product.name }}</h3>
      <p>{{ product.category }}</p>
      <p>${{ product.price }}</p>
    </div>
  </div>

  <!-- Results count -->
  <p>{{ filteredProducts().length }} products found</p>
</div>
```

## Creating Your Own Example

### Step 1: Create Component File

Create a new file in `examples/components/`:

```typescript
import { ZetaComponent } from '../../src/core/zeta';
import { signal } from '../../src/core/signal/signal';
import template from './my-component.html';

export class MyComponent extends ZetaComponent {
  // State
  myState = signal('initial value');

  constructor() {
    super('my-component');
  }

  // Methods
  myMethod() {
    this.myState.set('new value');
  }

  protected getTemplate(): string {
    return template;
  }
}
```

### Step 2: Create Template File

Create `my-component.html`:

```html
<div>
  <h2>My Component</h2>
  <p>{{ myState() }}</p>
  <button @click="myMethod()">Click Me</button>
</div>
```

### Step 3: Register in App

In `examples/app.ts`:

```typescript
import { Zeta } from '../src';
import { MyComponent } from './components/my-component';

const app = new Zeta();
const myComponent = new MyComponent();
app.registerComponent(myComponent);
```

### Step 4: Add to HTML

In `examples/index.html`:

```html
<body>
  <div id="app">
    <my-component></my-component>
  </div>
</body>
```

### Step 5: Run

```bash
npm start
```

Visit `http://localhost:8080` to see your component!

## Next Steps

- Review [Components](./components.md) documentation
- Learn more about [Signals](./signals.md)
- Check out [API Reference](./api-reference.md)
- Build your own custom components!

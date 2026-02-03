# Templates and Interpolation

Learn how to use Zeta's template system to create dynamic user interfaces.

## Template Basics

Templates in Zeta are HTML strings with special syntax for dynamic content and directives.

### Inline Templates

```typescript
export class MyComponent extends ZetaComponent {
  protected getTemplate(): string {
    return `
      <div>
        <h1>Hello World</h1>
      </div>
    `;
  }
}
```

### External Templates

```typescript
import template from './my-component.html';

export class MyComponent extends ZetaComponent {
  protected getTemplate(): string {
    return template;
  }
}
```

## Interpolation

Display dynamic values using `{{ expression }}` syntax.

### Simple Values

```typescript
export class MyComponent extends ZetaComponent {
  name = signal('Alice');
  age = signal(30);

  protected getTemplate(): string {
    return `
      <div>
        <p>Name: {{ name() }}</p>
        <p>Age: {{ age() }}</p>
      </div>
    `;
  }
}
```

### Method Calls

```typescript
export class MyComponent extends ZetaComponent {
  firstName = signal('John');
  lastName = signal('Doe');

  getFullName() {
    return `${this.firstName()} ${this.lastName()}`;
  }

  protected getTemplate(): string {
    return `
      <p>Full Name: {{ getFullName() }}</p>
    `;
  }
}
```

### Expressions

```typescript
export class MyComponent extends ZetaComponent {
  count = signal(5);

  protected getTemplate(): string {
    return `
      <p>Double: {{ count() * 2 }}</p>
      <p>Is Even: {{ count() % 2 === 0 }}</p>
    `;
  }
}
```

### Object Properties

```typescript
export class MyComponent extends ZetaComponent {
  user = signal({
    name: 'Alice',
    email: 'alice@example.com'
  });

  protected getTemplate(): string {
    return `
      <p>Name: {{ user().name }}</p>
      <p>Email: {{ user().email }}</p>
    `;
  }
}
```

### Computed Values

```typescript
export class MyComponent extends ZetaComponent {
  items = signal([1, 2, 3, 4, 5]);
  
  itemCount = computed(() => this.items().length);

  protected getTemplate(): string {
    return `
      <p>Total Items: {{ itemCount() }}</p>
    `;
  }
}
```

## Conditional Display

Show/hide content based on conditions.

### Using Empty Strings

```typescript
export class MyComponent extends ZetaComponent {
  showMessage = signal(true);

  protected getTemplate(): string {
    return `
      <div>
        <p>{{ showMessage() ? 'Visible' : '' }}</p>
      </div>
    `;
  }
}
```

### Using Computed

```typescript
export class MyComponent extends ZetaComponent {
  isLoggedIn = signal(false);
  
  statusMessage = computed(() => {
    return this.isLoggedIn() ? 'Welcome back!' : 'Please log in';
  });

  protected getTemplate(): string {
    return `
      <p>{{ statusMessage() }}</p>
    `;
  }
}
```

## Text Formatting

### Numbers

```typescript
export class MyComponent extends ZetaComponent {
  price = signal(19.99);
  quantity = signal(3);

  formatPrice() {
    return `$${this.price().toFixed(2)}`;
  }

  total() {
    return (this.price() * this.quantity()).toFixed(2);
  }

  protected getTemplate(): string {
    return `
      <p>Price: {{ formatPrice() }}</p>
      <p>Quantity: {{ quantity() }}</p>
      <p>Total: ${{ total() }}</p>
    `;
  }
}
```

### Dates

```typescript
export class MyComponent extends ZetaComponent {
  date = signal(new Date());

  formatDate() {
    return this.date().toLocaleDateString();
  }

  formatTime() {
    return this.date().toLocaleTimeString();
  }

  protected getTemplate(): string {
    return `
      <p>Date: {{ formatDate() }}</p>
      <p>Time: {{ formatTime() }}</p>
    `;
  }
}
```

### Strings

```typescript
export class MyComponent extends ZetaComponent {
  text = signal('hello world');

  uppercase() {
    return this.text().toUpperCase();
  }

  capitalize() {
    const text = this.text();
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  protected getTemplate(): string {
    return `
      <p>Original: {{ text() }}</p>
      <p>Uppercase: {{ uppercase() }}</p>
      <p>Capitalized: {{ capitalize() }}</p>
    `;
  }
}
```

## HTML Attributes

### Dynamic Attributes

```typescript
export class MyComponent extends ZetaComponent {
  imageUrl = signal('/images/photo.jpg');
  linkUrl = signal('https://example.com');
  inputValue = signal('');

  protected getTemplate(): string {
    return `
      <div>
        <img src="{{ imageUrl() }}" alt="Photo">
        <a href="{{ linkUrl() }}">Link</a>
        <input value="{{ inputValue() }}">
      </div>
    `;
  }
}
```

### Class Names

```typescript
export class MyComponent extends ZetaComponent {
  isActive = signal(true);
  theme = signal('dark');

  getClasses() {
    return `button ${this.isActive() ? 'active' : ''} ${this.theme()}`;
  }

  protected getTemplate(): string {
    return `
      <button class="{{ getClasses() }}">
        Click Me
      </button>
    `;
  }
}
```

### Inline Styles

```typescript
export class MyComponent extends ZetaComponent {
  color = signal('red');
  fontSize = signal(16);

  getStyle() {
    return `color: ${this.color()}; font-size: ${this.fontSize()}px;`;
  }

  protected getTemplate(): string {
    return `
      <p style="{{ getStyle() }}">
        Styled text
      </p>
    `;
  }
}
```

## Best Practices

### Keep Logic in Methods

```typescript
// ✓ Good
export class MyComponent extends ZetaComponent {
  isValidEmail() {
    return this.email().includes('@');
  }

  protected getTemplate(): string {
    return `<p>Valid: {{ isValidEmail() }}</p>`;
  }
}

// ✗ Bad
protected getTemplate(): string {
  return `<p>Valid: {{ email().includes('@') }}</p>`;
}
```

### Use Computed for Complex Values

```typescript
// ✓ Good
filteredItems = computed(() => {
  return this.items().filter(i => i.active);
});

protected getTemplate(): string {
  return `<p>Count: {{ filteredItems().length }}</p>`;
}

// ✗ Bad
protected getTemplate(): string {
  return `<p>Count: {{ items().filter(i => i.active).length }}</p>`;
}
```

### Avoid Side Effects in Templates

```typescript
// ✓ Good
increment() {
  this.count.update(c => c + 1);
}

protected getTemplate(): string {
  return `<button @click="increment()">{{ count() }}</button>`;
}

// ✗ Bad - side effect in interpolation
protected getTemplate(): string {
  return `<p>{{ count.set(count() + 1) }}</p>`;
}
```

## Common Patterns

### Empty State

```typescript
export class ListComponent extends ZetaComponent {
  items = signal<string[]>([]);

  emptyMessage = computed(() => {
    return this.items().length === 0 ? 'No items found' : '';
  });

  protected getTemplate(): string {
    return `
      <div>
        <p>{{ emptyMessage() }}</p>
        <ul @for="item in items">
          <li>{{ item }}</li>
        </ul>
      </div>
    `;
  }
}
```

### Loading State

```typescript
export class DataComponent extends ZetaComponent {
  loading = signal(false);
  data = signal(null);

  loadingText = computed(() => {
    return this.loading() ? 'Loading...' : '';
  });

  protected getTemplate(): string {
    return `
      <div>
        <p>{{ loadingText() }}</p>
        <div>{{ data() }}</div>
      </div>
    `;
  }
}
```

### Validation Messages

```typescript
export class FormComponent extends ZetaComponent {
  email = signal('');
  submitted = signal(false);

  errorMessage = computed(() => {
    if (!this.submitted()) return '';
    if (!this.email()) return 'Email is required';
    if (!this.email().includes('@')) return 'Invalid email';
    return '';
  });

  protected getTemplate(): string {
    return `
      <div>
        <input type="email" @model="email">
        <span class="error">{{ errorMessage() }}</span>
      </div>
    `;
  }
}
```

## Next Steps

- Learn about [Directives](./directives.md)
- Explore [Components](./components.md)
- Check out [Examples](./examples.md)

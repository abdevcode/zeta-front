# Zeta Framework Documentation

Welcome to the Zeta Framework documentation! Zeta is a lightweight, reactive TypeScript frontend framework with an Angular-inspired architecture.

## Documentation Index

- [Getting Started](./getting-started.md) - Installation and setup
- [Core Concepts](./core-concepts.md) - Understanding Zeta's architecture
- [Components](./components.md) - Creating and using components
- [Signals](./signals.md) - Reactive state management
- [Templates](./templates.md) - Template syntax and interpolation
- [Directives](./directives.md) - Built-in directives (@for, @click, @model)
- [API Reference](./api-reference.md) - Complete API documentation
- [Examples](./examples.md) - Real-world examples and patterns

## Quick Start

```typescript
import { ZetaComponent, signal } from './src';

export class CounterComponent extends ZetaComponent {
  count = signal(0);

  constructor() {
    super('counter-component');
  }

  increment() {
    this.count.update(c => c + 1);
  }

  protected getTemplate(): string {
    return `
      <div>
        <h1>Count: {{ count() }}</h1>
        <button @click="increment()">Increment</button>
      </div>
    `;
  }
}
```

## Features

- 🎯 **Component-based Architecture** - Modular, reusable UI components
- ⚡ **Signal-based Reactivity** - Efficient, granular reactive updates
- 🔄 **Two-way Data Binding** - Seamless form integration with @model
- 📋 **Structural Directives** - Dynamic lists with @for
- 🎪 **Event Handling** - Simple event binding with @click
- 📝 **Template Interpolation** - Dynamic content with {{ expressions }}
- 🧩 **Component Composition** - Nested components and custom elements
- 🚀 **Zero Dependencies** - Pure TypeScript, no external libraries

## Philosophy

Zeta is designed for developers who want the power of modern frameworks without the complexity. It provides:

- **Simplicity** - Easy to learn, easy to use
- **Performance** - Minimal overhead, fast updates
- **Flexibility** - Build what you need, how you need it
- **Type Safety** - Full TypeScript support

## Community

- GitHub: [zeta-front](https://github.com/yourusername/zeta-front)
- Issues: [Report bugs or request features](https://github.com/yourusername/zeta-front/issues)

## License

MIT License - see LICENSE file for details

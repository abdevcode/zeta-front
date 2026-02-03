# Getting Started with Zeta

This guide will help you set up and start using the Zeta framework.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Basic knowledge of TypeScript

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/zeta-front.git
cd zeta-front
```

2. **Install dependencies**

```bash
npm install
```

3. **Build the framework**

```bash
npm run build
```

4. **Start the development server**

```bash
npm start
```

The development server will start at `http://localhost:8080`

## Project Structure

```
zeta-front/
├── src/                    # Framework source code
│   ├── core/              # Core framework modules
│   │   ├── zeta.ts       # Main component class
│   │   ├── signal/       # Signal system
│   │   ├── data-binding/ # Data binding utilities
│   │   └── event-handler/# Event handling
│   ├── types/            # TypeScript type definitions
│   └── index.ts          # Main entry point
├── examples/              # Example applications
│   ├── app.ts            # Example app entry
│   ├── index.html        # Example HTML
│   └── components/       # Example components
├── dist/                  # Compiled output
└── docs/                  # Documentation
```

## Your First Component

Create a new file `hello.component.ts`:

```typescript
import { ZetaComponent } from './src/core/zeta';

export class HelloComponent extends ZetaComponent {
  constructor() {
    super('hello-component');
  }

  protected getTemplate(): string {
    return `
      <div>
        <h1>Hello, Zeta!</h1>
        <p>Welcome to your first component.</p>
      </div>
    `;
  }
}
```

Create a template file `hello.component.html`:

```html
<div>
  <h1>Hello, Zeta!</h1>
  <p>Welcome to your first component.</p>
</div>
```

Update your component to use the template:

```typescript
import { ZetaComponent } from './src/core/zeta';
import template from './hello.component.html';

export class HelloComponent extends ZetaComponent {
  constructor() {
    super('hello-component');
  }

  protected getTemplate(): string {
    return template;
  }
}
```

## Mounting Your Component

In your `app.ts`:

```typescript
import { Zeta } from './src';
import { HelloComponent } from './components/hello.component';

const app = new Zeta();
const hello = new HelloComponent();
app.registerComponent(hello);
```

In your `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zeta App</title>
</head>
<body>
  <div id="app">
    <hello-component></hello-component>
  </div>
  <script src="./dist/bundle.js"></script>
</body>
</html>
```

## Next Steps

- Learn about [Components](./components.md)
- Understand [Signals](./signals.md) for reactive state
- Explore [Directives](./directives.md) for dynamic templates
- Check out the [Examples](./examples.md) folder

## Development Workflow

### Watch Mode

For development with hot reload:

```bash
npm start
```

### Building for Production

```bash
npm run build
```

The optimized bundle will be in the `dist/` folder.

### TypeScript Configuration

The framework uses `tsconfig.json` for TypeScript configuration. Key settings:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "strict": true,
    "esModuleInterop": true
  }
}
```

## Troubleshooting

### Module not found errors

Make sure you've run `npm install` and the paths in your imports are correct.

### Component not rendering

1. Check that the selector matches the element in HTML
2. Verify the component is registered with the Zeta instance
3. Check browser console for errors

### TypeScript errors

Run `npm run build` to see TypeScript compilation errors in detail.

## Configuration

### Webpack Configuration

The project uses Webpack for bundling. See `webpack.config.js` for configuration details.

### HTML Loader

HTML templates are loaded using `html-loader`, allowing you to import `.html` files directly:

```typescript
import template from './component.html';
```

## Next: Core Concepts

Now that you have Zeta running, learn about the [Core Concepts](./core-concepts.md) that power the framework.

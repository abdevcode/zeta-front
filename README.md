# Zeta Framework

A custom frontend framework built with TypeScript, similar to Angular or Vue.

## Getting Started

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm start
```

This will start a dev server at `http://localhost:3000`

### Build

Build for production:

```bash
npm run build
```

The compiled files will be in the `dist/` directory.

## Project Structure

```
zeta-front/
├── src/
│   ├── core/
│   │   └── zeta.ts          # Core framework logic
│   └── index.ts             # Main entry point
├── examples/
│   └── index.html           # Example HTML file
├── dist/                    # Compiled output
├── package.json
├── tsconfig.json            # TypeScript configuration
└── webpack.config.js        # Webpack configuration
```

## Usage

The framework provides a base `Zeta` class and `ZetaComponent` class to build your custom components.

```typescript
import { Zeta, ZetaComponent } from './src/index';

class MyComponent extends ZetaComponent {
  protected render(): void {
    if (this.element) {
      this.element.innerHTML = '<h1>Hello from Zeta!</h1>';
    }
  }
}

const app = new Zeta();
app.registerComponent(new MyComponent('#app'));
```

## License

MIT

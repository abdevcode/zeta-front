import { isSignal } from '../signal/signal';

const EVENTS_WITH_PREVENT_DEFAULT = ['submit'];

export function handleEvent(element: HTMLElement, context: any): void {
  const allElements = element.querySelectorAll('*');
  
  allElements.forEach((el): void => {
    const htmlEl = el as HTMLElement;
    
    // Get all attributes starting with @
    Array.from(htmlEl.attributes).forEach(attr => {
      if (attr.name.startsWith('@') && attr.name !== '@model') {
        const eventType = attr.name.slice(1); // Remove @ prefix
        const handlerCode = attr.value;
        
        htmlEl.removeAttribute(attr.name);
        
        htmlEl.addEventListener(eventType, (e) => {
          // Prevent default for certain events
          if (EVENTS_WITH_PREVENT_DEFAULT.includes(eventType)) {
            e.preventDefault();
          }
          
          // Try to evaluate as expression first (for inline code like "count.set(5)")
          try {
            evaluateEventHandler(handlerCode, context, e);
          } catch (error) {
            console.error(`Error executing event handler "${handlerCode}":`, error);
          }
        });
      }
    });
  });
}

function evaluateEventHandler(code: string, context: any, event: Event): void {
  const proxyContext = new Proxy({}, {
    get: (_, prop) => {
      if (prop === '$event') return event;
      const value = context[prop];
      if (isSignal(value)) return value;
      if (typeof value === 'function') return value.bind(context);
      return value;
    },
    has: () => true
  });
  
  new Function('$ctx', '$event', `with($ctx) { ${code} }`)(proxyContext, event);
}
const EVENTS_WITH_PREVENT_DEFAULT = ['submit'];

export function handleEvent(element: HTMLElement, context: any): void {
  const allElements = element.querySelectorAll('*');
  
  allElements.forEach((el): void => {
    const htmlEl = el as HTMLElement;
    
    // Get all attributes starting with @
    Array.from(htmlEl.attributes).forEach(attr => {
      if (attr.name.startsWith('@') && attr.name !== '@model') {
        const eventType = attr.name.slice(1); // Remove @ prefix
        const handlerName = attr.value;
        
        htmlEl.removeAttribute(attr.name);
        
        htmlEl.addEventListener(eventType, (e) => {
          // Prevent default for certain events
          if (EVENTS_WITH_PREVENT_DEFAULT.includes(eventType)) {
            e.preventDefault();
          }
          
          // Call the handler method
          if (typeof context[handlerName] === 'function') {
            context[handlerName](e);
          }
        });
      }
    });
  });
}
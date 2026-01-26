export function handleBinding(element: HTMLElement, context: any): void {
  const elements = element.querySelectorAll('[\\@model]');
  elements.forEach((el): void => {
    const htmlEl = el as HTMLInputElement;
    const modelAttr = htmlEl.getAttribute('@model');
    if (modelAttr && modelAttr in context.data) {
      htmlEl.value = context.data[modelAttr]; // Initialize input value

      htmlEl.addEventListener('input', (event: Event) => {  
        const target = event.target as HTMLInputElement;
        context.data[modelAttr] = target.value;
        
        // Re-render to update all bound elements
        context.render();
      });
    }
  });
}
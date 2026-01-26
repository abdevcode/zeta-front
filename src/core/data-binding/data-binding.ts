import { Signal, isSignal } from '../signal/signal';

export function handleBinding(element: HTMLElement, context: any): void {
  const elements = element.querySelectorAll('[\\@model]');
  elements.forEach((el): void => {
    const htmlEl = el as HTMLInputElement;
    const modelAttr = htmlEl.getAttribute('@model');
    if (modelAttr && isSignal(context[modelAttr])) {
      const signal = context[modelAttr] as Signal<string>;
      
      // Initialize input value
      htmlEl.value = signal.get();

      // Update input when signal changes
      signal.subscribe(() => {
        if (document.activeElement !== htmlEl) {
          htmlEl.value = signal.get();
        }
      });

      // Update signal when input changes
      htmlEl.addEventListener('input', (event: Event) => {  
        const target = event.target as HTMLInputElement;
        signal.set(target.value);
      });
    }
  });
}
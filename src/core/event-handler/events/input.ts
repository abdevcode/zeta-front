export function handleInput(htmlEl: HTMLElement, context: any): void {
  const handler = htmlEl.getAttribute('@input');
  if (!handler) return;
  
  htmlEl.removeAttribute('@input');
  
  htmlEl.addEventListener('input', (e) => {
    if (typeof context[handler] === 'function') {
      context[handler](e);
    }
  });
}
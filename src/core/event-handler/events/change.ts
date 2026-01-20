export function handleChange(htmlEl: HTMLElement, context: any): void {
  const handler = htmlEl.getAttribute('@change');
  if (!handler) return;
  
  htmlEl.removeAttribute('@change');
  
  htmlEl.addEventListener('change', (e) => {
    if (typeof context[handler] === 'function') {
      context[handler](e);
    }
  });
}
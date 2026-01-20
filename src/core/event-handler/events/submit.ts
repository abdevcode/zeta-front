export function handleSubmit(htmlEl: HTMLElement, context: any): void {
  const handler = htmlEl.getAttribute('@submit');
  if (!handler) return;
  
  htmlEl.removeAttribute('@submit');
  
  htmlEl.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof context[handler] === 'function') {
      context[handler](e);
    }
  });
}
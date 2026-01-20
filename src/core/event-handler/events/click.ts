export function handleClick(htmlEl: HTMLElement, context: any): void {
  const handler = htmlEl.getAttribute('@click');
  if (!handler) return;
  
  htmlEl.removeAttribute('@click');
  
  htmlEl.addEventListener('click', (e) => {
    if (typeof context[handler] === 'function') {
      console.log('Click event triggered');
      context[handler](e);
    }
  });
}
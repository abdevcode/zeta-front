import { handleClick } from "./events/click";
import { handleInput } from "./events/input";
import { handleChange } from "./events/change";
import { handleSubmit } from "./events/submit";

export function handleEvent(element: HTMLElement, context: any): void {
  const elements = element.querySelectorAll('[\\@click], [\\@input], [\\@change], [\\@submit]');
  elements.forEach((el): void => {
    const htmlEl = el as HTMLElement;
    handleClick(htmlEl, context);
    handleInput(htmlEl, context);
    handleChange(htmlEl, context);
    handleSubmit(htmlEl, context);
  });
}
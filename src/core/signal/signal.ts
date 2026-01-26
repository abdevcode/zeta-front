type Subscriber = () => void;

export class Signal<T> {
  private value: T;
  private subscribers: Set<Subscriber> = new Set();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  get(): T {
    return this.value;
  }

  set(newValue: T): void {
    if (this.value !== newValue) {
      this.value = newValue;
      this.notify();
    }
  }

  update(updater: (current: T) => T): void {
    this.set(updater(this.value));
  }

  subscribe(subscriber: Subscriber): () => void {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }

  private notify(): void {
    this.subscribers.forEach(subscriber => subscriber());
  }
}

export function signal<T>(initialValue: T): Signal<T> {
  return new Signal(initialValue);
}

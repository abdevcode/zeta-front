type Subscriber = () => void;

// Global context for tracking the current effect
let currentEffect: Subscriber | null = null;

export class Signal<T> {
  private value: T;
  private subscribers: Set<Subscriber> = new Set();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  get(): T {
    // Auto-subscribe the current effect if one is running
    if (currentEffect) {
      this.subscribers.add(currentEffect);
    }
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

// Effect: runs the function and auto-tracks any signal.get() calls
export function effect(fn: Subscriber): () => void {
  const execute = () => {
    currentEffect = execute;
    try {
      fn();
    } finally {
      currentEffect = null;
    }
  };
  
  execute(); // Run immediately
  
  return () => {
    // Cleanup function (can be enhanced to unsubscribe from all signals)
  };
}

// Computed: creates a derived signal that auto-recomputes when dependencies change
export function computed<T>(fn: () => T): Signal<T> {
  const computedSignal = new Signal<T>(undefined as T);
  
  effect(() => {
    computedSignal.set(fn()); // Auto-tracks dependencies and updates
  });
  
  return computedSignal;
}

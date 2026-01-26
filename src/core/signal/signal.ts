type Subscriber = () => void;

// Global context for tracking the current effect
let currentEffect: Subscriber | null = null;

// Symbol to identify signals
const SIGNAL_SYMBOL = Symbol('Signal');

// Callable Signal type
export interface Signal<T> {
  (): T;
  (value: T): void;
  get(): T;
  set(value: T): void;
  update(updater: (current: T) => T): void;
  subscribe(subscriber: Subscriber): () => void;
  [SIGNAL_SYMBOL]: true;
}

class SignalImpl<T> {
  private value: T;
  private subscribers: Set<Subscriber> = new Set();
  [SIGNAL_SYMBOL] = true as const;

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

export function isSignal(value: any): value is Signal<any> {
  return typeof value === 'function' && SIGNAL_SYMBOL in value;
}

export function signal<T>(initialValue: T): Signal<T> {
  const sig = new SignalImpl(initialValue);
  
  // Create a callable function
  const callable = function(this: any, ...args: any[]) {
    return sig.get();
  };
  
  // Add signal methods and symbol to the function
  callable.get = sig.get.bind(sig);
  callable.set = sig.set.bind(sig);
  callable.update = sig.update.bind(sig);
  callable.subscribe = sig.subscribe.bind(sig);
  (callable as any)[SIGNAL_SYMBOL] = true;
  
  return callable as any;
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
  const computedSignal = signal<T>(undefined as T);
  
  effect(() => {
    (computedSignal as any).set(fn()); // Auto-tracks dependencies and updates
  });
  
  return computedSignal;
}

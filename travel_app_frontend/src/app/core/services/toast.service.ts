import { Injectable, signal } from '@angular/core';

/**
 * PUBLIC_INTERFACE
 * Toast model definition
 */
export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // in ms
}

/**
 * PUBLIC_INTERFACE
 * ToastService provides a global, non-blocking, accessible toast queue.
 * - Queues toasts with FIFO behavior
 * - Ensures a max number on screen (default 3)
 * - Auto-dismisses by duration
 * - Provides signals for components to render
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSig = signal<Toast[]>([]);
  private queue: Toast[] = [];

  /** PUBLIC_INTERFACE: Max concurrent toasts visible */
  maxVisible = 3;

  /** PUBLIC_INTERFACE: Default duration for toasts */
  defaultDuration = 4000;

  /** PUBLIC_INTERFACE: Readonly accessor for current toasts signal */
  toasts = () => this.toastsSig();

  // PUBLIC_INTERFACE
  show(message: string, type: ToastType = 'info', duration?: number): string {
    const toast: Toast = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type,
      message,
      duration: duration ?? this.defaultDuration,
    };

    // If there is room, display immediately; otherwise enqueue
    const current = this.toastsSig();
    if (current.length < this.maxVisible) {
      this.toastsSig.set([...current, toast]);
      this.scheduleDismiss(toast);
    } else {
      this.queue.push(toast);
    }
    return toast.id;
  }

  // PUBLIC_INTERFACE
  info(message: string, duration?: number): string {
    return this.show(message, 'info', duration);
  }

  // PUBLIC_INTERFACE
  success(message: string, duration?: number): string {
    return this.show(message, 'success', duration);
  }

  // PUBLIC_INTERFACE
  warning(message: string, duration?: number): string {
    return this.show(message, 'warning', duration);
  }

  // PUBLIC_INTERFACE
  error(message: string, duration?: number): string {
    return this.show(message, 'error', duration);
  }

  // PUBLIC_INTERFACE
  dismiss(id: string): void {
    const filtered = this.toastsSig().filter(t => t.id !== id);
    this.toastsSig.set(filtered);
    this.fillFromQueue();
  }

  private scheduleDismiss(toast: Toast): void {
    const duration = Math.max(1000, toast.duration ?? this.defaultDuration);
    // Respect reduced motion by lengthening but still auto-dismiss; browser media query will be respected in UI animations.
    const setT: any = (typeof globalThis !== 'undefined' && (globalThis as any).setTimeout) ? (globalThis as any).setTimeout : undefined;
    if (setT) {
      setT(() => this.dismiss(toast.id), duration);
    }
  }

  private fillFromQueue(): void {
    while (this.toastsSig().length < this.maxVisible && this.queue.length > 0) {
      const next = this.queue.shift()!;
      this.toastsSig.set([...this.toastsSig(), next]);
      this.scheduleDismiss(next);
    }
  }
}

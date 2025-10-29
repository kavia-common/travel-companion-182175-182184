import { CommonModule, NgFor } from '@angular/common';
import { Component, HostBinding, inject } from '@angular/core';
import { ToastService, Toast } from '../../core/services/toast.service';

/**
 * PUBLIC_INTERFACE
 * ToastContainerComponent renders queued toasts from ToastService.
 * Accessibility:
 * - Provides aria-live="polite" region for non-blocking announcements
 * - Each toast has role="status" and can be dismissed via a button
 * Animations kept subtle, respecting reduced motion preferences via CSS media query.
 */
@Component({
  selector: 'ui-toast-container',
  standalone: true,
  imports: [CommonModule, NgFor],
  template: `
    <div class="sr-live" aria-live="polite" aria-atomic="true"></div>

    <div class="toast-wrap" role="region" aria-label="Notifications">
      <div
        class="toast"
        *ngFor="let t of toasts()"
        [class.toast-info]="t.type === 'info'"
        [class.toast-success]="t.type === 'success'"
        [class.toast-warning]="t.type === 'warning'"
        [class.toast-error]="t.type === 'error'"
        role="status"
        tabindex="0"
      >
        <div class="dot" aria-hidden="true"></div>
        <div class="content">
          <span class="message">{{ t.message }}</span>
        </div>
        <button
          class="close"
          type="button"
          (click)="dismiss(t)"
          aria-label="Dismiss notification"
        >×</button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      position: fixed;
      z-index: 1000;
      inset: auto 0 0 auto;
      padding: 1rem;
      pointer-events: none; /* non-blocking */
    }
    .toast-wrap {
      display: grid;
      gap: .5rem;
      max-width: 420px;
      margin-left: auto;
      pointer-events: none; /* container non-interactive except inner */
    }
    .toast {
      pointer-events: auto; /* allow clicks inside */
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: start;
      gap: .5rem;
      background: var(--surface);
      color: var(--text);
      border: 1px solid var(--border);
      border-left-width: 4px;
      border-radius: var(--radius-lg);
      padding: .65rem .65rem .65rem .5rem;
      box-shadow: var(--elevation-2);
      animation: slide-in var(--transition-slow) ease;
    }
    .toast-info { border-left-color: var(--primary-500); }
    .toast-success { border-left-color: var(--success); }
    .toast-warning { border-left-color: var(--warning); }
    .toast-error { border-left-color: var(--error); }

    .dot {
      width: 10px;
      height: 10px;
      margin-top: .35rem;
      border-radius: 50%;
      background: var(--primary-500);
    }
    .toast-success .dot { background: var(--success); }
    .toast-warning .dot { background: var(--warning); }
    .toast-error .dot { background: var(--error); }

    .content {
      overflow: hidden;
    }
    .message {
      display: block;
      line-height: 1.3;
    }
    .close {
      border: none;
      background: transparent;
      color: var(--muted);
      font-size: 1.1rem;
      line-height: 1;
      padding: .25rem .35rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    .close:hover { background: var(--primary-50); color: var(--text); }
    .close:focus-visible { box-shadow: var(--focus-ring); outline: none; }

    .sr-live {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    @keyframes slide-in {
      from { transform: translateY(8px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      .toast { animation: none !important; }
    }
  `]
})
export class ToastContainerComponent {
  private toastService = inject(ToastService);

  // PUBLIC_INTERFACE
  toasts = () => this.toastService.toasts();

  // PUBLIC_INTERFACE
  dismiss(t: Toast): void {
    this.toastService.dismiss(t.id);
  }
}

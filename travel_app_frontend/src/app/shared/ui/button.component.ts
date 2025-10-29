import { Component, Input } from '@angular/core';

/**
 * PUBLIC_INTERFACE
 * ButtonComponent provides a themed button with variants.
 */
@Component({
  selector: 'ui-button',
  standalone: true,
  template: `
    <button
      class="btn"
      [class.btn-primary]="variant === 'primary'"
      [class.btn-secondary]="variant === 'secondary'"
      [class.btn-ghost]="variant === 'ghost'"
      [disabled]="disabled"
      type="button"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      font-weight: 600;
      border-radius: var(--radius-md);
      padding: .6rem 1rem;
      border: 1px solid var(--border);
      cursor: pointer;
      transition: background var(--transition-base) ease, color var(--transition-base) ease,
                  box-shadow var(--transition-base) ease, border-color var(--transition-base) ease, transform var(--transition-fast) ease;
      color: var(--text);
      background: var(--surface);
    }
    .btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: var(--elevation-1);
    }
    .btn:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: var(--elevation-0);
    }
    .btn:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .btn:disabled {
      opacity: .6;
      cursor: not-allowed;
    }
    .btn-primary {
      background: var(--primary);
      color: var(--text-inverse);
      border-color: var(--primary-700);
      box-shadow: var(--elevation-1);
    }
    .btn-primary:hover:not(:disabled) { background: var(--primary-700); }
    .btn-secondary {
      background: var(--secondary-100);
      color: var(--secondary-800);
      border-color: var(--secondary-300);
    }
    .btn-secondary:hover:not(:disabled) { background: var(--secondary-200); }
    .btn-ghost {
      background: transparent;
      color: var(--primary-700);
      border-color: transparent;
    }
    .btn-ghost:hover:not(:disabled) {
      background: var(--primary-50);
      border-color: var(--primary-100);
    }

    /* Reduced motion respect */
    @media (prefers-reduced-motion: reduce) {
      .btn, .btn:hover, .btn:active {
        transition: none !important;
        transform: none !important;
      }
    }
  `]
})
export class ButtonComponent {
  // PUBLIC_INTERFACE
  @Input() variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  // PUBLIC_INTERFACE
  @Input() disabled = false;
}

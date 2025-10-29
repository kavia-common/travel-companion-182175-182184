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
      gap: .5rem;
      font-weight: 600;
      border-radius: var(--radius-md);
      padding: .6rem 1rem;
      border: 1px solid transparent;
      cursor: pointer;
      transition: background 150ms ease, color 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
      color: var(--text);
      background: var(--surface);
      border-color: var(--border);
    }
    .btn:disabled {
      opacity: .6;
      cursor: not-allowed;
    }
    .btn-primary {
      background: var(--primary);
      color: white;
      box-shadow: var(--elevation-1);
      border-color: var(--primary-600);
    }
    .btn-primary:hover { background: var(--primary-600); }
    .btn-secondary {
      background: var(--secondary-100);
      color: var(--secondary-800);
      border-color: var(--secondary-300);
    }
    .btn-secondary:hover { background: var(--secondary-200); }
    .btn-ghost {
      background: transparent;
      color: var(--primary-700);
      border-color: transparent;
    }
    .btn-ghost:hover {
      background: var(--primary-50);
      border-color: var(--primary-100);
    }
  `]
})
export class ButtonComponent {
  // PUBLIC_INTERFACE
  @Input() variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  // PUBLIC_INTERFACE
  @Input() disabled = false;
}

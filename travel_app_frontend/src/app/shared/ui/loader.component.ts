import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * PUBLIC_INTERFACE
 * LoaderComponent shows a spinning indicator with optional label.
 */
@Component({
  selector: 'ui-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader" [style.--size.px]="size">
      <div class="spinner"></div>
      <span *ngIf="label" class="label">{{ label }}</span>
    </div>
  `,
  styles: [`
    .loader {
      display: inline-flex;
      align-items: center;
      gap: .5rem;
      color: var(--muted);
    }
    .spinner {
      width: var(--size, 20px);
      height: var(--size, 20px);
      border: 3px solid var(--primary-100);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    .label {
      font-size: .9rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoaderComponent {
  // PUBLIC_INTERFACE
  @Input() size = 20;
  // PUBLIC_INTERFACE
  @Input() label?: string;
}

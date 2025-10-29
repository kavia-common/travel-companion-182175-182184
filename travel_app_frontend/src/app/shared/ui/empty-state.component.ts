import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';

/**
 * PUBLIC_INTERFACE
 * EmptyStateComponent displays a friendly empty state with optional action.
 */
@Component({
  selector: 'ui-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="empty">
      <div class="icon">🌊</div>
      <h2>{{ title }}</h2>
      <p *ngIf="description">{{ description }}</p>
      <ui-button *ngIf="actionLabel" (click)="onActionClick()" [variant]="'primary'">{{ actionLabel }}</ui-button>
    </div>
  `,
  styles: [`
    .empty {
      text-align: center;
      background: linear-gradient(135deg, var(--primary-50), #ffffff);
      border: 1px dashed var(--border);
      color: var(--muted);
      padding: 2rem 1rem;
      border-radius: var(--radius-lg);
    }
    .icon {
      font-size: 2rem;
      margin-bottom: .5rem;
    }
    h2 {
      color: var(--text);
      margin-bottom: .25rem;
      font-size: 1.25rem;
    }
    p {
      margin-bottom: .75rem;
    }
  `]
})
export class EmptyStateComponent {
  // PUBLIC_INTERFACE
  @Input() title = 'Nothing here yet';
  // PUBLIC_INTERFACE
  @Input() description?: string;
  // PUBLIC_INTERFACE
  @Input() actionLabel?: string;

  // PUBLIC_INTERFACE
  onActionClick(): void {
    /** Placeholder click handler for action; intended to be bound by parent via (click) on ui-button if needed. */
  }
}

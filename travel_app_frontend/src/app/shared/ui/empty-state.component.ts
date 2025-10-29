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
    <div class="empty u-gradient-soft">
      <div class="icon" aria-hidden="true">🌊</div>
      <h2>{{ title }}</h2>
      <p *ngIf="description">{{ description }}</p>
      <ui-button *ngIf="actionLabel" (click)="onActionClick()" [variant]="'primary'">{{ actionLabel }}</ui-button>
    </div>
  `,
  styles: [`
    .empty {
      text-align: center;
      border: 1px dashed var(--border);
      color: var(--muted);
      padding: var(--space-6) var(--space-4);
      border-radius: var(--radius-lg);
    }
    .icon {
      font-size: 2rem;
      margin-bottom: var(--space-2);
    }
    h2 {
      color: var(--text);
      margin-bottom: var(--space-1);
      font-size: 1.25rem;
    }
    p {
      margin-bottom: var(--space-3);
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

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * PUBLIC_INTERFACE
 * CardComponent provides a panel with optional header and actions slots.
 */
@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card" [class.clickable]="clickable" tabindex="0">
      <header *ngIf="title" class="card-header">
        <h3>{{ title }}</h3>
        <div class="card-actions">
          <ng-content select="[card-actions]"></ng-content>
        </div>
      </header>
      <div class="card-content">
        <ng-content></ng-content>
      </div>
    </section>
  `,
  styles: [`
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--elevation-1);
      overflow: hidden;
      transition: transform var(--transition-base) ease, box-shadow var(--transition-base) ease, border-color var(--transition-base) ease;
    }
    .card:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .card.clickable:hover {
      transform: translateY(-2px);
      box-shadow: var(--elevation-2);
      border-color: var(--border-strong);
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: .9rem 1rem;
      border-bottom: 1px solid var(--border);
    }
    .card-header h3 {
      margin: 0;
      font-size: 1rem;
      color: var(--text);
    }
    .card-content {
      padding: 1rem;
      color: var(--text);
    }
    .card-actions {
      display: inline-flex;
      gap: var(--space-2);
    }

    @media (prefers-reduced-motion: reduce) {
      .card, .card.clickable:hover {
        transition: none !important;
        transform: none !important;
      }
    }
  `]
})
export class CardComponent {
  // PUBLIC_INTERFACE
  @Input() title?: string;
  // PUBLIC_INTERFACE
  @Input() clickable = false;
}

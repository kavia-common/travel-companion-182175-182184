import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader.component';
import { EmptyStateComponent } from './empty-state.component';

/**
 * PUBLIC_INTERFACE
 * StateWrapperComponent provides consistent loading, error, and empty states around page content.
 */
@Component({
  selector: 'ui-state-wrapper',
  standalone: true,
  imports: [CommonModule, LoaderComponent, EmptyStateComponent],
  template: `
    <ng-container *ngIf="!loading && !error && !empty">
      <ng-content></ng-content>
    </ng-container>

    <div *ngIf="loading" class="center">
      <ui-loader [label]="loadingLabel"></ui-loader>
    </div>

    <div *ngIf="error" class="center">
      <div class="error" role="alert" aria-live="assertive">
        <strong>Something went wrong</strong>
        <p *ngIf="errorMessage">{{ errorMessage }}</p>
      </div>
    </div>

    <div *ngIf="!loading && !error && empty" class="center">
      <ui-empty-state [title]="emptyTitle" [description]="emptyDescription"></ui-empty-state>
    </div>
  `,
  styles: [`
    .center {
      display: grid;
      place-items: center;
      padding: var(--space-5);
    }
    .error {
      color: var(--error);
      background: var(--error-100);
      border: 1px solid #fecdd3;
      border-radius: var(--radius-md);
      padding: var(--space-4);
      text-align: center;
      max-width: 720px;
      width: 100%;
    }
  `]
})
export class StateWrapperComponent {
  // PUBLIC_INTERFACE
  @Input() loading = false;
  // PUBLIC_INTERFACE
  @Input() loadingLabel = 'Loading...';
  // PUBLIC_INTERFACE
  @Input() error = false;
  // PUBLIC_INTERFACE
  @Input() errorMessage?: string;
  // PUBLIC_INTERFACE
  @Input() empty = false;
  // PUBLIC_INTERFACE
  @Input() emptyTitle = 'Nothing here yet';
  // PUBLIC_INTERFACE
  @Input() emptyDescription = 'Try adjusting your filters or come back later.';
}

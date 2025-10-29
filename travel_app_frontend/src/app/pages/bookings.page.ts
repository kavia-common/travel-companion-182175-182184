import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { StateWrapperComponent } from '../shared/ui/state-wrapper.component';
import { CardComponent } from '../shared/ui/card.component';
import { ButtonComponent } from '../shared/ui/button.component';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BookingsStore, AuthStore } from '../core/store';

/**
 * PUBLIC_INTERFACE
 * BookingsPageComponent binds to BookingsStore with a minimal create/cancel flow.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateWrapperComponent,
    CardComponent,
    ButtonComponent,
    NgIf,
    NgFor
  ],
  template: `
    <section class="stack">
      <form [formGroup]="form" class="card-form" (ngSubmit)="createBooking()">
        <div class="row">
          <div>
            <label for="provider">Provider</label>
            <input id="provider" formControlName="provider" placeholder="e.g., Airline or Hotel name" />
            <small class="error" *ngIf="providerInvalid()">Provider is required.</small>
          </div>
          <div>
            <label for="reference">Reference</label>
            <input id="reference" formControlName="reference" placeholder="e.g., ABC123" />
          </div>
        </div>
        <div class="actions">
          <ui-button variant="primary" [disabled]="form.invalid || loading()">Create</ui-button>
        </div>
      </form>

      <ui-state-wrapper
        [loading]="loading()"
        [error]="!!error()"
        [errorMessage]="error()?.message"
        [empty]="!loading() && !error() && bookings().length === 0"
        [emptyTitle]="'Bookings'"
        [emptyDescription]="'You don\\'t have any bookings yet.'"
      >
        <div class="list" *ngIf="bookings().length">
          <ui-card *ngFor="let b of bookings()" [title]="(b.provider || 'Booking') + ' – ' + (b.reference || b.id)">
            <p>Status: <strong>{{ b.status }}</strong></p>
            <div card-actions>
              <ui-button variant="ghost" (click)="cancel(b.id)" [disabled]="b.status === 'canceled'">Cancel</ui-button>
            </div>
          </ui-card>
        </div>
      </ui-state-wrapper>
    </section>
  `,
  styles: [`
    .stack{display:grid;gap:1rem;}
    .card-form{
      display:grid;gap:.75rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 1rem;
      box-shadow: var(--elevation-1);
    }
    .row{display:grid;gap:.75rem;grid-template-columns: 1fr 1fr;}
    @media (max-width: 680px){ .row{grid-template-columns:1fr;} }
    label{display:block;margin-bottom:.25rem;color:var(--muted);}
    input{
      width:100%;
      padding:.6rem .75rem;
      border-radius: var(--radius-md);
      border:1px solid var(--border);
      background: var(--surface);
      outline:none;
    }
    input:focus{
      border-color: var(--primary-300);
      box-shadow: 0 0 0 3px var(--primary-100);
    }
    .actions{display:flex;gap:.5rem;justify-content:flex-end;}
    .error{color: var(--error);}
    .list{display:grid;gap:.75rem;}
  `]
})
export class BookingsPageComponent {
  private store = inject(BookingsStore);
  private auth = inject(AuthStore);
  private fb = inject(FormBuilder);

  loading = signal(false);
  error = signal<{ message: string } | null>(null);
  bookings = signal<any[]>([]);

  form = this.fb.nonNullable.group({
    provider: this.fb.nonNullable.control('', { validators: [Validators.required] }),
    reference: this.fb.nonNullable.control('')
  });

  constructor() {
    this.store.loading$.subscribe(l => this.loading.set(l));
    this.store.error$.subscribe(e => this.error.set(e));
    this.store.bookings$.subscribe(list => this.bookings.set(list));

    const user = this.auth.user;
    if (user?.id) {
      this.store.load(user.id);
    }
  }

  // PUBLIC_INTERFACE
  providerInvalid(): boolean {
    const c = this.form.controls.provider;
    return c.invalid && (c.dirty || c.touched);
  }

  // PUBLIC_INTERFACE
  async createBooking(): Promise<void> {
    if (this.form.invalid) return;
    const user = this.auth.user;
    if (!user) return;
    await this.store.create({
      user_id: user.id,
      provider: this.form.value.provider!,
      reference: this.form.value.reference || undefined
    });
    this.form.reset({ provider: '', reference: '' });
  }

  // PUBLIC_INTERFACE
  async cancel(id: string): Promise<void> {
    await this.store.cancel(id);
  }
}

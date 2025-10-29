import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { StateWrapperComponent } from '../shared/ui/state-wrapper.component';
import { CardComponent } from '../shared/ui/card.component';
import { ButtonComponent } from '../shared/ui/button.component';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ItineraryStore, AuthStore } from '../core/store';

/**
 * PUBLIC_INTERFACE
 * ItinerariesPageComponent binds to ItineraryStore.
 * - On init loads user's itineraries
 * - Provides a minimal Create form with validation
 * - Lists itineraries; includes simple edit (title) stub inline
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
      <form [formGroup]="form" class="card-form" (ngSubmit)="createItinerary()">
        <div>
          <label for="title">Title</label>
          <input id="title" formControlName="title" placeholder="e.g., Summer in Italy" />
          <small class="error" *ngIf="titleInvalid()">Title is required (min 3 characters).</small>
        </div>
        <div>
          <label for="description">Description</label>
          <input id="description" formControlName="description" placeholder="Optional description" />
        </div>
        <div class="actions">
          <ui-button variant="primary" [disabled]="form.invalid || loading()">Create</ui-button>
        </div>
      </form>

      <ui-state-wrapper
        [loading]="loading()"
        [error]="!!error()"
        [errorMessage]="error()?.message"
        [empty]="!loading() && !error() && itineraries().length === 0"
        [emptyTitle]="'Your Itineraries'"
        [emptyDescription]="'No itineraries yet.'"
      >
        <div class="list" *ngIf="itineraries().length">
          <ui-card *ngFor="let it of itineraries()" [title]="it.title">
            <p style="color: var(--muted); margin-bottom:.4rem;">{{ it.description || 'No description' }}</p>
            <p *ngIf="it.items?.length">Items: {{ it.items?.length }}</p>
            <div card-actions>
              <ui-button variant="ghost" (click)="beginEdit(it.id)">Edit</ui-button>
              <ui-button variant="ghost" (click)="deleteItinerary(it.id)">Delete</ui-button>
            </div>

            <div class="edit" *ngIf="editingId() === it.id">
              <input #t [value]="it.title" (input)="onPendingTitleChange(t.value)" />
              <ui-button variant="primary" (click)="saveTitle(it.id)">Save</ui-button>
              <ui-button variant="ghost" (click)="cancelEdit()">Cancel</ui-button>
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
    .edit{display:flex;gap:.5rem;align-items:center;margin-top:.5rem;}
    .edit input{flex:1;}
  `]
})
export class ItinerariesPageComponent {
  private store = inject(ItineraryStore);
  private auth = inject(AuthStore);
  private fb = inject(FormBuilder);

  loading = signal(false);
  error = signal<{ message: string } | null>(null);
  itineraries = signal<any[]>([]);
  editingId = signal<string | null>(null);
  pendingTitle = '';

  form = this.fb.nonNullable.group({
    title: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.minLength(3)] }),
    description: this.fb.nonNullable.control('')
  });

  constructor() {
    this.store.loading$.subscribe(l => this.loading.set(l));
    this.store.error$.subscribe(e => this.error.set(e));
    this.store.itineraries$.subscribe(list => this.itineraries.set(list));

    // Load on init when user is available; if session unknown, it will be populated by guard before entering this route
    const user = this.auth.user;
    if (user?.id) {
      this.store.load(user.id);
    }
  }

  // PUBLIC_INTERFACE
  titleInvalid(): boolean {
    const c = this.form.controls.title;
    return c.invalid && (c.dirty || c.touched);
  }

  // PUBLIC_INTERFACE
  async createItinerary(): Promise<void> {
    if (this.form.invalid) return;
    const user = this.auth.user;
    if (!user) return;
    await this.store.create({
      user_id: user.id,
      title: this.form.value.title!,
      description: this.form.value.description || undefined,
      start_date: undefined,
      end_date: undefined
    });
    this.form.reset({ title: '', description: '' });
  }

  // PUBLIC_INTERFACE
  beginEdit(id: string): void {
    this.editingId.set(id);
    this.pendingTitle = this.itineraries().find(i => i.id === id)?.title ?? '';
  }

  // PUBLIC_INTERFACE
  cancelEdit(): void {
    this.editingId.set(null);
    this.pendingTitle = '';
  }

  // PUBLIC_INTERFACE
  async saveTitle(id: string): Promise<void> {
    if (!this.pendingTitle || this.pendingTitle.trim().length < 3) return;
    await this.store.update(id, { title: this.pendingTitle.trim() });
    this.cancelEdit();
  }

  // PUBLIC_INTERFACE
  onPendingTitleChange(value: string): void {
    this.pendingTitle = value ?? '';
  }

  // PUBLIC_INTERFACE
  async deleteItinerary(id: string): Promise<void> {
    await this.store.delete(id);
  }
}

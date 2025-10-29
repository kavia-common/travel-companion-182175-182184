import { TestBed } from '@angular/core/testing';
import { NotFoundPageComponent } from './not-found.page';

describe('NotFoundPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundPageComponent],
    }).compileComponents();
  });

  it('should render 404 text', () => {
    const fixture = TestBed.createComponent(NotFoundPageComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent || '').toContain('404');
  });
});

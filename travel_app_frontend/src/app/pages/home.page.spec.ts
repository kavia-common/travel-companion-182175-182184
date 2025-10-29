import { TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home.page';

describe('HomePageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
    }).compileComponents();
  });

  it('should create and render', () => {
    const fixture = TestBed.createComponent(HomePageComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent || '').toContain('Welcome to Travel Companion');
  });
});

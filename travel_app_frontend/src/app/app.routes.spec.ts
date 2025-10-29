import { routes } from './app.routes';
import { AuthGuard } from './core/guards/auth.guard';
import { DestinationResolver } from './core/resolvers/destination.resolver';

describe('App Routes', () => {
  it('should include core paths', () => {
    const paths = routes.map(r => r.path);
    expect(paths).toContain('');
    expect(paths).toContain('search');
    expect(paths).toContain('itineraries');
    expect(paths).toContain('bookings');
    expect(paths).toContain('not-found');
  });

  it('itineraries and bookings should be protected by AuthGuard', () => {
    const itRoute = routes.find(r => r.path === 'itineraries');
    const bkRoute = routes.find(r => r.path === 'bookings');
    expect(itRoute?.canActivate?.[0]).toBe(AuthGuard);
    expect(bkRoute?.canActivate?.[0]).toBe(AuthGuard);
  });

  it('destination route should use DestinationResolver', () => {
    const destRoute = routes.find(r => r.path === 'destinations/:id');
    expect(destRoute?.resolve?.['destination']).toBe(DestinationResolver);
  });
});

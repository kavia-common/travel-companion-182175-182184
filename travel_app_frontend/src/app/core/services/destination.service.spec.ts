import { TestBed } from '@angular/core/testing';
import { DestinationService } from './destination.service';
import { provideMockSupabase } from '../../../test-helpers/supabase-mock';

function supabaseMockWithDestinations(list: any[]) {
  // Simple chainable mock for from('destinations')
  const table = {
    select: () => ({
      limit: (_n: number) => ({ data: list, error: null }),
      single: async () => ({ data: list[0] ?? null, error: null })
    }),
    eq: (_field: string, _val: any) => ({
      select: (_: string = '*') => ({
        single: async () => ({ data: list[0] ?? null, error: null })
      }),
      limit: (_n: number) => ({ data: list, error: null })
    }),
    or: (_expr: string) => ({ data: list, error: null }),
    limit: (_n: number) => ({ data: list, error: null }),
    order: () => ({ data: list, error: null })
  };
  const mock = {
    from: (name: string) => {
      if (name !== 'destinations') {
        return table;
      }
      return table;
    }
  };
  return mock;
}

describe('DestinationService', () => {
  it('searchDestinations returns list when query is empty', async () => {
    const list = [{ id: 'd1', name: 'Paris' }];
    TestBed.configureTestingModule({
      providers: [
        DestinationService,
        ...provideMockSupabase(supabaseMockWithDestinations(list))
      ],
    });

    const svc = TestBed.inject(DestinationService);
    const res = await svc.searchDestinations('');
    expect(res.error).toBeNull();
    expect(res.data?.length).toBe(1);
    expect(res.data?.[0].name).toBe('Paris');
  });

  it('getDestinationById returns single item', async () => {
    const list = [{ id: 'd1', name: 'Paris' }];
    TestBed.configureTestingModule({
      providers: [
        DestinationService,
        ...provideMockSupabase(supabaseMockWithDestinations(list))
      ],
    });

    const svc = TestBed.inject(DestinationService);
    const res = await svc.getDestinationById('d1');
    expect(res.error).toBeNull();
    expect(res.data?.id).toBe('d1');
  });

  it('getFeatured returns a list', async () => {
    const list = [{ id: 'd2', name: 'Tokyo', featured: true }];
    const mock = {
      from: (_: string) => ({
        select: () => ({
          eq: (_f: string, _v: any) => ({
            limit: (_n: number) => ({ data: list, error: null })
          })
        })
      })
    };

    TestBed.configureTestingModule({
      providers: [
        DestinationService,
        ...provideMockSupabase(mock)
      ],
    });

    const svc = TestBed.inject(DestinationService);
    const res = await svc.getFeatured();
    expect(res.error).toBeNull();
    expect(res.data?.[0].id).toBe('d2');
  });
});

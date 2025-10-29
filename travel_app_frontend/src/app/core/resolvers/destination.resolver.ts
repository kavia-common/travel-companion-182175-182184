import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { Destination } from '../models/destination.model';
import { DestinationService } from '../services/destination.service';

/**
  * PUBLIC_INTERFACE
  * DestinationResolver resolves a destination record by :id route param.
  * On failure, it navigates to not-found page.
  */
export const DestinationResolver: ResolveFn<Destination | null> = async (route) => {
  const destinationService = inject(DestinationService);
  const router = inject(Router);

  const id = route.paramMap.get('id') || '';
  if (!id) {
    await router.navigateByUrl('/not-found');
    return null;
  }

  const res = await destinationService.getDestinationById(id);
  if (res.error || !res.data) {
    await router.navigateByUrl('/not-found');
    return null;
  }
  return res.data;
};

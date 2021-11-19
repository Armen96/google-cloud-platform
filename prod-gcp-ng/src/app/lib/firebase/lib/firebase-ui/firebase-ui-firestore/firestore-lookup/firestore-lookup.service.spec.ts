import { TestBed } from '@angular/core/testing';

import { FirestoreLookupService } from './firestore-lookup.service';

describe('FirestoreLookupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirestoreLookupService = TestBed.inject(FirestoreLookupService);
    expect(service).toBeTruthy();
  });
});

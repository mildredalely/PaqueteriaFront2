import { TestBed } from '@angular/core/testing';

import { Conction } from './conction';

describe('Conction', () => {
  let service: Conction;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Conction);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

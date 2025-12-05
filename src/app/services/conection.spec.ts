import { TestBed } from '@angular/core/testing';

import { Conection } from './conection';

describe('Conection', () => {
  let service: Conection;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Conection);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ExplorerService } from './explorer.service';

describe('ExplorerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExplorerService = TestBed.get(ExplorerService);
    expect(service).toBeTruthy();
  });
});

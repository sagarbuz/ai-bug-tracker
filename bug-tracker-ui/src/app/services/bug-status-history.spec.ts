import { TestBed } from '@angular/core/testing';

import { BugStatusHistory } from './bug-status-history';

describe('BugStatusHistory', () => {
  let service: BugStatusHistory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BugStatusHistory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

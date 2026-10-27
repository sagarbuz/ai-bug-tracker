import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugStatusHistory } from './bug-status-history';

describe('BugStatusHistory', () => {
  let component: BugStatusHistory;
  let fixture: ComponentFixture<BugStatusHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugStatusHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugStatusHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

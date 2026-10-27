import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugComments } from './bug-comments';

describe('BugComments', () => {
  let component: BugComments;
  let fixture: ComponentFixture<BugComments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BugComments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugComments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

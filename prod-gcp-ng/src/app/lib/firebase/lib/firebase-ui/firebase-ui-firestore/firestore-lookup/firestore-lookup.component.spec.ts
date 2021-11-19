import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirestoreLookupComponent } from './firestore-lookup.component';

describe('FirestoreLookupComponent', () => {
  let component: FirestoreLookupComponent;
  let fixture: ComponentFixture<FirestoreLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirestoreLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirestoreLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

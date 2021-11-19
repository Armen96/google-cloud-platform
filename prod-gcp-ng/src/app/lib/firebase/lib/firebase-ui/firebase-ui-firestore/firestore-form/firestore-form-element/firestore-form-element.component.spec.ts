import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirestoreFormElementComponent } from './firestore-form-element.component';

describe('FirestoreFormElementComponent', () => {
  let component: FirestoreFormElementComponent;
  let fixture: ComponentFixture<FirestoreFormElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirestoreFormElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirestoreFormElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

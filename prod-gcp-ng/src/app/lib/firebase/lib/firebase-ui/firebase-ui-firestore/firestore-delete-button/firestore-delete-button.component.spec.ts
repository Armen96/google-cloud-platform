import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirestoreDeleteButtonComponent } from './firestore-delete-button.component';

describe('FirestoreDeleteButtonComponent', () => {
  let component: FirestoreDeleteButtonComponent;
  let fixture: ComponentFixture<FirestoreDeleteButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirestoreDeleteButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirestoreDeleteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

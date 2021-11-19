import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirestoreCollectionComponent } from './firestore-collection.component';

describe('FirestoreCollectionComponent', () => {
  let component: FirestoreCollectionComponent;
  let fixture: ComponentFixture<FirestoreCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirestoreCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirestoreCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

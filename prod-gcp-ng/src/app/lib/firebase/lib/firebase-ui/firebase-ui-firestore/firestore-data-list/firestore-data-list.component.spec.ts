import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirestoreDataListComponent } from './firestore-data-list.component';

describe('FirestoreDataListComponent', () => {
  let component: FirestoreDataListComponent;
  let fixture: ComponentFixture<FirestoreDataListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirestoreDataListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirestoreDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

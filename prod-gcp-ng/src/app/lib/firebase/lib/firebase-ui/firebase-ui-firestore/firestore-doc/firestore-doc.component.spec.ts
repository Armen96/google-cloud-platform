import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirestoreDocComponent } from './firestore-doc.component';

describe('FirestoreDocComponent', () => {
  let component: FirestoreDocComponent;
  let fixture: ComponentFixture<FirestoreDocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirestoreDocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirestoreDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirestoreImportComponent } from './firestore-import.component';

describe('FirestoreImportComponent', () => {
  let component: FirestoreImportComponent;
  let fixture: ComponentFixture<FirestoreImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirestoreImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirestoreImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirestoreExportComponent } from './firestore-export.component';

describe('FirestoreExportComponent', () => {
  let component: FirestoreExportComponent;
  let fixture: ComponentFixture<FirestoreExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirestoreExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirestoreExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

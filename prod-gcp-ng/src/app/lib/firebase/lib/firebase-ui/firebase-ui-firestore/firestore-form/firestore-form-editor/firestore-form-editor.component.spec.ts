import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirestoreFormEditorComponent } from './firestore-form-editor.component';

describe('FirestoreFormEditorComponent', () => {
  let component: FirestoreFormEditorComponent;
  let fixture: ComponentFixture<FirestoreFormEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirestoreFormEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirestoreFormEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

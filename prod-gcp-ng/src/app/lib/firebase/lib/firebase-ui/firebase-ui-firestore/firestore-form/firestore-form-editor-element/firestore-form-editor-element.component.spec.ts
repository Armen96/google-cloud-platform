import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirestoreFormEditorElementComponent } from './firestore-form-editor-element.component';

describe('FirestoreFormEditorElementComponent', () => {
  let component: FirestoreFormEditorElementComponent;
  let fixture: ComponentFixture<FirestoreFormEditorElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirestoreFormEditorElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirestoreFormEditorElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

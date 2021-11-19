import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageFileUploaderComponent } from './storage-file-uploader.component';

describe('StorageFileUploaderComponent', () => {
  let component: StorageFileUploaderComponent;
  let fixture: ComponentFixture<StorageFileUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageFileUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

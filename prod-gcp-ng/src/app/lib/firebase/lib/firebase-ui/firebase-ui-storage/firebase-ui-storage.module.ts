import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageFileUploaderComponent } from './storage-file-uploader/storage-file-uploader.component';
import {FormsModule} from '@angular/forms';
import {MaterialUiModule} from '../../../../material-ui/material-ui.module';

@NgModule({
  declarations: [StorageFileUploaderComponent],
  exports: [StorageFileUploaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialUiModule
  ]
})
export class FirebaseUiStorageModule { }

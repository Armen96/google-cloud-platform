import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FirebaseUiAuthModule} from './firebase-ui-auth/firebase-ui-auth.module';
import {FirebaseUiFirestoreModule} from './firebase-ui-firestore/firebase-ui-firestore.module';
import {FirebaseUiStorageModule} from './firebase-ui-storage/firebase-ui-storage.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FirebaseUiAuthModule,
    FirebaseUiFirestoreModule,
    FirebaseUiStorageModule
  ]
})
export class FirebaseUiModule { }

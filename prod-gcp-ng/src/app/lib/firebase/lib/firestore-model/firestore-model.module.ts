import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FirestoreModelService} from './firestore-model.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    FirestoreModelService
  ]
})
export class FirestoreModelModule { }

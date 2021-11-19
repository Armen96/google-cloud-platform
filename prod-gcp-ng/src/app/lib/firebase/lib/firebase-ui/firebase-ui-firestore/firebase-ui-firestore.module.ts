import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreDocComponent } from './firestore-doc/firestore-doc.component';
import {MaterialUiModule} from '../../../../material-ui/material-ui.module';
import {FirestoreFormComponent} from './firestore-form/firestore-form.component';
import {FormsModule} from '@angular/forms';
import { FirestoreCollectionComponent } from './firestore-collection/firestore-collection.component';
import { FirestoreFormElementComponent } from './firestore-form/firestore-form-element/firestore-form-element.component';
import { FirestoreFormEditorComponent } from './firestore-form/firestore-form-editor/firestore-form-editor.component';
// tslint:disable-next-line:max-line-length
import { FirestoreFormEditorElementComponent } from './firestore-form/firestore-form-editor-element/firestore-form-editor-element.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FirestoreDeleteButtonComponent } from './firestore-delete-button/firestore-delete-button.component';
import { FirestoreLookupComponent } from './firestore-lookup/firestore-lookup.component';
import { FirestoreExportComponent } from './firestore-export/firestore-export.component';
import { FirestoreImportComponent } from './firestore-import/firestore-import.component';
import { FirestoreDataListComponent } from './firestore-data-list/firestore-data-list.component';
import {GooglePlaceModule} from 'ngx-google-places-autocomplete';
import {MentionModule} from 'angular-mentions';

@NgModule({
  declarations: [
    FirestoreDocComponent,
    FirestoreFormComponent,
    FirestoreCollectionComponent,
    FirestoreFormElementComponent,
    FirestoreFormEditorComponent,
    FirestoreFormEditorElementComponent,
    FirestoreDeleteButtonComponent,
    FirestoreLookupComponent,
    FirestoreExportComponent,
    FirestoreImportComponent,
    FirestoreDataListComponent
  ],
  exports: [
    FirestoreDocComponent,
    FirestoreFormComponent,
    FirestoreFormElementComponent,
    FirestoreCollectionComponent,
    FirestoreDeleteButtonComponent,
    FirestoreLookupComponent,
    FirestoreExportComponent,
    FirestoreImportComponent,
    FirestoreDataListComponent
  ],
  imports: [
    CommonModule,
    DragDropModule,
    MaterialUiModule,
    FormsModule,
    GooglePlaceModule,
    MentionModule
  ]
})
export class FirebaseUiFirestoreModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleSigninButtonComponent } from './google-signin-button/google-signin-button.component';
import { EmailSigninFormComponent } from './email-signin-form/email-signin-form.component';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from "../../../../material/material.module";


@NgModule({
  declarations: [
    GoogleSigninButtonComponent,
    EmailSigninFormComponent,
  ],
  exports: [
    GoogleSigninButtonComponent,
    EmailSigninFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
  ]
})
export class FirebaseUiAuthModule { }

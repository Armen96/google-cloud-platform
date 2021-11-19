import {Component, EventEmitter, Input, OnInit, Output, NgZone} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-email-signin-form',
  templateUrl: './email-signin-form.component.html',
  styleUrls: ['./email-signin-form.component.scss']
})
export class EmailSigninFormComponent implements OnInit {
  @Input() enablePassword = false;
  @Output() connected    = new EventEmitter<any>();

  public view = 'login';
  public email: string = '';
  public authenticating = false;
  public sent = false;
  public error: boolean = false;

  get url() {
    const {hostname, protocol, port} = window.location;
    let url = protocol + '//' + hostname;
    if (port) {
      url += ':' + port;
    }
    return url;
  }


  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) { }

  ngOnInit() {
    const email = window.localStorage.getItem('emailForSignIn');
    if (email) {
      this.email = email;
      window.localStorage.removeItem('emailForSignIn');
    }
  }

  signIn() {
    try {
      this.authenticating = true;
      // @ts-ignore
      this.afAuth.auth.signInWithEmailLink(this.email, window.location.href).then((result: any) => {
          const data = result.user;
          const ref = this.afs.doc('users/' + data.email);
          ref.update({last_login: Date.now()}).then((snap: any) => {
            this.notify();
          }).catch(() => this.error = true);
        }).catch(() => this.error = true);
    } catch (e) {
      this.error = true;
    }
  }

  notify() {
    this.connected.emit(true);
  }
}

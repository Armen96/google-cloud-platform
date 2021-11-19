import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
// import { auth } from 'firebase/app';
// import {AngularFireAuth} from '@angular/fire/auth';
// import {AngularFirestore} from '@angular/fire/firestore';
import {Subscription} from 'rxjs';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from "firebase/compat";
import auth = firebase.auth;

@Component({
  selector: 'app-google-signin-button',
  templateUrl: './google-signin-button.component.html',
  styleUrls: ['./google-signin-button.component.scss']
})
export class GoogleSigninButtonComponent implements OnInit, OnDestroy {
  @Output() connected: EventEmitter<any> = new EventEmitter();

  private subs: Subscription[] = [];

  constructor(protected afs: AngularFirestore, private afAuth: AngularFireAuth) { }

  ngOnInit() { }

  connect() {
    const provider = new auth.GoogleAuthProvider();
    // @ts-ignore
    this.afAuth.auth.signInWithPopup(provider).then((response: any) => {
      const token = response.credential['accessToken'];
      const data = response.user;
      const userRef = this.afs.doc('users/' + data.email);
      userRef.update({last_login: Date.now(), google_token: token});
      this.subs.push( userRef.valueChanges().subscribe((user: any) => {
        if (user) {
          user['id'] = data.email;
          this.connected.emit(user);
        }
      }));
    });
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }

}

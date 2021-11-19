import { Injectable } from '@angular/core';
import {NgxFirebaseClientService} from '@ngx-firebase/client';
import {from, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreModelService {

  constructor(private firebase: NgxFirebaseClientService) { }

  factory(collection: string) {
    return new FirestoreModel(collection, this.firebase);
  }
}

export class FirestoreModel {

  constructor(private firestoreCollection: string, private firebase: NgxFirebaseClientService) {}

  collection() {
    return this.firebase.firestore().collection(this.firestoreCollection);
  }

  query() {
    return this.collection();
  }

  find(id: string, observable = false): Observable<any> {
    if (observable) {
      const subject$ = new Subject();
      this.collection().doc(id).onSnapshot((doc: any) => {
        subject$.next(this.docFromRef(doc));
      });
      return subject$;
    } else {
      return from(this.collection().doc(id).get().then((doc: any) => this.docFromRef(doc)));
    }
  }

  fetchOne(query: any, observable = false) {
    if (observable) {
      const subject$ = new Subject();
      query.onSnapshot((snap: any) => {
        if (snap.docs.length > 0) {
          subject$.next(this.docFromRef(snap.docs[0]));
        } else {
          subject$.next(null);
        }
      });
      return subject$;
    } else {
      return query.get().then((snap: any) => {
        if (snap.docs.length === 0) {
          return null;
        }
        return this.docFromRef(snap.docs[0]);
      });
    }
  }

  fetchAll(query: any, observable = false) {
    if (observable) {
      const subject$ = new Subject();
      query.onSnapshot((snap: any) => {
        if (snap.docs.length > 0) {
          subject$.next(snap.docs.map((docSnap: any) => this.docFromRef(docSnap)));
        } else {
          subject$.next(null);
        }
      });
      return subject$;
    } else {
      return query.get().then((snap: any) => {
        if (snap.docs.length === 0) {
          return null;
        }
        return snap.docs.map((docSnap: any) => this.docFromRef(docSnap));
      });
    }
  }

  create(data: any) {
    if (data.id) {
      const id = data.id;
      const doc = {...data};
      delete doc.id;
      return this.collection().doc(id).set(doc).then((r: any) => data);
    }
    return this.collection().add(data).then((snap: any) => Object.assign(data, {id: snap.id}));
  }

  update(id: string, data: any) {
    return this.collection().doc(id).update(data).then(() => this.find(id));
  }

  set(id: string, data: any) {
    return this.collection().doc(id).set(data).then(() => this.find(id));
  }

  delete(ref: any): any {
    if (Array.isArray(ref)) {
      return Promise.all(ref.map(doc => this.delete(doc)));
    }

    const id = typeof ref === 'object' ? ref.id : ref;
    return this.collection().doc(id).delete();
  }

  docFromRef(docRef: any) {
    if (! docRef || ! docRef.exists) {
      return null;
    }
    const data = docRef.data();
    data.id = docRef.id;
    return data;
  }
}

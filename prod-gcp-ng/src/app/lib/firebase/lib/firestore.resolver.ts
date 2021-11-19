import { Injectable } from '@angular/core';

import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

import { Observable } from 'rxjs';
import {first, map} from 'rxjs/operators';
import {AngularFirestore} from "@angular/fire/compat/firestore";



@Injectable()
export class FirestoreResolver implements Resolve<Observable<any>> {
  protected collection: string = '';
  protected param: string = '';

  constructor(private afs: AngularFirestore) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = route.params[this.param];
    return this.afs.collection(this.collection).doc(id).valueChanges().pipe(map((doc: any) => {
      if (doc) {
        doc['id'] = id;
      }
      return doc;
    })).pipe(first());
  }
}

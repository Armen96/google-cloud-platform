import {Injectable} from '@angular/core';
import {BehaviorSubject, of} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAnalytics} from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root'
})
export class FirestoreLookupService {
  private _requests = {};
  constructor(private afs: AngularFirestore, private analytics: AngularFireAnalytics) { }

  lookup(collection, doc) {
    if (!doc) { return of(null); }

    const path = collection + '/' + doc;
    if (!this._requests[path]) {
      this.analytics.logEvent('FIRESTORE_LOOKUP_SERVICE', {collection, doc});
      this._requests[path] = new BehaviorSubject(null);
      this.afs.collection(collection).doc(doc).valueChanges().subscribe((data: any) => {
        if (data) { data.id = doc; }

        this._requests[path].next(data);
      });
    }
    return this._requests[path];
  }
}

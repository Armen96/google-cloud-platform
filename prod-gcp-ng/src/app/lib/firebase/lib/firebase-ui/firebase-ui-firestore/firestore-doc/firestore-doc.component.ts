import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-firestore-doc',
  templateUrl: './firestore-doc.component.html',
  styleUrls: ['./firestore-doc.component.scss']
})
export class FirestoreDocComponent implements OnInit, OnDestroy {
  @Input() collection: string;
  @Input() doc: string;
  // @Input() template: string;
  @Output() data: EventEmitter<any> = new EventEmitter();

  public loaded = false;

  private subs: Subscription[] = [];

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.subs.push(this.afs.collection(this.collection).doc(this.doc).valueChanges().subscribe(doc => {
      doc['id'] = this.doc;
      this.data.emit(doc);
      this.loaded = true;
    }, e => console.error(e)));
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }

}

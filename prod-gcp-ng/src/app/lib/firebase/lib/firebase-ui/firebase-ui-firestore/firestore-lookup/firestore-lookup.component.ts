import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FirestoreLookupService} from './firestore-lookup.service';
import {Subscription} from 'rxjs';
import {PhoneFormatPipe} from '../../../../../pipes/phone-format.pipe';

@Component({
  selector: 'app-firestore-lookup',
  templateUrl: './firestore-lookup.component.html',
  styleUrls: ['./firestore-lookup.component.scss'],
  providers: [PhoneFormatPipe]
})
export class FirestoreLookupComponent implements OnInit, OnDestroy {
  @Input() collection;
  @Input() doc;
  @Input() field;
  @Input() placeholder = '---';
  @Input() separator = ', ';
  @Input() hrefLink;
  @Output() data: EventEmitter<any> = new EventEmitter();

  public document;
  private subs: Subscription[] = [];

  get label() {
    if (! this.document) { return null; }

    // you can pass a string or an array of fields
    const fields = typeof this.field === 'string' ? [this.field] : this.field;

    if (fields.find(field => this.document[field] === undefined)) {
      return this.placeholder;
    }

    const response = fields.map(field => this.document[field]).join(this.separator);
    if (this.field === 'phone' && response.indexOf('+1') !== -1) {
      return this.phoneFormatPipe.transform(response);
    }

    return fields.map(field => this.document[field]).join(this.separator);
  }

  constructor(private afs: AngularFirestore, private firestoreLookup: FirestoreLookupService, private phoneFormatPipe: PhoneFormatPipe) { }

  ngOnInit() {
    if (this.collection && this.doc) {
      this.subs.push(this.firestoreLookup.lookup(this.collection, this.doc).subscribe(doc => {
        const document = Object.assign({id: this.doc}, doc);
        this.data.emit(document);
        this.document = document;
      }, e => console.error(e)));
    }
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }

}

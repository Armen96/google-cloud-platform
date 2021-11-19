import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {mapCollection} from '../../../firebase-util';
import {throttleTime} from 'rxjs/operators';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-firestore-collection',
  templateUrl: './firestore-collection.component.html',
  styleUrls: ['./firestore-collection.component.scss']
})
export class FirestoreCollectionComponent implements OnInit, OnChanges, OnDestroy {

  @Input() collection: string;

  // a dictionary of filters, eg: {team_id: 'my-team'}
  @Input() filters: any;

  // a query function, see angular firestore docs for more details on available options
  @Input() query: any;

  // if data empty show the emptyDataMessage Input text
  @Input() emptyDataMessage = '';
  @Input() throttleTime = 0;

  @Output() data: EventEmitter<any> = new EventEmitter();

  public hasData = false;
  public loaded = false;

  private subs: Subscription[] = [];

  constructor(private afs: AngularFirestore, private analytics: AngularFireAnalytics) {
  }

  ngOnInit() {
    this.loadData();
    this.data.subscribe(() => {
      this.analytics.logEvent('FIRESTORE_COLLECTION_COMPONENT_CHANGE', {
        collection: this.collection,
        filters: this.filters,
        // todo stringify query
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filters) {
      const before = JSON.stringify(changes.filters.previousValue);
      const current = JSON.stringify(changes.filters.currentValue);
      if (before !== current) {
        this.loadData();
      }
    }
  }

  loadData() {
    const {filters, query} = this;

    if (filters && query) {
      console.error('Firestore collection does not support compound queries that joining queries and filters. ' +
        'We recommend you handle filtering on the client side if necessary.');
      return;
    }
    this.loaded = false;
    let filterQuery;

    if (this.filters) {
      filterQuery = (ref) => {
        Object.keys(this.filters).forEach(field => {
          ref = ref.where(field, '==', this.filters[field]);
        });
        return ref;
      };
    }

    const collectionQuery = filterQuery ? filterQuery : query;

    const queryRef = this.afs.collection(this.collection, collectionQuery).snapshotChanges();

    if (this.throttleTime > 0) {
      this.subs.push(queryRef.pipe(mapCollection, throttleTime(this.throttleTime)).subscribe(collection => {
        this.data.emit(collection);
        this.hasData = collection.length > 0;
        this.loaded = true;
      }));
    } else {
      this.subs.push(queryRef.pipe(mapCollection).subscribe(collection => {
        this.data.emit(collection);
        this.hasData = collection.length > 0;
        this.loaded = true;
      }, e => {
        // todo securely handle errors
      }));
    }
  }



  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }
}

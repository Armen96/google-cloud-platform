import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {isObservable, of, Subscription} from 'rxjs';
import * as moment from 'moment';
import {GooglePlaceDirective} from 'ngx-google-places-autocomplete';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../../ngrx/appState';
import * as fromStoreOpportunity from '../../../../../../../store/opportunities';
import * as fromStoreCampaign from '../../../../../../../store/campaigns';
import * as fromStoreAction from '../../../../../../../store/actions';
import * as fromStoreContact from '../../../../../../../store/contacts';
import {AuthService} from '../../../../../../auth/auth-service';
import {UserInterface} from '../../../../../../interfaces/user.interface';
import {HelperService} from '../../../../../../services/helper.service';

export interface FirestoreElementOption {
  disabled: any;
  id: string;
  label: string;
}
@Component({
  selector: 'app-firestore-form-element',
  templateUrl: './firestore-form-element.component.html',
  styleUrls: ['./firestore-form-element.component.scss']
})
export class FirestoreFormElementComponent implements OnInit, OnChanges, OnDestroy {
  // element options
  @Input() collection: string;
  @Input() document: string;
  @Input() documentObject = null;

  // you can optionally pass a element config object
  @Input() element: any;

  // or use the control as a standalone component
  @Input() id: string;
  @Input() type: string;
  @Input() rows = 4;
  @Input() size: number;
  @Input() placeholder: string;
  @Input() options: any;
  @Input() value: any;
  @Input() autosave: boolean;
  @Input() disabled: boolean;

  // validations
  @Input() required: boolean;
  @Input() unique: boolean;

  // calc field data
  @Input() calcItems = [];
  @Input() calcFields = [];
  @Input() calcFieldsRender = false;

  // events
  @Output() changed: EventEmitter<any> = new EventEmitter();
  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<any> = new EventEmitter();


  // editable elements
  @Input() editable: boolean;

  @Input() showHiddenFields: boolean;
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  // whether the
  public edit = false;

  public types = [
    {id: 'text', label: 'Standard text input'},
    {id: 'textarea', label: 'Multi line text input'},
    {id: 'number', label: 'Number input'},
    {id: 'email', label: 'Email input'},
    {id: 'tel', label: 'Telephone input'},
    {id: 'date', label: 'Date selector'},
    {id: 'time', label: 'Time selector'},
    {id: 'url', label: 'Web link'},
    {id: 'select', label: 'Select control'},
    {id: 'radio_group', label: 'Radio Group'},
    {id: 'checkbox', label: 'Checkbox'},
    {id: 'hidden', label: 'Hidden control'},
    {id: 'calc_field', label: 'Calc Field'},
  ];

  @Output() edited: EventEmitter<any> = new EventEmitter();
  private subs: Subscription[] = [];

  public selectOptions: FirestoreElementOption[];
  public selectGoogleAddressStatus = false;
  public user: UserInterface;
  public calcFieldValues = {};
  public if3DefaultFields = {
    lot_size: true, basement: true, bathrooms: true, size: true, property_type: true,
    street_address: true, city: true, state: true, zipcode: true, subdivision: true,
    bedrooms: true, going_rental_rate: true, listed_price: true, market_value: true, monthly_payment: true,
    mortgage: true, reason_for_selling: true, renting_for: true, repairs: true, taxes: true, time_to_sell: true,
    year_built: true, motivation: true, asking_price: true
  };

  get afsCollection() {
    return this.afs.collection(this.collection);
  }

  get afsDoc() {
    return this.afsCollection.doc(this.document);
  }

  get formFieldStyle() {
    const styles: any = {};
    styles.display = 'block';
    if (this.size) {
      styles['width.rem'] = this.size;
    }
    return styles;
  }

  get csvOptions() {
    const options = this.element.options;
    return options ? options.map(opt => opt.label).join(', ') : null;
  }

  set csvOptions(opts) {
    if (! opts) {
      opts = [];
    }
    if (Array.isArray(opts)) {
      this.element.options = opts;
      return;
    }
    this.element.options = opts.split(',').map(opt => {
      const id = opt.trim();
      const label = id;
      return {id, label};
    });
  }

  get visible() {
    if (this.edit) {
      return false;
    }
    if (this.element.hidden) {
      return this.showHiddenFields;
    }
    return true;
  }

  constructor(
    public afs: AngularFirestore,
    private store: Store<AppState>,
    private auth: AuthService,
    private helperService: HelperService
  ) {}

  ngOnInit() {
    this.subs.push(this.auth.current().subscribe(user => { this.user = user; }));
    // load the element
    if (this.element) {
      this.applyAttributes();
    }

    // load the options
    if (this.options) {
      this.setOptions(this.options);
    }

    // autosave is disabled for new records
    if (! this.document) {
      this.autosave = false;
    }

    if (! this.editable) {
      this.edit = false;
    }

    this.handleValue();

    if (this.collection === 'opportunities' && this.documentObject && this.documentObject[this.id]) {
      this.renderCalcFieldValue(this.documentObject[this.id]);
    }
  }

  ngOnChanges(change) {
    if (! this.editable) {
      this.edit = false;
    }

    if (
      this.collection === 'opportunities' && this.type === 'calc_field' &&
      change && change.hasOwnProperty('calcFieldsRender') && Object.keys(change).length === 1
    ) {
      if (this.documentObject && this.documentObject[this.id]) {
        this.renderCalcFieldValue(this.documentObject[this.id]);
      }
    }

    if (change && change.calcItems) {
      if (this.calcItems && this.calcItems.length) {
        this.calcItems = this.calcItems.filter(item => item.id !== this.id);
      }
    }
  }

  public googleAddressChange(address: any) {
    const addressInfo = address ? address.address_components : null;
    if (addressInfo) {
      let fullAddress = '';
      const data: any = {};
      addressInfo.forEach(component => {
        let value, field;
        if (component.types[0] === 'postal_code') {
          value = component.long_name;
          field = 'zipcode';
        } else if (component.types[0] === 'administrative_area_level_1') {
          value = component.short_name;
          field = 'state';
        } else if (component.types[0] === 'locality') {
          value = component.long_name;
          field = 'city';
        } else if (component.types[0] === 'route') {
          fullAddress = fullAddress ? fullAddress + ' ' + component.long_name : component.long_name;
          value = fullAddress;
          field = 'street_address';
        } else if (component.types[0] === 'street_number') {
          fullAddress = fullAddress ? component.long_name + ' ' + fullAddress : component.long_name;
          value = fullAddress;
          field = 'street_address';
        }

        if (field && value) {
          data[field] = value;
        }
      });

      if (this.autosave) {
        this.afsDoc.update(data).then(res => {
          this.saved.emit(data);
          this.selectGoogleAddressStatus = false;
        });
      }
      this.changed.emit(data);
    }
  }

  /**
   * So Input native change works faster than google googleAddressChange handler that is why we use setTimeout;
   * https://github.com/skynet2/ngx-google-places-autocomplete/blob/master/src/ngx-google-places-autocomplete.directive.ts
   */
  handleGoogleInputChange() {
    setTimeout(() => {
      if (!this.selectGoogleAddressStatus) {
        this.handleChange();
      }
    }, 400);
  }

  setOptions(data) {
    if (typeof data === 'string') {
      data = data.split(',').map(opt => {
        const id = opt.trim();
        const label = id;
        return {id, label};
      });
    }
    const options = isObservable(data) ? data : of(data);
    this.subs.push(options.subscribe((opts: any) => {
      this.csvOptions = opts;
      this.selectOptions = opts.map(opt => {
        if (opt['code']) {
          opt['id'] = opt['code'];
        }
        return opt;
      });
      this.element.options = this.selectOptions;
    }, e => console.error(e)));
  }

  applyAttributes() {
    const attributes = [
      'id', 'type', 'placeholder', 'options', 'value', 'options', 'optionsString', 'required', 'unique', 'size', 'rows', 'protected'
    ];
    attributes.forEach(attr => {
      this[attr] = this.element[attr];
    });
  }

  handleChange() {
    this.subs.push(this.validate().subscribe(valid => {
      if (valid) {
        const data: any = {};
        data[this.id] = this.value;
        if (this.autosave) {
          this.triggerNGRXUpdate(data);
        }
        this.changed.emit(data);
      }
    }, e => console.error(e)));
  }

  validate() {
    return of(true);
  }

  notify() {
    this.applyAttributes();
    this.edited.emit(this.element);

    this.renderCalcFieldValue(this.element.value);
  }

  hide() {
    this.element.hidden = ! this.element.hidden;
    this.notify();
  }

  toggleEdit() {
    if (this.edit) {
      this.applyAttributes();

      // load the options
      if (this.options) {
        this.setOptions(this.options);
      }
    }

    this.edit = ! this.edit;
  }

  handleValue() {
    if (this.id === 'date' && this.type === 'date' && !this.value) {
      this.value = moment().format('YYYY-MM-DD');
      this.handleChange();
    }

    if (this.id === 'date' && this.type === 'date' && typeof this.value === 'number' && this.collection === 'offers') {
      this.value = moment(this.value).format('YYYY-MM-DD');
      this.handleChange();
    }
  }

  triggerNGRXUpdate(data) {
    const updatedData = Object.assign({
      id: this.document,
      modifiedBy: this.user ? this.user.id : '',
      lastModified: Date.now()
    }, data);
    if (this.collection === 'opportunities') {
      this.store.dispatch(new fromStoreOpportunity.UpdateOpportunity(updatedData));
      this.saved.emit(data);
    } else if (this.collection === 'campaigns') {
      this.store.dispatch(new fromStoreCampaign.UpdateCampaign(updatedData));
      this.saved.emit(data);
    } else if (this.collection === 'actions') {
      this.store.dispatch(new fromStoreAction.UpdateAction(updatedData));
      this.saved.emit(data);
    } else if (this.collection === 'contacts') {
      this.store.dispatch(new fromStoreContact.UpdateContact(updatedData));
      this.saved.emit(data);
    }  else {
      this.afsDoc.update(data).then(res => {
        this.saved.emit(data);
      });
    }
  }

  renderCalcFieldValue(context: string = '') {
    if (this.collection === 'opportunities' && this.type === 'calc_field') {
      this.value = this.helperService.calcFieldParser(context, this.documentObject, '#');
      this.calcFieldValues[this.id] = this.value;
    }
  }

  updateCalcValueInDocument(): void {
    if (this.collection === 'opportunities') {
      if (!this.element.value) {
        this.element.value = null;
      }
      this.helperService.updateDocument(this.collection, this.documentObject.id, {[this.id]: this.element.value});
    }
  }

  fieldLevelSave(): void {
    if (this.edit === false && this.collection === 'opportunities') {
      const calcPropertyList = this.documentObject && this.documentObject.doc_calc_list ? this.documentObject.doc_calc_list : {};

      if (this.element && this.element.type === 'calc_field') {
        calcPropertyList[this.element.id] = true;
      } else {
        delete calcPropertyList[this.element.id];
      }

      this.helperService.updateDocument(this.collection, this.documentObject.id, {doc_calc_list: calcPropertyList});
    }
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }
}

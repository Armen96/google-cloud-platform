import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {isObservable, of, Subscription} from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {AuthService} from '../../../../../auth/auth-service';
import * as fromStoreOpportunity from '../../../../../../store/opportunities';
import * as fromStoreCampaign from '../../../../../../store/campaigns';
import * as fromStoreAction from '../../../../../../store/actions';
import * as fromStoreContact from '../../../../../../store/contacts';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../../../ngrx/appState';
import {skip} from 'rxjs/operators';
import {UserInterface} from '../../../../../interfaces/user.interface';
import {HelperService} from '../../../../../services/helper.service';

@Component({
  selector: 'app-firestore-form',
  templateUrl: './firestore-form.component.html',
  styleUrls: ['./firestore-form.component.scss']
})
export class FirestoreFormComponent implements OnInit, OnChanges, OnDestroy {
  // complete form config object to generate a dynamic form from scratch
  @Input() factory: any;
  // firestore collection
  @Input() collection: string;
  // firestore doc, leave empty for create
  @Input() doc: string;
  @Input() docObject: any = null;
  // id field to use for new document
  // for example use 'email' to use the value of the email for the document id
  @Input() idField: string;
  // default values
  @Input() default: any = {};
  // firestore action (create|create-multiple|update|set)
  @Input() action: string;
  @Input() form: any;
  @Input() group: any;
  @Input() fields: string[];
  @Input() autosave: boolean;
  @Input() disabled: boolean;
  @Input() disableSave: boolean;
  @Output() saved: EventEmitter<any> = new EventEmitter();
  @Output() changed: EventEmitter<any> = new EventEmitter();
  // editable forms
  @Input() sortable: boolean;
  @Input() editable: boolean;
  @Output() edited: EventEmitter<any> = new EventEmitter();
  @Output() values: EventEmitter<any> = new EventEmitter();
  @Input() showHiddenFields = false;
  @Input() customStyles: any;
  @Input() saveButtonMessage = 'Save';
  @Input() emitDataWithoutSaving = false;
  @Input() deleteOption = false;
  @Input() deleteButtonMessage = 'Delete';
  @Input() isCancelable = false;
  @Output() deleted: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  public _form: any;
  public newElement: string;
  public prevFormValues;
  public user: UserInterface;
  private subs: Subscription[] = [];
  public calcItems = [];
  public calcFields = [];
  public calcFieldsRender = false;

  get elements() {
    if (!this._form) { return null; }
    const filtered = this.getFilteredFields();

    const sorted = filtered.sort((a: any, b: any) => {
      if (a.position < b.position) { return -1; }
      if (a.position > b.position) { return 1; }
      return 0;
    });

    return sorted;
  }

  get afsCollection() {
    return this.afs.collection(this.collection);
  }

  get afsDoc() {
    return this.afsCollection.doc(this.docId);
  }

  get docId() {
    if (! this.doc) { return null; }
    return typeof this.doc === 'string' ? this.doc : this.doc['id'];
  }

  get data() {
    const data: any = {id: this.docId};
    const elements = Object.keys(this._form);
    elements.forEach(el => {
      data[el] = this._form[el].value;
    });
    return data;
  }

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private store: Store<AppState>,
    private helperService: HelperService
  ) { }

  ngOnInit() {
    this.subs.push(this.auth.current().subscribe(user => { this.user = user; }));

    let valueChangesCount = 0;
    if (this.factory) {
      this.collection = this.factory.collection;
      this.doc = this.factory.doc;
      this.form = this.factory.form;
      this.action = this.factory.action;
    }
    if (this.doc) {
      if (typeof this.doc === 'string') {
        this.subs.push(this.afsDoc.valueChanges().subscribe((doc: any) => {
          valueChangesCount++;
          if (doc) {
            doc['id'] = this.doc;
            this.values.emit(doc);
            if (valueChangesCount < 2) {
              this.loadForm(doc);
            } else {
              // Load again if google address change input works!
              if (doc.hasOwnProperty('street_address') && doc.street_address !== this.prevFormValues.street_address) {
                this.loadForm(doc);
              }
            }
          }
          this.prevFormValues = doc;
        }, e => console.error(e)));
      } else {
        this.loadForm(this.doc);
      }
    } else {
      this.loadForm();
    }

    if (this.collection === 'opportunities' && this.docObject) {
      const opportunityDefaultCalc  = this.helperService.opportunityCalcFields;
      this.helperService.opportunityCalcFieldsAdvanced(this.docObject.team_id).subscribe(data => {
        this.calcItems = opportunityDefaultCalc.concat(data);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.doc) {
      // Load again if google address change input works!
      if (changes.doc.currentValue && changes.doc.currentValue.hasOwnProperty('street_address')) {
        if (!this.prevFormValues || changes.doc.currentValue.street_address !== this.prevFormValues.street_address) {
          this.loadForm(changes.doc.currentValue, true);
        }
      }

      this.prevFormValues = this.doc;
    }

    if (changes && changes.showHiddenFields) {
      if (typeof changes.showHiddenFields.currentValue === 'boolean') {
        this.showHiddenFields = changes.showHiddenFields.currentValue;
      }
    }
  }

  loadForm(doc = null, reload = false) {
    const form = isObservable(this.form) ? this.form : of(this.form);
    this._form = {};
    this.subs.push(form.subscribe((elements: any) => {
      if (elements) {
        elements.forEach(element => {
          const {id, placeholder} = element;
          // prepare form elements
          const formElement: any = {id, placeholder};

          formElement.type = element['type'] ? element['type'] : 'text';

          let value = null;
          if (doc && reload) {
            value = doc[element.id];
          } else if (doc) {
            value = doc[element.id];
          } else if (element['value']) {
            value = element['value'];
          } else if (this.default && this.default[element.id]) {
            value = this.default[element.id];
          }

          formElement.value = value;
          formElement.options = element['options'] ? element['options'] : null;
          formElement.required = element['required'] ? element['required'] : false;
          formElement.disabled = element['disabled'] ? element['disabled'] : false;
          formElement.size = element['size'] ? element['size'] : false;
          formElement.position = element['position'] ? element['position'] : null;
          formElement.rows = element['rows'] ? element['rows'] : null;
          formElement.hidden = element['hidden'] ? element['hidden'] : false;
          formElement.protected = element['protected'] ? element['protected'] : false;
          formElement.placeholder = element['placeholder'] ? element['placeholder'] : false;

          if (formElement && formElement.options) {
            formElement.options.forEach(option => {
              if (option && option.hasOwnProperty('code') && option.id === undefined) {
                option['id'] = option.code;
              }
            });
          }

          if (element && element.type === 'calc_field') {
            if (this.calcItems.indexOf(element.id) === -1) {
              this.calcFields.push(element.id);
            }
          }

          this._form[id] = formElement;
        });
      }
    }, e => console.error(e)));
  }

  save() {
    if (this.autosave) { // the elements handle saving themselves, do not process form
      return false;
    }
    const data: any = this.default;
    const elementsValid = [];

    // Check if the filters are set
    // Set the fields on filteredForm
    const filteredForm = this.fields && this.fields.length > 0 ? this.getFilteredFields() : this._form;

    // Get the data of the fields
    Object.values(filteredForm).forEach((el: any) => {
      const value = typeof el.value === 'undefined' ? '' : el.value;
      // Check if the form has required fields
      if (el.required && !this.isValid(value)) {
        elementsValid.push(false);
      } else {
        elementsValid.push(true);
      }
      data[el.id] = value;
    });

    // Check if the form is valid
    const isFormInvalid = elementsValid.includes(false);

    if (!isFormInvalid) {
      switch (this.action) {
        case 'create':
          return this.create(data);
        case 'create-multiple':
          return this.create(data);
        case 'update':
          return this.update(data);
        case 'set':
          return this.set(data);
      }
    }
  }

  getFilteredFields() {
    const elements = Object.values(this._form);
    return elements.filter((el: any) => {
      if (this.fields && this.fields.indexOf(el.id) === -1) {
        return false;
      }
      return true; // el.type !== 'hidden';
    });
  }

  isValid(value) {
    if (! value) {
      return false;
    } else {
      return value.trim() !== '';
    }
  }

  // todo refactor setting the id remove dupe code
  create(data) {
    if (! this.emitDataWithoutSaving) {
      data.created_at = Date.now();
      if (this.idField) {
        const id = data[this.idField];
        this.afsCollection.doc(id).set(data).then(res => {
          this.afterCreateRecord(data, id);
        }).catch(error => console.error(error));
      } else {
        this.triggerNGRXCreate(data);
      }
    } else {
      this.notify(data);
    }
  }

  resetForm() {
    const form = Object.assign({}, this._form);
    Object.keys(form).forEach(key => {
      form[key].value = null;
    });
    this._form = form;
  }

  update(data) {
    data.updated_at = Date.now();
    this.afsDoc.update(data).then(res => {
      this.notify(data);
    });
  }

  set(data) {
    data.updated_at = Date.now();
    this.afsDoc.set(data).then(res => {
      this.notify(data);
    });
  }

  notify(data = null) {
    if (! data) {
      data = [];
    }
    if (! data['id']) {
      data['id'] = this.docId;
    }
    this.saved.emit({
      action: this.action,
      collection: this.collection,
      document: data.id,
      data: data
    });
  }

  handleChange(data) {
    const field = Object.keys(data)[0];
    this._form[field].value = data[field];
    this.changed.emit({
      action: this.action,
      collection: this.collection,
      document: this.docId,
      changes: data,
      data: this.data
    });
  }

  handleSave(data) {
    const field = Object.keys(data)[0];
    this._form[field].value = data[field];
    this.saved.emit({
      action: this.action,
      collection: this.collection,
      document: this.docId,
      data: this.data
    });

    if (data && ((this.calcFields && this.calcFields.length) || (this.calcItems && this.calcItems.length))) {
      const key = Object.keys(data)[0];
      this.docObject[key] = data[key];
      this.calcFieldsRender = !this.calcFieldsRender;
    }
  }

  drop(event: CdkDragDrop<unknown[]>) {
    const form = Object.assign([], this.form);
    moveItemInArray(form, event.previousIndex, event.currentIndex);
    for (let i = 0; i < form.length; i++) {
      const el = form[i];
      el.position = i;
      this._form[el.id] = Object.assign(this._form[el.id], el);
    }

    this.form = form;
    this.edited.emit(form);
  }

  handleEdited(el) {
    // update current form so there is no lag in the ui
    this._form[el.id] = Object.assign(this._form[el.id], el);

    // update the base form
    const form = Object.assign([], this.form);
    const index = form.findIndex(e => e.id === el.id);
    form[index] = el;
    this.form = form;
    this.edited.emit(form);
  }

  addElement() {
    const label = this.newElement;
    const pureID = label.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '');
    const id = pureID.replace(/ /g, '_');

    const el = {
      id,
      required: false,
      type: 'text',
      placeholder: label,
      group: this.group,
      position: this.form.length
    };
    this.newElement = '';
    this._form[id] = el;

    const form = Object.assign([], this.form);
    form.push(el);
    this.edited.emit(form);
  }

  triggerNGRXCreate(data) {
    const updatedData = Object.assign({
      createdBy: this.user ? this.user.id : '',
      lastModified: Date.now()
    }, data);

    if (this.collection === 'opportunities') {
      this.store.dispatch(new fromStoreOpportunity.CreateOpportunity(updatedData));
      this.subs.push(this.store.pipe(select(fromStoreOpportunity.getSelectedOpportunity)).subscribe(response => {
        if (response && response.id && response.is_created) {
          this.afterCreateRecord(data, response.id);
        }
      }));
    } else if (this.collection === 'campaigns') {
      this.store.dispatch(new fromStoreCampaign.CreateCampaign(updatedData));
      this.subs.push(this.store.pipe(select(fromStoreCampaign.getSelectedCampaign)).pipe(skip(1)).subscribe(response => {
        if (response && response.id && response.is_created) {
          this.afterCreateRecord(data, response.id);
        }
      }));
    } else if (this.collection === 'actions') {
      this.store.dispatch(new fromStoreAction.CreateAction(updatedData));
      this.subs.push(this.store.pipe(select(fromStoreAction.getSelectedAction)).subscribe(response => {
        if (response && response.id && response.is_created) {
          this.afterCreateRecord(data, response.id);
        }
      }));
    } else if (this.collection === 'contacts') {
      this.store.dispatch(new fromStoreContact.CreateContact(updatedData));
      this.subs.push(this.store.pipe(select(fromStoreContact.getSelectedContact)).pipe(skip(1)).subscribe(response => {
        if (response && response.id && response.is_created) {
          this.afterCreateRecord(data, response.id);
        }
      }));
    }  else {
      this.afsCollection.add(data).then(res => {
        this.afterCreateRecord(data, res.id);
      }).catch(error => { console.error(error); });
    }
  }

  afterCreateRecord(data, responseId: string) {
    data['id'] = responseId;
    this.notify(data);

    if (this.action === 'create-multiple') {
      this.resetForm();
    } else {
      this.doc = responseId;
      this.action = 'update';
    }
  }

  deleteDocument() {
    this.afsCollection.doc(this.docId).delete();
    this.deleted.emit(true);
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }
}

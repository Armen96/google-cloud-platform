Firestore Form
==============

The Firestore Form components generate forms that are linked to the Firestore database. 

You have the option of building complete data driven forms using the [FirestoreFormComponent](#FirestoreFormComponent), 
or manually building forms using the [FirestoreFormElementComponent](#FirestoreFormElementComponent).

FirestoreFormComponent
----------------------

### API

| Name        | Description |
| ----------- | ----------- |
| `@Input() factory: any` | A form configuration object that includes the collection, doc, action, and elements |
| `@Input() collection: string` | The name of the linked Firestore collection |
| `@Input() doc: string` | The document ID |
| `@Input() default: any` | Default form values |
| `@Input() action: string` | Action to take (create / update / set) |
| `@Input() form: Array / Observable` | Array of form elements or an observable that returns one |
| `@Input() autosave: boolean` | Whether to automatically save elements as they are edited or add a save button and submit the whole form. Note that this is disabled for new documents. |
| `@Output() changed: any` | Returns the form data after it has been changed |
| `@Output() saved: any` | Returns the form data after it has been saved |


### Usage

All of the form controls listed on the [Angular Material / Input](https://material.angular.io/components/input/overview)
are supported.

Here's a sample form configuration:

```typescript
form = [
  {
     id: 'company_id',
     type: 'hidden',
     value: 'my-company' // set a default hidden value
  },
  {
     id: 'name',
     type: 'text',
     placeholder: 'Team Name',
     required: true
  },
]
```

### Creating a new document

Set action to `create` to create a new document. Note that the form will automatically switch to  `update` after the record is created.

- [ ] todo: add an optional checkbox to add another record

```html
<app-firestore-form collection="teams" action="create" [form]="form"></app-firestore-form>
```

### Updating an existing document

Set action to `update` to update an existing document. Note that update will not replace fields not specified in your form
(useful when you have partial forms);

```html
<app-firestore-form collection="teams" doc="my-team-id" action="update" [form]="form"></app-firestore-form>
```

### Replace an existing document

Set action to `set` to replace an existing document. The existing doc will be completely replaced by the new data.

```html
<app-firestore-form collection="teams" document="my-team-id"  action="set" [form]="form"></app-firestore-form>
```

FirestoreFormElementComponent
-----------------------------

The `FirestoreFormComponent` basically maps form configuration to `FirestoreFormElementComponent`, which you can use independently for custom forms.


### API

| Name        | Description |
| ----------- | ----------- |
| `@Input() collection: string` | The name of the linked Firestore collection |
| `@Input() document: string` | The document ID |
| `@Input() element: any` | A configuration object that defines the attributes for the element |
| `@Input() id: string` | The id of the bound field |
| `@Input() type: string`| The control type, supports select and all [material input types](https://material.angular.io/components/input/overview) |
| `@Input() size: number` | The width of the element (in rem), defaults to full width |
| `@Input() placeholder: string` | The field placeholder / label |
| `@Input() options: FirestoreElementOption[] / Observable` | Options for select controls or an observable that returns them |
| `@Input() value: any` | Field value |
| `@Input() autosave: boolean` | Whether to save the field automatically after change |
| `@Input() required: boolean` | Whether the field is required |
| `@Input() unique: boolean` | Whether the field must be unique |
| `@Output() changed: EventEmitter<any>` | Outputs the field / value after the value is changed  |
| `@Output() saved: EventEmitter<any>` | Outputs the field / value after the value is saved  |

### Usage

You can use the `FirestoreFormElementComponent` as a standalone component to build custom editable pages.

```html
  <app-firestore-form-element
    collection="contacts"
    [document]="contact.id"
    [autosave]="true"
    id="first_name"
    [value]="contact.first_name"
    placeholder="Test The First Name"></app-firestore-form-element>
```

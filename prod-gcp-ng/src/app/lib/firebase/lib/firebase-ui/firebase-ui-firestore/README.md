# Firebase Ui Firestore

These are UI components that automate interacting with Firestore Database resources

## FirestoreCollection

The FirestoreDoc component loads a Firestore collection, then emits it through a `data` event:

```html
<app-firestore-collection collection="teams" (data)="teams = $event">
  <div *ngFor="let team of (teams ? teams : [])">
    {{team.name}}
  </div>
</app-firestore-collection>
```

### Querying Collections

You can pass a callback function as a query which is passed the query ref. All of the Firestore query options are supported.

_johns.component.ts_

```typescript
private contactQuery = (ref) => ref.where('first_name', '==', 'John');
```
_johns.component.html_

```html
<app-firestore-collection collection="contacts" [query]="contactQuery" (data)="contacts = $event">
  <div *ngFor="let contact of (contacts ? contacts : [])">
    {{contact.first_name}} {{contact.last_name}}
  </div>
</app-firestore-collection>
```

## FirestoreDoc

The FirestoreDoc component loads a Firestore document, then emits it through a `data` event:

```html
<app-firestore-doc collection="teams" doc="if_test" (data)="team = $event">
  <div *ngIf="team">{{team.name}}</div>
</app-firestore-doc>
```

## FirestoreForm

The Firestore Form components generate forms that are linked to the Firestore database. 

[Learn more about Firestore Form](./firestore-form)

import {Component, Input, OnInit, TemplateRef} from '@angular/core';

@Component({
  selector: 'app-firestore-data-list',
  templateUrl: './firestore-data-list.component.html',
  styleUrls: ['./firestore-data-list.component.scss']
})
export class FirestoreDataListComponent implements OnInit {
  @Input() collection: string;

  // a dictionary of filters, eg: {team_id: 'my-team'}
  @Input() filters: any;

  // a query function, see angular firestore docs for more details on available options
  @Input() query: any;

  @Input() dataTemplate: TemplateRef<any>;

  // searching function, search is disabled if this in not set
  @Input() search: Function;

  private _data;

  set data(data) {
    this._data = data;
  }

  get data() {
    return this._data;
  }

  constructor() { }

  ngOnInit() {
  }

}

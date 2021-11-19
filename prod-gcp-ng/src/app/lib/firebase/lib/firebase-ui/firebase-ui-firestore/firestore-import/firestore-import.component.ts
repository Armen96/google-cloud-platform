import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-firestore-import',
  templateUrl: './firestore-import.component.html',
  styleUrls: ['./firestore-import.component.scss']
})
export class FirestoreImportComponent implements OnInit {
  @Input() file;

  constructor() { }

  ngOnInit() {
  }

  import() {
  }

}

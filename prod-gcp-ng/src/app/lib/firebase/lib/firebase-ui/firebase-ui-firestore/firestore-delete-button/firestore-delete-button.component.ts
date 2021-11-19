import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-firestore-delete-button',
  templateUrl: './firestore-delete-button.component.html',
  styleUrls: ['./firestore-delete-button.component.scss']
})
export class FirestoreDeleteButtonComponent implements OnInit {
  @Input() collection: string;
  @Input() doc: string;
  @Output() deleted: EventEmitter<any> = new EventEmitter();

  public confirmed: boolean;

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
  }

  handleClick() {
    if (this.confirmed) {
      this.afs.collection(this.collection).doc(this.doc).delete().then(res => {
        this.deleted.emit(res);
      }, e => {
        console.error(e);
      });
    } else {
      this.confirmed = true;
      // you have 5 seconds to click it again
      setTimeout(() => this.confirmed = false, 5000);
    }
  }

}

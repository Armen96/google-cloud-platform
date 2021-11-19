import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Observable, Subscription} from 'rxjs';
import {AngularFirestoreCollection} from '@angular/fire/firestore';
import {mapCollection} from '../../../firebase-util';
import {first} from 'rxjs/internal/operators';
import * as XLSX from 'xlsx';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-firestore-export',
  templateUrl: './firestore-export.component.html',
  styleUrls: ['./firestore-export.component.scss']
})
export class FirestoreExportComponent implements OnInit, OnDestroy {
  @Input() collections: AngularFirestoreCollection[];
  @Input() filename = 'investorfuse_export.xlsx';
  private subs: Subscription[] = [];

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  export() {
    const refs = [];
    this.collections.forEach((c: AngularFirestoreCollection) => {
      refs.push(c.snapshotChanges().pipe(mapCollection).pipe(first()));
    });

    let snackbar = this._snackBar.open('Loading Firebase data', 'ok', {
      duration: 2000,
    });

    this.subs.push(forkJoin(refs).subscribe(res => {
      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      snackbar.dismiss();
      snackbar = this._snackBar.open('Data loaded, building workbook', 'ok', {
        duration: 1000,
      });
      res.forEach((collection: any, i) => {
        if (collection) {
          // find ref
          const name = this.collections[i].ref.id;
          const columns = Object.keys(collection[0]);
          const data = [columns];
          collection.forEach(doc => {
            data.push(Object.values(doc));
          });
          const sheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

          XLSX.utils.book_append_sheet(workbook, sheet, name);
        }
      });

      snackbar.dismiss();
      this._snackBar.open('Workbook complete, downloading export', 'ok', {
        duration: 2000,
      });

      XLSX.writeFile(workbook, this.filename);
    }, e => console.error(e)));
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }
}


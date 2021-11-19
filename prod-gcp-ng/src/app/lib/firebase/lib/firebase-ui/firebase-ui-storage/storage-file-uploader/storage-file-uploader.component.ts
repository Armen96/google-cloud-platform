import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

export interface FileListItem {
  path: string;
  display_name?: string;
}

@Component({
  selector: 'app-storage-file-uploader',
  templateUrl: './storage-file-uploader.component.html',
  styleUrls: ['./storage-file-uploader.component.scss']
})
export class StorageFileUploaderComponent implements OnInit, OnDestroy {
  @Input() label = 'Upload File';
  @Input() stream: boolean;
  @Input() path: string;
  @Input() files: FileListItem[];
  @Input() multiple = false;
  @Output() uploaded: EventEmitter<any> = new EventEmitter();

  public file;
  public fileData;
  public downloadUrl;
  private messageRef;
  private subs: Subscription[] = [];
  public isLoading = false;

  constructor(private storage: AngularFireStorage, private snackbar: MatSnackBar) { }

  ngOnInit() { }

  detectFiles(event, type = 'upload') {
    if (this.multiple) {
      this.isLoading = true;
      const keys = Object.keys(event.target.files);
      keys.forEach((item, i) => {setTimeout(() => { this.parseFileInfo(event.target.files[item]); }, i * 3500); });
      setTimeout(() => { this.isLoading = false; }, keys.length * 3500);
    } else {
      this.parseFileInfo(event.target.files[0]);
    }
  }

  parseFileInfo(fileInfo) {
    if (fileInfo) {
      this.file = fileInfo;
      const reader = new FileReader();
      reader.onload = e => {
        this.fileData = reader.result;
        this.upload();
      };

      if (this.stream) {
        reader.readAsBinaryString(this.file);
      } else {
        reader.readAsDataURL(this.file);
      }
    }
  }

  upload() {
    if (this.stream) {
      this.loadStream();
    } else {
      this.uploadToCdn();
    }
  }

  uploadToCdn() {
    if (this.file) {
      this.showMessage('Uploading file to CDN');
      const filePath = this.path + '/' + this.file.name;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.file).then(() => {
        this.subs.push(this.storage.ref(filePath).getDownloadURL().subscribe(url => {
          this.showMessage('File successfully uploaded');
          this.downloadUrl = url;
          this.notify();
          if (this.files) {
            this.files.push({path: url});
          }
          this.clearUpload();
        }));
      });
    }
  }
  // Todo remove the property data
  loadStream() {
    if (this.file) {
      const file = {
        lastModified: this.file.lastModified,
        name: this.file.name,
        size: this.file.size,
        type: this.file.type,
        path: this.path,
        data: this.fileData,
        originalFile: this.file
      };
      this.uploaded.emit(file);
    }
  }

  notify() {
    if (this.file) {
      const file = {
        lastModified: this.file.lastModified,
        name: this.file.name,
        size: this.file.size,
        type: this.file.type,
        path: this.path,
        downloadUrl: this.downloadUrl,
        data: this.fileData
      };
      this.uploaded.emit(file);
    }
  }

  clearUpload() {
    this.file = null;
    this.fileData = null;
  }

  showMessage(message) {
    if (this.messageRef) {
      this.messageRef.dismiss();
    }

    this.messageRef = this.snackbar.open(message, 'close', {duration: 3000});
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }
}

import { Component, OnInit } from '@angular/core';
/*import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CanteenService } from 'src/app/services/canteen/canteen.service';*/
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

//1.)Issue for this is to retrieve the rest of the images in the Canteen Database
//2.)

export interface MyData {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-modal-addcanteen',
  templateUrl: './modal-addcanteen.page.html',
  styleUrls: ['./modal-addcanteen.page.scss'],
})

export class ModalAddcanteenPage{
  
  // Upload image 
  task: AngularFireUploadTask;

  // Percentage progress for the image upload
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  //Uploaded Image List
  images: Observable<MyData[]>;

  //File details  
  fileName: string;
  fileSize: number;

  //Status check of file upload
  isUploading: boolean;
  isUploaded: boolean;

  private imageCollection: AngularFirestoreCollection<MyData>;
  constructor(private storage: AngularFireStorage, private database: AngularFirestore, private navCtrl: NavController) {
    this.isUploading = false;
    this.isUploaded = false;

    //Collection of where the images will be saved into 
    this.imageCollection = database.collection<MyData>('canteen');
    this.images = this.imageCollection.valueChanges();
  }


  uploadFile(event: FileList) {


    // The File object
    const file = event.item(0)

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ')
      return;
    }

    this.isUploading = true;
    this.isUploaded = false;


    this.fileName = file.name;

    // The storage path for the images uploaded to be stored 
    const path = `Canteen Images/${new Date().getTime()}_${file.name}`;

    //Optional metadata 
    const customMetadata = { app: 'Canteen Image Upload ' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(

      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();

        this.UploadedFileURL.subscribe(resp => {
          this.addImagetoDB({
            name: file.name,
            filepath: resp,
            size: this.fileSize
          });
          this.isUploading = false;
          this.isUploaded = true;
        }, error => {
          console.error(error);
        })
      }),
      tap(snap => {
        this.fileSize = snap.totalBytes;
      })
    )
  }
  dismiss(){
    this.navCtrl.back();
  }

  addImagetoDB(image: MyData) {
    //Creates an ID for document
    const id = this.database.createId();

    //Set document id with value in database
    this.imageCollection.doc(id).set(image).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log("error " + error);
    });
  }


}
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanteenService {
  canteen: Subscription;
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private toast: ToastController) { }

  //Get canteen by ID
  getCanteenbyid(id) {
    return this.firestore.collection('canteen').doc(id).valueChanges({ idField: 'id' })
  }

  //Add canteen, remove images
  async addCanteen(canteenName, color,) {
    console.log(canteenName, color)
    return this.firestore.collection('canteen').add({
      canteenname: canteenName,
      color: color,
      deleted: false
    });
  }

  //Delete canteen
  deleteCanteen(id, mergedName) {
    return this.firestore.collection('canteen').doc(id).delete();
  }

  //When admin didn't select any images to update/edit
  editCanteenNoImg(newName, id) {
    return this.firestore.collection('canteen').doc(id).update({ canteenname: newName })
  }

  //Edit canteen
  async editCanteenWithColour(canteenname, id, image, filename, oldname, color) {
    // this.storage.ref('Canteen Images/' + oldname).delete(); //Delete previous food image
    //var storageURL = 'Canteen Images/'; 
    var mergedName = filename + id;
    //var storageRef = await this.storage.ref(storageURL).child(mergedName).put(image);
    //var downloadURL = await this.storage.ref('Canteen Images/' + mergedName).getDownloadURL().toPromise();
    return this.firestore.collection('canteen').doc(id).update({ id: id, mergedName: mergedName, color: color })
  }
  //This is for the change deleted field in canteen collection
  Update(id, deleted:boolean) {
    this.firestore.collection('canteen').doc(id).update({ deleted: deleted })
  }

  getAll() {
    return this.firestore.collection('canteen', ref => ref.where('deleted', '==', false)).valueChanges({ idField: 'id' });
  }
}
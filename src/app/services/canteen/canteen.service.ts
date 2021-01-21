import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import firebase from 'firebase';
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

  //Add canteen
  async addCanteen(canteenName, image, id, filename) {
    //console.log(image);
    var storageURL = 'Canteen Images/';
    var mergedName = filename + id;
    var storageRef = await this.storage.ref(storageURL).child(mergedName).put(image);
    var downloadURL = await this.storage.ref('Canteen Images/' + mergedName).getDownloadURL().toPromise();
    return this.firestore.collection('canteen').add({
      canteenname : canteenName,
      image: downloadURL,
      mergedname: mergedName
    });
  }

  //Delete canteen
  deleteCanteen(id, mergedName) {
    this.storage.ref('Canteen Images/' + mergedName).delete(); //Delete previous food image
    return this.firestore.collection('canteen').doc(id).delete();
  }

  //When admin didn't select any images to update/edit
  editCanteenNoImg(newName, id) {
    return this.firestore.collection('canteen').doc(id).update({ canteenname: newName })
  }

  //Edit canteen
  async editCanteenWithImg(canteenName, id, image, filename, oldname) {
    this.storage.ref('Canteen Images/' + oldname).delete(); //Delete previous food image
    var storageURL = 'Canteen Images/'; 
    var mergedName = filename + id;
    var storageRef = await this.storage.ref(storageURL).child(mergedName).put(image);
    var downloadURL = await this.storage.ref('Canteen Images/' + mergedName).getDownloadURL().toPromise();
    return this.firestore.collection('canteen').doc(id).update({ id: id, image: downloadURL, mergedName: mergedName })
  }

  getAll() {
    return this.firestore.collection('canteen').valueChanges({ idField: 'id' });
  }
}
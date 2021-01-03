import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, private toast: ToastController) { }



  getRespectiveFood(acc){
    //console.log(acc);
    return this.firestore.collection('food', ref => ref.where('userid', '==', acc)).valueChanges({idField: 'id'});
  }

  async addFood(foodname, foodprice, halal, userid, vegetarian, image, filename){
    //console.log(image);
    var storageURL = 'Food Images/';
    var storageRef = await this.storage.ref(storageURL).child(filename).put(image);
    console.log(storageRef);
    var downloadURL = await this.storage.ref('Food Images/' + filename).getDownloadURL().toPromise();
    console.log(downloadURL);

    
    /*return this.firestore.collection('food').doc().set({availquantity: 0, foodname: foodname, foodprice: foodprice, halal: halal, 
    userid: userid, vegetarian: vegetarian});*/
  }

}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import firebase from 'firebase';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  newDate: Date;

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, private toast: ToastController) { }

  getAllOrders(date,date2){
    //console.log(id);
    //console.log("Date Format: " +date);
    //console.log(date2);
    //return this.firestore.collection('orders', ref => ref.where('date', '>=', date).where('date', '<=',date2).where('vendorID','==',id)).valueChanges({idField: 'id'});
    return this.firestore.collection('orders', ref => ref.where('date', '>=', date).where('date', '<=',date2)).valueChanges({idField: 'id'});
  }

  //When student redeem a food, it will add it into their orders
  addOrders(canteenid, date: Date, foodname, foodprice: number, image, stampUsed: number, userid, vendorid){
    return this.firestore.collection('orders').add({canteenID: canteenid, date: date, foodname: foodname, foodprice: foodprice,
    image: image, stampUsed: stampUsed, userID: userid, vendorID: vendorid});

  }



}

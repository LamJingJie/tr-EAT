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
    //console.log(date);
    //console.log(date2);
    //return this.firestore.collection('orders', ref => ref.where('date', '>=', date).where('date', '<=',date2).where('vendorID','==',id)).valueChanges({idField: 'id'});
    return this.firestore.collection('orders', ref => ref.where('datecompleted', '>=', date).where('datecompleted', '<=',date2).where('completed', '==', true)).valueChanges({idField: 'id'});
  }

  getMonthly(date, date2){
    //console.log(date);
    //console.log(date2);
    return this.firestore.collection('orders', ref => ref.where('datecompleted', '>=', date).where('datecompleted', '<',date2).where('completed', '==', true)).valueChanges({idField: 'id'});
  }

  getAllForVendor(vendorid, completed: boolean){
    return this.firestore.collection('orders', ref => ref.where('vendorID', '==', vendorid).where('completed', '==', completed).orderBy('date', 'desc')).valueChanges({idField: 'id'});
  }

  getAllForStudent(studentid, completed: boolean){
    return this.firestore.collection('orders', ref => ref.where('userID', '==', studentid).where('completed', '==', completed).orderBy('date', 'desc')).valueChanges({idField: 'id'});
  }

  getLast5Orders(vendorid, completed: boolean){
    return this.firestore.collection('orders', ref => ref.where('vendorID', '==', vendorid).where('completed', '==', completed).orderBy('date', 'desc').limit(5)).valueChanges({idField: 'id'});
  }

  getOneOrder(id){
    return this.firestore.collection('orders').doc(id).valueChanges({idField: 'id'});
  }

  //When student redeem a food, it will add it into their orders
  addOrders(canteenid, date: Date, foodname, foodprice: number, image, stampUsed: number, userid, vendorid, foodid){
    //foodid to be used when student wants to reorder the same food
    return this.firestore.collection('orders').add({canteenID: canteenid, date: date, datecompleted: date, foodname: foodname, foodprice: foodprice,
    image: image, stampUsed: stampUsed, userID: userid, vendorID: vendorid, foodid:foodid, completed: false});

  }

  //Students has collected the order and so, order is completed
  updateComplete(id, date){
    return this.firestore.collection('orders').doc(id).update({completed: true, datecompleted: date});
  }

  //Check if current student has made any orders recently
  checkOrders(email, date, date2){
    return this.firestore.collection('orders', ref=> ref.where('userID', '==', email). where('date','>=',date).where('date','<=', date2)).valueChanges({idField: 'id'});
  }
  

  



}

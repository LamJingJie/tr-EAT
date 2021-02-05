import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import firebase from 'firebase';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  history: Subscription;

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, private toast: ToastController) { }


  //History tab for specific sponsor, based on what they had sponsored in the past
  transfer_cart_to_history(userid, date, canteenid, foodid, foodname, foodprice:number,image, orderquantity:number, vendorid, totalcost: number){
    /*console.log(userid)
    console.log(date)
    console.log(canteenid)
    console.log(foodid)
    console.log(foodname)
    console.log(foodprice)
    console.log(image)
    console.log(orderquantity)
    console.log(vendorid)
    console.log(totalcost)*/
    return this.firestore.collection("history").doc(userid).collection('data').add({canteenid: canteenid, date: date, foodid: foodid,
    foodname: foodname, foodprice: foodprice, image: image, orderquantity: orderquantity, vendorid: vendorid, totalcost: totalcost, confirmpayment: false});
  }

  getSponsorHistory(email, confirmpayment: boolean){
    return this.firestore.collection("history").doc(email).collection('data', ref=> ref.orderBy('date', 'desc').where('confirmpayment', '==', confirmpayment)).valueChanges({idField: 'id'});
  }

  getHistoryNotPaid(email){
    return this.firestore.collection("history").doc(email).collection('data', ref=> ref.where('confirmpayment', '==', false)).valueChanges({idField: 'id'});
  }

  updateConfirmPay(email, id){
  
    return this.firestore.collection("history").doc(email).collection('data').doc(id).update({confirmpayment: true});
    
  }
  //Update date to when the student clicks on confirm payment
  updateHistoryDate(email, id, date){
    return this.firestore.collection("history").doc(email).collection('data').doc(id).update({date: date});
  }

 

}

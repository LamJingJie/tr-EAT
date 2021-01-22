import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import firebase from 'firebase';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  foodArray: any = [];
  quantity: any;

  foodExistSubscription: Subscription;

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, private toast: ToastController) { }

  //Get all food stored in a cart for a specific user
  getAllCart(email){
    return this.firestore.collection('cart').doc(email).collection('data').valueChanges({idField: 'id'});
  }

  //Delete specific food in cart
  deleteSpecificFoodInCart(email, foodid){
    return this.firestore.collection('cart').doc(email).collection('data').doc(foodid).delete();
  }

  //Delete cart respective to the user chosen
  deleteRespectiveCart(email){
    return this.firestore.collection('cart').doc(email).delete();
  }

  updateQuantity(email, quantity, foodid){
    return this.firestore.collection('cart').doc(email).collection('data').doc(foodid).update({orderquantity: quantity});
  }

  addToCart(foodid, userid, canteenid, orderquantity: number, foodname){

   //this.userDetails = data;
   //this.listed = this.userDetails.listed;

    var cartDoc = this.firestore.collection('cart').doc(userid).collection('data').doc(foodid);
    return new Promise((resolve, reject) =>{

      cartDoc.get().toPromise().then(doc =>{
        if(!doc.exists){
          //console.log("Doesn't Exists")
          this.firestore.collection('cart').doc(userid).collection('data').doc(foodid).set({userid: userid, canteenid: canteenid, orderquantity: orderquantity}).then((res=>{
            resolve(res);
          }));
        }else{
          //console.log("Exists");
          //If exists, add onto existing quantity
          this.foodExistSubscription = this.firestore.collection('cart').doc(userid).collection('data').doc(foodid).valueChanges({idField: 'id'}).subscribe((res=>{
            
            this.quantity = res.orderquantity;
            //console.log(this.quantity);
            orderquantity = orderquantity + this.quantity;
            //console.log(orderquantity); 
            this.firestore.collection('cart').doc(userid).collection('data').doc(foodid).update({orderquantity: orderquantity}).then((res=>{
              resolve(res);
            }));
  
            this.foodExistSubscription.unsubscribe();
          }))
        }
    })
       
      
    })

    //console.log(foodid);
    //console.log(userid);
    //console.log(canteenid);
    //console.log(orderquantity);
    
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, private toast: ToastController) { }

  //Delete cart respective to the user chosen
  deleteRespectiveCart(email){
    return this.firestore.collection('cart').doc(email).delete();
  }
}

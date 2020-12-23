import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }

  addSponsor(email, role){
      return this.firestore.collection('users').doc(email).set({role: role});
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';

/*export interface User{
  email: string,
  role: string,
}*/

//const ITEM_KEY = 'my-user'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: any;

  constructor(private firestore: AngularFirestore, public storage: Storage) { }

   addSponsor(email, role){
    //console.log(email + role);
      return  this.firestore.collection('users').doc(email).set({role: role});
  }
  getOne(email){
    //return this.firestore.collection('users').doc(email).get();
    return this.firestore.collection('users').doc(email).valueChanges({idField: 'id'});
  }






  // Those 2 functions below are for when the user log in, the 
  /*addUser(user: User): Promise<any>{
    console.log("add User: " + user);
    return this.storage.get(ITEM_KEY).then((users: User[]) => {

      if (users == null) {

        // sches.push(sche);
        return this.storage.set(ITEM_KEY, [user]);

      } 
      });
  }

  getUser(): Promise<User[]> {  // Retrieve
    //console.log(this.storage.get(ITEM_KEY));
    return this.storage.get(ITEM_KEY);
  }


  deleteUser(): Promise<User[]>{
    return this.storage.remove(ITEM_KEY);
  }*/
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';

export interface User{
  email: string,
}

//const ITEM_KEY = 'my-user'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: any;

  constructor(private firestore: AngularFirestore, public storage: Storage) { }

    addSponsor(email, role){
    // console.log(email + role);
      return  this.firestore.collection('users').doc(email).set({role: role, listed: true});

  }

   addVendor(email, canteenid, stallname, role){
    //console.log(email + role);
      return  this.firestore.collection('users').doc(email).set({role: role, canteenID: canteenid, stallname: stallname, listed: true});
  }

   addStudent(email, stamp:number, role){
    //console.log(email + role);
      return  this.firestore.collection('users').doc(email).set({role: role, stampLeft: stamp, favourite: [], listed: true});
  }

  getAll(role){
    return this.firestore.collection('users', ref => ref.where('role', '!=', "admin").where('role','==', role)).valueChanges({idField: 'id'});
  }

  getOnlyVendor(){
    return this.firestore.collection('users', ref => ref.where('role', '==',"vendor")).valueChanges({idField: 'id'});
  }

  deleteUser(id){
    return this.firestore.collection('users').doc(id).delete();
  }


  getOne(email){
    //return this.firestore.collection('users').doc(email).get();
    return this.firestore.collection('users').doc(email).valueChanges({idField: 'id'});
  }

  //Change listing status
  updateListing(email, listed:boolean){
    return this.firestore.collection('users').doc(email).update({listed: listed});
  }

  //Change canteenID inside vendor users
  updateCanteen(email, canteen){
    return this.firestore.collection('users').doc(email).update({canteenID: canteen});
  }

  //Change stallname insdie vendor users
  updateStallName(email, stallname){
    return this.firestore.collection('users').doc(email).update({stallname: stallname});
  }

  updateStamp(email, stamp: number){
    console.log(stamp);
    return this.firestore.collection('users').doc(email).update({stampLeft: stamp})
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

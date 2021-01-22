import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';
import { AngularFireStorage } from '@angular/fire/storage';

export interface User{
  email: string,
}

//const ITEM_KEY = 'my-user'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: any;

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  addSponsor(email, role){
    // console.log(email + role);
    return  this.firestore.collection('users').doc(email).set({role: role, listed: true});

  }

   async addVendor(email, canteenid, stallname, role, image, filename){

    var storageURL = 'Stall Images/';
    var mergedName = filename + email + canteenid + stallname;

    var storageRef = await this.storage.ref(storageURL).child(mergedName).put(image);
    //console.log(storageRef);
    var downloadURL = await this.storage.ref('Stall Images/' + mergedName).getDownloadURL().toPromise();
    //console.log(email + role);
      return  this.firestore.collection('users').doc(email).set({role: role, canteenID: canteenid, stallname: stallname, listed: true, stallimage: downloadURL, mergedName: mergedName});
  }

  async updateStallImg(email, image, filename, mergedName1, canteenid, stallname){
    this.storage.ref('Stall Images/' + mergedName1).delete(); //Delete previous food image
    
    var storageURL = 'Stall Images/';
    var mergedName = filename + email + canteenid + stallname;

    var storageRef = await this.storage.ref(storageURL).child(mergedName).put(image);
    var downloadURL = await this.storage.ref('Stall Images/' + mergedName).getDownloadURL().toPromise();
    return this.firestore.collection('users').doc(email).update({stallimage: downloadURL, mergedName: mergedName})
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

  getVendorBasedOnCanteen(canteen){
    return this.firestore.collection('users', ref => ref.where('role' , '==', 'vendor').where('canteenID', '==', canteen)).valueChanges({idField: 'id'});
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

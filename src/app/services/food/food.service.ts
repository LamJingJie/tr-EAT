import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import firebase from 'firebase';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  food: Subscription;

  test1: Subscription;
  test2: Subscription;
  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, private toast: ToastController) { }


  //Get Respective Food for vendors
  getRespectiveFood(acc){
    //console.log(acc);
    return this.firestore.collection('food', ref => ref.where('userid', '==', acc)).valueChanges({idField: 'id'});
  }

  //Get 1 Food
  getFoodById(id){
    return this.firestore.collection('food').doc(id).valueChanges({idField: 'id'});
  }

  getFoodBasedOnStall(vendor){
    return this.firestore.collection('food', ref => ref.where('userid', '==', vendor)).valueChanges({idField: 'id'});
  }

  //When user wants to filter
  getFoodBasedOnStallNFilter(vendor, filter){
    //console.log(vendor);
   // console.log(filter);
    if(filter === 'all'){
      return this.getFoodBasedOnStall(vendor);
    }else{
      return this.firestore.collection('food', ref => ref.where('userid', '==', vendor).where(filter,'==',true)).valueChanges({idField:'id'});
    }
  }

  async addFood(foodname, foodprice:number, halal: boolean, userid, vegetarian:boolean, image, filename){
    //console.log(image);
    var storageURL = 'Food Images/';
    var mergedName = filename + userid + foodname + foodprice;

    var storageRef = await this.storage.ref(storageURL).child(mergedName).put(image);
    //console.log(storageRef);
    var downloadURL = await this.storage.ref('Food Images/' + mergedName).getDownloadURL().toPromise();
    //console.log(downloadURL); 
    
    return this.firestore.collection('food').add({availquantity: 0, foodname: foodname, foodprice: foodprice, halal: halal, 
    userid: userid, vegetarian: vegetarian, image: downloadURL, mergedName: mergedName});
  }

  deleteFood(id, mergedName){
    this.storage.ref('Food Images/' + mergedName).delete(); //Delete previous food image
    return this.firestore.collection('food').doc(id).delete();
  }

  //Delete food respective to the vendor
  deleteFoodVendorEmail(email){
    //console.log(email);
    return this.food =  this.firestore.collection('food', ref => ref.where('userid','==',email)).get().subscribe(res=>{
     
      res.forEach(doc=>{
        var mergedName = doc.get('mergedName')
        //console.log(mergedName);
        this.storage.ref('Food Images/' + mergedName).delete(); //Delete previous food image
        doc.ref.delete();
        
      })
      this.food.unsubscribe();
    });
  }

  //When admin didn't select any images to update/edit
  editFoodNoImg(foodname, foodprice:number, availquantity:number, halal:boolean, vegetarian:boolean, userid, id){
    
    return this.firestore.collection('food').doc(id).update({availquantity:availquantity, foodname: foodname, foodprice:foodprice,
      halal: halal, userid:userid, vegetarian: vegetarian})
  }

  //When admin has select an image to update/edit
  async editFoodWithImg(foodname, foodprice: number, availquantity: number, halal:boolean, vegetarian:boolean, userid, id, image, filename, mergedName1){
    this.storage.ref('Food Images/' + mergedName1).delete(); //Delete previous food image
    
    var storageURL = 'Food Images/';
    var mergedName = filename + userid + foodname + foodprice;

    var storageRef = await this.storage.ref(storageURL).child(mergedName).put(image);
    var downloadURL = await this.storage.ref('Food Images/' + mergedName).getDownloadURL().toPromise();

    return this.firestore.collection('food').doc(id).update({availquantity: availquantity, foodname: foodname, foodprice: foodprice,
    halal: halal, userid: userid, vegetarian: vegetarian, image: downloadURL, mergedName: mergedName})
  }

  decreaseAvailQuantity(id, quantity: number){
    return this.firestore.collection('food').doc(id).update({availquantity: quantity});

  }

  

}

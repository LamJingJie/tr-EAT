import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController } from '@ionic/angular';
import firebase from 'firebase';
import { Subscription } from 'rxjs';
import { OrderService } from 'src/app/services/order/order.service';
import { HistoryService } from 'src/app/services/history/history.service';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  food: Subscription;

  test1: Subscription;
  test2: Subscription;

  
  deleteAllFavSub: Subscription;
  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, private toast: ToastController,
    private orderService: OrderService, private historyService: HistoryService) { }


  //Get Respective Food for vendors
  getRespectiveFood(acc) {
    //console.log(acc);
    return this.firestore.collection('food', ref => ref.where('userid', '==', acc)).valueChanges({ idField: 'id' });
  }

  //Get 1 Food
  getFoodById(id) {

    return this.firestore.collection('food').doc(id).valueChanges({ idField: 'id' });
  }

  getAllFood() {
    return this.firestore.collection('food', ref=> ref.orderBy("foodname", 'asc')).valueChanges({ idField: 'id' });
  }




  getFoodBasedOnStall(vendor) {
    return this.firestore.collection('food', ref => ref.where('userid', '==', vendor)).valueChanges({ idField: 'id' });
  }

  //When user wants to filter
  getFoodBasedOnStallNFilter(vendor, filter) {
    //console.log(vendor);
    // console.log(filter);
    if (filter === 'all') {
      return this.getFoodBasedOnStall(vendor);
    } else {
      return this.firestore.collection('food', ref => ref.where('userid', '==', vendor).where(filter, '==', true)).valueChanges({ idField: 'id' });
    }
  }

  //CHANGES MADE
  //To filter food based on cuisine types
  getFoodBasedOnCuisineNFilter(cuisinename, filter) {
    if (cuisinename === 'all') {
      //Check if user chose to show all vegetarian and halal
     if(filter === 'all'){
       return this.firestore.collection('food').valueChanges({ idField: 'id' });
     }else{
       return this.firestore.collection('food', ref => ref.where(filter, '==', true)).valueChanges({ idField: 'id' });
     }
   } else {
     //Check if user chose to show all vegetarian and halal
     if(filter === 'all'){
       return this.firestore.collection('food', ref => ref.where('cuisinename', "array-contains", cuisinename)).valueChanges({ idField: 'id' });
     }else{
       return this.firestore.collection('food', ref => ref.where('cuisinename', "array-contains", cuisinename).where(filter, '==', true)).valueChanges({ idField: 'id' });
     }
    
   }
  }

  //This function adds food in favourite collection
  async addFoodbyFavourites(foodid, userid) {
    return this.firestore.collection('favourites').add({ foodid: foodid, userid: userid });
  }

  getFoodbyfavourites(userid) {
    return this.firestore.collection("favourites").doc(userid).collection("data").valueChanges();

  }

  deleteFoodbyfavourites(foodid, userid) {
    return this.firestore.collection('favourites').doc(userid).collection("data").doc(foodid).delete();
  }

  deleteAllFavFromUser(userid){
    return new Promise((resolve, reject) =>{
      this.deleteAllFavSub = this.firestore.collection('favourites').doc(userid).collection('data').get().subscribe((async res=>{
        res.forEach((doc=>{
          doc.ref.delete(); //Delete every data in the sub-collection in the document
        }))
        await this.firestore.collection('favourites').doc(userid).delete();//Then delete the parent document
        resolve(null);
        this.deleteAllFavSub.unsubscribe();
      }));
    })
  }
  //CHANGES END

  //Get food that has availquantity in it to be shown for students to redeem
  getRedeemableFoodNFilter(vendor, filter) {
    //console.log(filter)
    if (filter === 'all') {
     
      return this.firestore.collection('food', ref => ref.where('userid', '==', vendor).where('availquantity', '>', 0)).valueChanges({ idField: 'id' });
    } else {
      return this.firestore.collection('food', ref => ref.where('userid', '==', vendor).where(filter, '==', true).where('availquantity', '>', 0)).valueChanges({ idField: 'id' });
    }
  }

  //for filtering by cuisine
  getRedeemableFoodNFilter2(cuisinename, filter) {
    //console.log("Redeem" + filter)
    //console.log("cuisinename" + cuisinename)
    if (cuisinename === 'all') {
       //Check if user chose to show all vegetarian and halal
      if(filter === 'all'){
        return this.firestore.collection('food', ref => ref.where('availquantity', '>', 0)).valueChanges({ idField: 'id' });
      }else{
        return this.firestore.collection('food', ref => ref.where(filter, '==', true).where('availquantity', '>', 0)).valueChanges({ idField: 'id' });
      }
    } else {
      //Check if user chose to show all vegetarian and halal
      if(filter === 'all'){
        return this.firestore.collection('food', ref => ref.where('cuisinename', "array-contains", cuisinename).where('availquantity', '>', 0)).valueChanges({ idField: 'id' });
      }else{
        return this.firestore.collection('food', ref => ref.where('cuisinename', "array-contains", cuisinename).where(filter, '==', true).where('availquantity', '>', 0)).valueChanges({ idField: 'id' });
      }
     
    }
  }

  getRedeemableFood_ALL() {
    return this.firestore.collection('food', ref => ref.where('availquantity', '>', 0)).valueChanges({ idField: 'id' });
  }

  async addFood(foodname, foodprice: number, halal, userid, vegetarian, image, filename, cuisinename) {
    //console.log(image);
    var boolHalal = JSON.parse(halal)
    var boolVeg = JSON.parse(vegetarian)
    var storageURL = 'Food Images/';
    var mergedName = filename + userid + foodname + foodprice;

    var storageRef = await this.storage.ref(storageURL).child(mergedName).put(image);
    //console.log(storageRef);
    var downloadURL = await this.storage.ref('Food Images/' + mergedName).getDownloadURL().toPromise();
    //console.log(downloadURL); 

    return this.firestore.collection('food').add({
      availquantity: 0, foodname: foodname, foodprice: foodprice, halal: boolHalal,
      userid: userid, vegetarian: boolVeg, image: downloadURL, mergedName: mergedName, popularity: 0, cuisinename: cuisinename
    });
  }



  deleteFood(id, mergedName) {
    this.storage.ref('Food Images/' + mergedName).delete(); //Delete previous food image
    return this.firestore.collection('food').doc(id).delete();
  }

  //Delete food respective to the vendor
  deleteFoodVendorEmail(email) {
    //console.log(email);
    return new Promise((resolve, reject) => {
      this.food = this.firestore.collection('food', ref => ref.where('userid', '==', email)).get().subscribe(res => {

        res.forEach(doc => {
          try {
            var mergedName = doc.get('mergedName')
            //console.log(mergedName);
            this.storage.ref('Food Images/' + mergedName).delete(); //Delete previous food image
            doc.ref.delete();
          } catch (error) {
            //If there's any error in deleting, exit and return error message
            reject(error);
          }
        })
        resolve("Success");
        this.food.unsubscribe();
      });
    })
  }

  //When admin didn't select any images to update/edit
  editFoodNoImg(foodname, foodprice: number, availquantity: number, halal, vegetarian, userid, id, cuisinename) {
    var boolHalal = JSON.parse(halal)
    var boolVeg = JSON.parse(vegetarian)
    //console.log(halal)
   // console.log(boolHalal);

    return this.firestore.collection('food').doc(id).update({
      availquantity: availquantity, foodname: foodname, foodprice: foodprice,
      halal: boolHalal, userid: userid, vegetarian: boolVeg, cuisinename: cuisinename
    })
  }

  //When admin has select an image to update/edit
  async editFoodWithImg(foodname, foodprice: number, availquantity: number, halal, vegetarian, userid, id, image, filename, mergedName1, cuisinename) {
    var boolHalal = JSON.parse(halal)
    var boolVeg = JSON.parse(vegetarian)
    this.storage.ref('Food Images/' + mergedName1).delete(); //Delete previous food image

    var storageURL = 'Food Images/';
    var mergedName = filename + userid + foodname + foodprice;

    var storageRef = await this.storage.ref(storageURL).child(mergedName).put(image);
    var downloadURL = await this.storage.ref('Food Images/' + mergedName).getDownloadURL().toPromise();


    return this.firestore.collection('food').doc(id).update({
      availquantity: availquantity, foodname: foodname, foodprice: foodprice,
      halal: boolHalal, userid: userid, vegetarian: boolVeg, image: downloadURL, mergedName: mergedName, cuisinename: cuisinename
    })




  }

  //When student redeem any food
  decreaseAvailQuantity(id, quantity: number) {
    return this.firestore.collection('food').doc(id).update({ availquantity: quantity });
  }

  //When sponsor pay
  updateAvailQuantity(id, quantity: number) {
    return this.firestore.collection('food').doc(id).update({ availquantity: quantity })
  }

  //When student redeem food
  updatePopularity(id, popularity: number) {
    return this.firestore.collection('food').doc(id).update({ popularity: popularity })
  }



}

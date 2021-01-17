import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { auth } from 'firebase/app';
import * as firebase from 'firebase';
import 'firebase/auth';
import {  UserService, User } from '../user/user.service'
import { Storage } from '@ionic/storage';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { rejects } from 'assert';
import { Subscription } from 'rxjs';
import {  FoodService } from '../food/food.service'
import { CartService } from '../cart/cart.service'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: any;
  
  email: string;
  user_exists: string;
  userListed: Subscription;
  deleteAccount: boolean = false;
 // user: User[] = []
//  users: User[] = [];
 // newUser: User = <User>{}

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private navCtrl: NavController,
    private storage: Storage,
    private loading: LoadingController,
    private toast: ToastController,
    private userService: UserService,
    private foodService: FoodService,
    private cartService: CartService
  ) {
 
   }



    SignIn(email, password,role,listed){


    return new Promise(async (resolve, reject)=>{
      await this.storage.set('role',role); 
      await this.storage.set('email',email);
      await this.ngFireAuth.signInWithEmailAndPassword(email, password).then(async res =>{
        //Retrieve "listing" field data and set it in storage
       
        // ****************************UNCOMMENT THIS DURING PRODUCTION***************************** //
        if((await this.ngFireAuth.currentUser).emailVerified == true){
          if(listed === true){
            console.log("Successfully login!");
            resolve(res);
          }else{
            this.notlisted();
            console.log("Unlisted");
            await this.storage.remove('role');
            await this.storage.remove('email');  
            resolve(res);
          }  
         
        }else{
          this.SendVerificationMail();
          this.emailNotVerified();
          await this.storage.remove('role');
          await this.storage.remove('email');
          console.log("Email Not Yet Verified");    
          resolve(res);
        }
        // ****************************UNCOMMENT THIS DURING PRODUCTION***************************** //


        // ****************************UNCOMMENT THIS DURING TESTING/DEVELOPMENT***************************** //
        //await this.storage.set('role',role);
        //await this.storage.set('email',email);
        // resolve(res);
     
        //console.log("Successfully login!");
        // ****************************UNCOMMENT THIS DURING TESTING/DEVELOPMENT***************************** //
        
      }).catch(async (error)=>{
        reject(error)
        await this.storage.remove('role');
        await this.storage.remove('email');
        console.log("Error: " + error.message);
      }); 
    })
   }

   async emailNotVerified(){
    const toast = await this.toast.create({message: "Email Not Verified. Verification has been sent again. Do check your indox or spam folders", position: 'bottom', duration: 5000,buttons: [ { text: 'ok', handler: () => { console.log('cancel')} } ]});
    toast.present();
  }

  async notlisted(){
    const toast = await this.toast.create({message: "Account has been unlisted", position: 'bottom', duration: 5000,buttons: [ { text: 'ok' } ]});
    toast.present();
  }

  

   //For Sponsor Accounts Only!
   async SignUp(email, password,role){
 
     //In this case, if the promise is not fulfilled (signup) then they would have failed the promise, thus having the
    //reject() being called.
    return new Promise((resolve, reject)=>{
      this.ngFireAuth.createUserWithEmailAndPassword(email, password).then(async res =>{
        console.log((await this.ngFireAuth.currentUser).email);
       
       // ****************************UNCOMMENT THIS DURING PRODUCTION***************************** //
        await this.SendVerificationMail();
        this.userService.addSponsor(email, role);
        resolve(res);
        
        
        console.log("Successfully Sign Up!");
        // ****************************UNCOMMENT THIS DURING PRODUCTION***************************** //
       
 

        // ****************************UNCOMMENT THIS DURING TESTING/DEVELOPMENT***************************** //
        //await this.userService.addSponsor(email, role);
        //Use storage because ngFireAuth doesn't store role, only store email, providerID, uid, etc and not where I can just set
        //a custom parameter inside it and so to store the role of current user, i just use storage.
        // await this.storage.set('role',role);
        //await this.storage.set('email',email);
        //console.log("Successfully Sign Up!");
        //resolve(res);
        // ****************************UNCOMMENT THIS DURING TESTING/DEVELOPMENT***************************** //

        
      }).catch((error)=>{
        reject(error)

        console.log("Error: " + error.message);
      })
     
    })
   }

   //For Vendor Accounts Only!
   async SignUpVendor(email, password, canteenID, stallname, role){


    return new Promise((resolve, reject) =>{
      this.ngFireAuth.createUserWithEmailAndPassword(email, password).then(async res =>{
        
        await this.SendVerificationMail();
        this.userService.addVendor(email, canteenID, stallname, role);
        resolve(res);
       
      }).catch(async (error)=>{
        reject(error)

        console.log("Error: " + error.message);
      })
    })
   }

    //For Student Accounts Only!
    async SignUpStudent(email, password, stamp, role){
  

      return new Promise((resolve, reject) =>{
        this.ngFireAuth.createUserWithEmailAndPassword(email, password).then(async res =>{
          
          await this.SendVerificationMail();
          this.userService.addStudent(email, stamp, role);
          resolve(res);
         
        }).catch(async (error)=>{
          reject(error)

          console.log("Error: " + error.message);
        })
      })
     }

     //Send Email Verification
     async SendVerificationMail() {
     // console.log(this.ngFireAuth.currentUser);
      return this.ngFireAuth.currentUser
      .then((u) => {
        //console.log(u)
        u.sendEmailVerification();
      })
    }
    

     async checkAuth(){
     this.ngFireAuth.onAuthStateChanged(async e =>{
      //console.log((await this.ngFireAuth.currentUser).emailVerified);
      await this.presentLoading();
 
       if(e){
        // ****************************UNCOMMENT THIS DURING PRODUCTION***************************** //
        ///Prevent error with "this.loading.dismiss()"
        //This acts as a sort of buffer during login, gives time for the system to add the values into the storage
        if((await this.ngFireAuth.currentUser).emailVerified === true){
          
            this.userListed = await this.userService.getOne((await this.ngFireAuth.currentUser).email).subscribe(async res =>{
              //console.log(res['listed']);
              if(res['listed'] === true){
                await this.router.navigateByUrl("tabs");
                console.log("Logged In")
                this.loading.dismiss(null, null, 'presentLoad');
              }else{
                 //Check if admin delete account that is verified
                await this.storage.get('email').then(async res =>{
                if(res === null){
                  console.log("You have been unlisted by the admin");
                  await this.SignOut();
                  this.loading.dismiss(null, null, 'presentLoad');
                }else{
                  await this.storage.get('deleteAcc').then(async res=>{
                    if(res===null){
                      console.log("You have been unlisted by the admin");
                      await this.SignOut();
                      this.loading.dismiss(null, null, 'presentLoad');
                    }else{
                      await this.router.navigateByUrl("tabs");
                      console.log("Admin deleted verified account")
                      this.loading.dismiss(null, null, 'presentLoad');
                    }
                  })
                }
              })
              }
              this.userListed.unsubscribe();
            })
             
                
                
        }else{
    
          //For admin users, prevent them from accessing login and signup pages after adding new accounts
          await this.storage.get('email').then(async res =>{
          //console.log(res);
          if(res === null){
            console.log("Admin nvr add new accounts")
            await this.SignOut();
            
            this.loading.dismiss(null, null, 'presentLoad');
          }else{
            console.log("Admin added new accounts")
            await this.router.navigateByUrl("tabs");
            //await this.navCtrl.navigateRoot("tabs");
            this.loading.dismiss(null, null, 'presentLoad');
          }
          });
        }
        


      }else{

        //Used this instead of "navigateRoot" because for reasons unknown if its navigateRoot to its own page, 
        //on the following page after that, its back btn will be disabled (^.^) and it gets buggy. Basically a mess and
        //Im not willing to spent another 5hrs of my life debugging

        //For admin users, prevent them from being logged out after deleting accounts
        await this.storage.get('email').then(async res =>{
          if(res === null){
            this.router.navigateByUrl("login");
            //await this.navCtrl.navigateRoot("login");
            console.log("Logged Out");  
            this.loading.dismiss(null, null, 'presentLoad');
          }else{
            await this.storage.get('deleteAcc').then(async res=>{
              if(res === null){
                this.router.navigateByUrl("login");
                //await this.navCtrl.navigateRoot("login");
                console.log("Logged Out");  
                this.loading.dismiss(null, null, 'presentLoad');
              }else{
                await this.router.navigateByUrl("tabs");
                //await this.navCtrl.navigateRoot("tabs");
                console.log("Admin deleted accounts")
                this.loading.dismiss(null, null, 'presentLoad');
              }
            })  
          }
        })
       
      }
    });
   }

   async presentLoading(){
     const loading = await this.loading.create({
       cssClass: 'my-custom-class',
       id: 'presentLoad'
     });
     await loading.present();

   }

   async presentLoading2(){
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      id: 'presentLoad2'
    });
    await loading.present();

  }

   //Sign Out and remove from localStorage
    async SignOut(){
      await this.presentLoading2();
      console.log("Sign out")
      await this.storage.remove('role');
      await this.storage.remove('email');

      //Since when admin delete an account, the ngFireAuth will think that we have already logged out. Since the 
      //ngFireAuth.delete() also causes a signout(). So this basically just checks if the admin has deleted any account
      //and if so, determine how to "logout" because the standard signout() won't work since its alrdy "signed out" technically
      this.storage.get('deleteAcc').then(async res =>{
        //console.log(res);
        if(res === null){
          
          console.log("Normal users will get this")
        
          this.ngFireAuth.signOut();
          this.loading.dismiss(null, null, 'presentLoad2');
        }else{
         
          //Admin/user did delete account
          console.log("Admin deleted account and want to log out")
          this.router.navigateByUrl("login");
          await this.storage.remove('deleteAcc');
          this.loading.dismiss(null, null, 'presentLoad2');
        }
      }).catch(err=>{
        console.log(err);
        this.loading.dismiss(null, null, 'presentLoad2');
      })
     
   }


   //Delete user accounts for admin users only
   async deleteUserAdmin(email, password,role){ 
      await this.storage.set('deleteAcc',true);

      return new Promise((resolve, reject) =>{
        this.ngFireAuth.signInWithEmailAndPassword(email, password).then(async res =>{
       
          //Delete account from firebase auth
          (await this.ngFireAuth.currentUser).delete();

          //Delete account from firebase cloud database
          this.userService.deleteUser(email);
         
          if(role === "vendor"){   
            try {
              this.foodService.deleteFoodVendorEmail(email);
             
            } catch (error) {
              console.log(error);
            }
            
          }
          if(role === "student"){
          
           
          }
          if(role === "sponsor"){
  
            //Delete "history" collection (maybe)
  
            //Delete Cart
              this.cartService.deleteRespectiveCart(email).then(res =>{
                console.log(res);
              }).catch(err=>{
                console.log(err);
              })
           
          }
        
          resolve(res);
  
         }).catch(err=>{
           this.storage.remove('deleteAcc');
           console.log(err);
           reject(err);
         }) 
     })
    }

}

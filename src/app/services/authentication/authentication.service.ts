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

  checkAdmin: boolean = false;
  checkAdmin2: boolean = false;


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
        await this.SendVerificationMail();
        console.log((await this.ngFireAuth.currentUser).email);
       
       // ****************************UNCOMMENT THIS DURING PRODUCTION***************************** //
        
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
   async SignUpVendor(email, password, canteenID, stallname, role, image, filename){

    await this.storage.set('adminusage',true);
    this.checkAdmin2 = true;
    return new Promise((resolve, reject) =>{
      this.ngFireAuth.createUserWithEmailAndPassword(email, password).then(async res =>{
        
        await this.SendVerificationMail();
        this.userService.addVendor(email, canteenID, stallname, role, image, filename);
        resolve(res);
       
      }).catch(async (error)=>{
        reject(error)
        await this.storage.remove('adminusage');
        console.log("Error: " + error.message);
      })
    })
   }

    //For Student Accounts Only!
    async SignUpStudent(email, password, stamp, role){
  
      await this.storage.set('adminusage',true);
      this.checkAdmin2 = true;
      return new Promise((resolve, reject) =>{
        this.ngFireAuth.createUserWithEmailAndPassword(email, password).then(async res =>{
          
          await this.SendVerificationMail();
          this.userService.addStudent(email, stamp, role);
          resolve(res);
         
        }).catch(async (error)=>{
          reject(error)
          await this.storage.remove('adminusage');
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

    //send password reset email
    resetPassword(email: string){
      return new Promise(async (resolve, reject)=>{
        this.ngFireAuth.sendPasswordResetEmail(email).then(()=>{
          console.log('password reset email has been send, please check your indox or spam folders')
          resolve('sent');
        }).catch((error)=>{
          console.log(error);
          reject(error);
        })
      })
  
    }
    

     async checkAuth(){
     this.ngFireAuth.onAuthStateChanged(async e =>{
      //console.log((await this.ngFireAuth.currentUser).emailVerified);

      await this.presentLoading();
     // console.log("Here");
      this.storage.get('adminusage').then(async res =>{
        //Check if admin user made any add or delete of other user accounts. Null if no.
        //console.log("admin: " + res);
        if(res === null){
          //No action made by admin
          if(e){

            if((await this.ngFireAuth.currentUser).emailVerified === true){
              
                this.userListed = await this.userService.getOne((await this.ngFireAuth.currentUser).email).subscribe(async res =>{
                  //console.log(res['listed']);
                  if(res['listed'] === true){
                    await this.navCtrl.navigateRoot("tabs");
                    //await this.router.navigateByUrl("tabs");
                    console.log("Logged In")
                    this.loading.dismiss(null, null, 'presentLoad');
                  }else{
                    console.log("You have been unlisted by the admin");
                    await this.SignOut();
                    this.loading.dismiss(null, null, 'presentLoad');
                  }
                  this.userListed.unsubscribe();
                })
        
            }else{
        
              console.log("Email Unverified")
              await this.SignOut();
                
              this.loading.dismiss(null, null, 'presentLoad');
            }

          }else{
           
            //
            //
            //Used 'navigateByUrl' rather than 'navigateRoot' compared to the others in this function
            //Reason: when user logs out, they will sign out as well and if 2 'navigateRoot' is runned,
            //it will cause the page clicked afterwards, which in this case will be the signup page.
            //it will result in the device back btn in the signup page to stop working.
            await this.storage.remove('role');
            await this.storage.remove('email');
            await this.storage.remove('adminusage');
            this.router.navigateByUrl("login");
            //await this.SignOut();
            console.log("Logged Out");  
            this.loading.dismiss(null, null, 'presentLoad');
           
          }
        }else{
            //Check for admin users to prevent going back to tabs unnecessaryily.
            if(this.checkAdmin === true){
              //When admin delete account 
              console.log("Admin present")     
              await this.loading.dismiss(null, null, 'presentLoad');
            }else{
              if(this.checkAdmin2 === true){
                //When admin adds vendors or students accounts
                console.log("Admin present2")     
                await this.loading.dismiss(null, null, 'presentLoad');
              }else{
                //To be run when app is booted up for admin users
                await this.loading.dismiss(null, null, 'presentLoad');
                await this.navCtrl.navigateRoot("tabs");
                //await this.router.navigateByUrl("tabs");
                console.log("Add, Delete user account!");
              }
            
            }
        
        }
      });
 
       
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
      //console.log("Sign out")
      await this.storage.remove('role');
      await this.storage.remove('email');
      await this.storage.remove('adminusage');

      //Since when admin delete an account, the ngFireAuth will think that we have already logged out. Since the 
      //ngFireAuth.delete() also causes a signout(). So this basically just checks if the admin has deleted any account
      //and if so, determine how to "logout" because the standard signout() won't work since its alrdy "signed out" technically
      /*this.storage.get('deleteAcc').then(async res =>{
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
      })*/
      console.log("Log out")
      //this.router.navigateByUrl("login");

      //alert('signout')
      this.ngFireAuth.signOut();
      this.navCtrl.navigateRoot("login");
      this.loading.dismiss(null, null, 'presentLoad2');
      
     
   }


   //Delete user accounts for admin users only
   async deleteUserAdmin(email, password,role){ 
      //await this.storage.set('deleteAcc',true);
      await this.storage.set('adminusage',true);

      this.checkAdmin = true;

      return new Promise((resolve, reject) =>{
        this.ngFireAuth.signInWithEmailAndPassword(email, password).then(async res =>{

          //Delete account from firebase auth
          (await this.ngFireAuth.currentUser).delete();

          //Delete account from firebase cloud database
          await this.userService.deleteUser(email);

          //Delete favourite
          await this.foodService.deleteAllFavFromUser(email).catch((error=>{
            console.log(error);
          }))
         
 
   
            this.foodService.deleteFoodVendorEmail(email).catch((error=>{
              console.log(error);
            }));
             
            //Delete stall image as well
            this.userService.deleteStallImg(email).catch((error=>{
              console.log(error);
            }));
          

 
  
            //Delete "history" collection (maybe)
  
            //Delete Cart
            this.cartService.deleteCart(email).then(res =>{
              console.log(res);
            }).catch(err=>{
              console.log(err);
            })
  
        
          resolve(res);
  
         }).catch(err=>{
           //this.storage.remove('deleteAcc');
           this.storage.remove('adminusage');
           console.log(err);
           reject(err);
         }) 
     })
    }

}

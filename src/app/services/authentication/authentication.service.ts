import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { auth } from 'firebase/app';
import * as firebase from 'firebase';
import 'firebase/auth';
import {  UserService } from '../user/user.service'
import { Storage } from '@ionic/storage';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: any;
  
  email: string;
  user_exists: string;
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
    private userService: UserService
  ) {
 
   }

    SignIn(email, password,role){


    return new Promise(async (resolve, reject)=>{
      await this.ngFireAuth.signInWithEmailAndPassword(email, password).then(async res =>{
      
       
        // ****************************UNCOMMENT THIS DURING PRODUCTION***************************** //
        if((await this.ngFireAuth.currentUser).emailVerified == true){
          await this.storage.set('role',role); 
          await this.storage.set('email',email);
         // await this.router.navigateByUrl("tabs");
         
          console.log("Successfully login!");
          resolve(res);
        }else{
         
          console.log("Email Not Yet Verified");
          this.emailNotVerified();
          resolve(res);
        }
        // ****************************UNCOMMENT THIS DURING PRODUCTION***************************** //


        // ****************************UNCOMMENT THIS DURING TESTING/DEVELOPMENT***************************** //
        //await this.storage.set('role',role);
        //await this.storage.set('email',email);
        
        //this.router.navigateByUrl("/tabs");
        //console.log("Successfully login!");
        // ****************************UNCOMMENT THIS DURING TESTING/DEVELOPMENT***************************** //
        
      }).catch(async (error)=>{
        reject(error)
        
        console.log("Error: " + error.message);
      });
   
    
    })
    
   }

   async emailNotVerified(){
    const toast = await this.toast.create({message: "Email Not Verified", position: 'bottom', duration: 5000,buttons: [ { text: 'Resend', handler: () => { this.SendVerificationMail();} } ]});
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
        //this.router.navigateByUrl("/tabs");
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
      console.log(this.ngFireAuth.currentUser);
      return this.ngFireAuth.currentUser
      .then((u) => {
        //console.log(u)
        u.sendEmailVerification();
      })
    }
    

     async checkAuth(){
       
     this.ngFireAuth.onAuthStateChanged(async e =>{
      // console.log((await this.ngFireAuth.currentUser).email);
      //console.log((await this.ngFireAuth.currentUser).emailVerified);
      await this.presentLoading();
       if(e){
        
        // ****************************UNCOMMENT THIS DURING PRODUCTION***************************** //
        ///Prevent error with "this.loading.dismiss()"
        //This acts as a sort of buffer during login, gives time for the system to add the values into the storage
        if((await this.ngFireAuth.currentUser).emailVerified == true){
           //await this.presentLoading();
          // await this.navCtrl.navigateRoot('tabs');
           await this.router.navigateByUrl("tabs");
            console.log("Logged In");
           
             
        }else{
          //For admin users, prevent them from accessing login and signup pages after adding new accounts
          await this.storage.get('email').then(async res =>{
          //console.log(res);
          if(res == null){
            await this.SignOut();
          
          }else{
            console.log("Not Empty");
          
            await this.router.navigateByUrl("tabs");
          }
          });
        }
        
        // ****************************UNCOMMENT THIS DURING PRODUCTION***************************** //

       
        // ****************************UNCOMMENT THIS DURING TESTING/DEVELOPMENT***************************** //
        //await this.navCtrl.navigateRoot('/tabs');
       // ****************************UNCOMMENT THIS DURING TESTING/DEVELOPMENT***************************** //


      }else{
        //Used this instead of "navigateRoot" because for reasons unknown if its navigateRoot to its own page, 
        //on the following page after that, its back btn will be disabled (^.^) and it gets buggy. Basically a mess and
        //Im not willing to spent another 5hrs of my life debugging
        this.router.navigateByUrl("login");
        console.log("Logged Out");  
      }
    });
   }

   async presentLoading(){
     const loading = await this.loading.create({
       cssClass: 'my-custom-class',
       duration: 300
     });
     await loading.present();

     //await loading.onDidDismiss(); //Automatically close when duration is up, other dismiss doesnt do it

     console.log("Loading Dismiss!");
   }



   
   //Sign Out and remove from localStorage
    SignOut(){
      console.log("Sign out")
     return this.ngFireAuth.signOut().then(async ()=>{
       //localStorage.removeItem(this.role);
       //localStorage.removeItem(this.email);
       //this.userService.deleteUser();
        await this.storage.remove('role');
        await this.storage.remove('email');
       
     })
   }


}

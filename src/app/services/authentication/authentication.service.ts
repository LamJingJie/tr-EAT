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
    private userService: UserService
  ) {
 
   }

    SignIn(email, password,role){
     // console.log(this.email);
    // console.log(password);
    // console.log(role);
   /* return this.ngFireAuth.signInWithEmailAndPassword(this.email, password).then(res =>{
      //console.log(res);
        this.storage.set('role', role);
        console.log("role done: " + this.storage.get('role'));
        this.storage.set('email', email);
        console.log("email done: " + this.storage.get('email'));
        this.router.navigateByUrl("/tabs");
        console.log("navigate done" + this.router.url);
    });*/

    //In this case, if the promise is not fulfilled (signin) then they would have failed the promise, thus having the
    //reject() being called.
    return new Promise((resolve, reject)=>{
      this.ngFireAuth.signInWithEmailAndPassword(email, password).then(async res =>{
        resolve(res);

        //Use storage because ngFireAuth doesn't store role, only store email, providerID, uid, etc and not where I can just set
        //a custom parameter inside it and so to store the role of current user, i just use storage.
        await this.storage.set('role',role);
        await this.storage.set('email',email);
        
        this.router.navigateByUrl("/tabs");
        console.log("Successfully login!");
      }).catch((error)=>{
        reject(error)
        console.log("Error: " + error.message);
      })
     
    })
 
   }
   SignUp(email, password,role){
     //In this case, if the promise is not fulfilled (signup) then they would have failed the promise, thus having the
    //reject() being called.
    return new Promise((resolve, reject)=>{
      this.ngFireAuth.createUserWithEmailAndPassword(email, password).then(async res =>{
        resolve(res);

        //Use storage because ngFireAuth doesn't store role, only store email, providerID, uid, etc and not where I can just set
        //a custom parameter inside it and so to store the role of current user, i just use storage.
        await this.storage.set('role',role);
        await this.storage.set('email',email);
        console.log("Successfully Sign Up!");
        this.router.navigateByUrl("/tabs");
      }).catch((error)=>{
        reject(error)
        console.log("Error: " + error.message);
      })
     
    })
   }

   //Returns true when user is logged in
   /*get isLoggedIn(): boolean{
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !==null && user.emailVerified !==false) ? true : false
   }*/



     checkAuth(){
     this.ngFireAuth.onAuthStateChanged(async e =>{
      
      
       if(e){
        //console.log(e.email);

       // this.userService.getOne(e.email).subscribe((data) =>{
        //  console.log(data['role']);
       //   this.role = data['role'];
       //   this.email = e.email;

         // localStorage.setItem(data['role'], null);
        //  localStorage.setItem(e.email, null);

         
      //  });

      //Wait till this function has completely finish before moving on.
      //Prevent error with "this.loading.dismiss()"
      //This acts as a sort of buffer during login, gives time for the system to add the values into the storage
      await this.presentLoading();
       
        await this.navCtrl.navigateRoot('/tabs');
        console.log("Logged In");
       


      }else{
        await this.navCtrl.navigateRoot('/login');
        console.log("Logged Out");
        
      }
      
    });
   
   }

   async presentLoading(){
     //alert("Open Loading");
     const loading = await this.loading.create({
       cssClass: 'my-custom-class',
       duration: 200
     });
     await loading.present();

     await loading.onDidDismiss(); //Automatically close when duration is up, other dismiss doesnt do it

     console.log("Loading Dismiss!");
   }

   

   //Sign Out and remove from localStorage
    SignOut(){
     //alert(this.email + " + " + this.role);
     return this.ngFireAuth.signOut().then(async ()=>{
       //localStorage.removeItem(this.role);
       //localStorage.removeItem(this.email);
       //this.userService.deleteUser();
        await this.storage.remove('role');
        await this.storage.remove('email');
       this.navCtrl.navigateRoot('/login');
     })
     
   }

}

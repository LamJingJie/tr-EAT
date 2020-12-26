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

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: any;
  
  email: string;
  user: User[] = []
  users: User[] = [];
  newUser: User = <User>{}

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
     this.email = email;
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
      this.ngFireAuth.signInWithEmailAndPassword(this.email, password).then(async res =>{
        resolve(res);

        //Finish adding role and email into storage before moving on
        await this.storage.set('role',role);
        await this.storage.set('email',email);
        console.log("Successfully login!");
        this.router.navigateByUrl("/tabs");
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
   get isLoggedIn(): boolean{
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !==null && user.emailVerified !==false) ? true : false
   }

   //Store user data in local storage
   setUserData(email, role){

   //  localStorage.setItem(role, role);
  //   localStorage.setItem(email, email);
  //   this.role = role;
  //   this.email = email;
   //  console.log("setuserdata: " + localStorage.getItem('sponsor'));

    const data = {email: email, role: role};
    //alert("test: " + noti[0]);
    this.newUser = data;
    this.userService.addUser(this.newUser).then(item => {
    this.newUser = <User>{}
    console.log(item + ' insert');
 //   return item
    //this.router.navigateByUrl("/tabs");
    });

   }

    checkAuth(){

     this.ngFireAuth.onAuthStateChanged(async e =>{

      //Wait till this function has completely finish before moving on.
      //Prevent error with "this.loading.dismiss()"
      await this.presentLoading();
      if(e){
        //console.log(e.email);

       // this.userService.getOne(e.email).subscribe((data) =>{
        //  console.log(data['role']);
       //   this.role = data['role'];
       //   this.email = e.email;

         // localStorage.setItem(data['role'], null);
        //  localStorage.setItem(e.email, null);

         
      //  });
      this.navCtrl.navigateRoot('/tabs');
      console.log("Logged In");

      }else{
        this.navCtrl.navigateRoot('/login');
        console.log("Logged Out");
      }
      this.loading.dismiss();
      console.log("Loading Dismissed!");
    });
   
   }

   async presentLoading(){
     //alert("Open Loading");
     const loading = await this.loading.create({
       cssClass: 'my-custom-class',
     });
     await loading.present();

     console.log("Loading Present!");
   }

   

   //Sign Out and remove from localStorage
    SignOut(){
     //alert(this.email + " + " + this.role);
     return this.ngFireAuth.signOut().then(()=>{
       //localStorage.removeItem(this.role);
       //localStorage.removeItem(this.email);
       this.userService.deleteUser();
        this.storage.remove('role');
        this.storage.remove('email');
       this.navCtrl.navigateRoot('/login');
     })
     
   }

}

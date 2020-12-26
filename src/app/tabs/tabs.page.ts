import { Component } from '@angular/core';
import { TimeoutError } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService, User } from '../services/user/user.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  currentRole: any;
  users: User[] = [];

  constructor( private authService: AuthenticationService, private userService: UserService, private storage: Storage,) {

    
   
    
  }
  ngOnInit(){
   
  }
 
  ionViewWillEnter(){
    this.storage.get('role').then(res =>{
      this.currentRole = res;
      console.log("Role tabs: " + this.currentRole);
      //If fail to retrieve properly, rerun the code again
      
     });
  }


}
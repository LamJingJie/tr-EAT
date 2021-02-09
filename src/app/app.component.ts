import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Platform, LoadingController, NavController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Storage } from '@ionic/storage';
import { UserService } from 'src/app/services/user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  //users: User[] = [];
  currentRole: any;
  sponsorSubscription: Subscription;
  verify_count: number;
 

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private navCtrl: NavController,
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    private userService: UserService,
    private authService: AuthenticationService,
    private localNotifications: LocalNotifications,
    private storage: Storage
  ) {
  
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

        //Will check if user is authorized
        this.authService.checkAuth();
 
    });

    }





}

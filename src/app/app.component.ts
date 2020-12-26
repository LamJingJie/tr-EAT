import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Platform, LoadingController, NavController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UserService, User } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  users: User[] = [];
  currentRole: any;

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
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

          //Will check if user is authorized
          this.authService.checkAuth();
      
      
    });

    }

}

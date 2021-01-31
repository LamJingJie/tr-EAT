import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { Observable, Subscription } from 'rxjs';
import { CanteenService } from 'src/app/services/canteen/canteen.service';

@Pipe({
  name: 'ordermonthlyCanteen'
})
export class OrdermonthlyCanteenPipe implements PipeTransform {
  //vendor_name: any;
userSubscription: Subscription;
vendorSubscription: Subscription;
canteenSUb: Subscription;
//vendor_stallname: any;
vendor_canteen: any;
//vendor_both: any;
count: number;
index: any;
  constructor(private userService: UserService, private canteenService: CanteenService){}

  transform(index: any, data: any): any {
    
    return new Promise((resolve) =>{
      this.index = data[index];
      //console.log(this.index);
        this.userSubscription = this.userService.getOne(this.index).subscribe((res=>{
        //console.log(res['canteenID']);
        this.canteenSUb = this.canteenService.getCanteenbyid(res['canteenID']).subscribe((canteenres=>{

          this.vendor_canteen = canteenres['canteenname'];
          resolve(this.vendor_canteen);
          this.canteenSUb.unsubscribe();
        }))
        
        //console.log(this.vendor_canteen);
       
  
        this.userSubscription.unsubscribe(); //Unsubscribe to prevent any issues that may arrise
      }))
    })
  }

}

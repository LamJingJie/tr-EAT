import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { Observable, Subscription } from 'rxjs';

@Pipe({
  name: 'adminOrderCanteen'
})
export class AdminOrderCanteenPipe implements PipeTransform {
//vendor_name: any;
userSubscription: Subscription;
vendorSubscription: Subscription;
//vendor_stallname: any;
vendor_canteen: any;
//vendor_both: any;
count: number;
index: any;
  constructor(private userService: UserService){}

  transform(index: any, data: any): any {
    
    return new Promise((resolve) =>{
      this.index = data[index];
      //console.log(this.index);
        this.userSubscription = this.userService.getOne(this.index).subscribe((res=>{
        //console.log(res['canteenID']);
        this.vendor_canteen = res['canteenID'];
        //console.log(this.vendor_canteen);
        resolve(this.vendor_canteen);
  
        this.userSubscription.unsubscribe(); //Unsubscribe to prevent any issues that may arrise
      }))
    })
  }

}

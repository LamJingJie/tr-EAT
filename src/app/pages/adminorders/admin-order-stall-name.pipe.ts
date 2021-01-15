import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { Observable, Subscription } from 'rxjs';

@Pipe({
  name: 'adminOrderStallName'
})
export class AdminOrderStallNamePipe implements PipeTransform {
//vendor_name: any;
userSubscription: Subscription;
vendorSubscription: Subscription;
vendor_stallname: any;
//vendor_canteen: any;
//vendor_both: any;
count: number;
index: any;
  constructor(private userService: UserService){}

  transform(index: any, data: any): any {
    this.index = data[index];
    //console.log(this.index);
    return new Promise((resolve) =>{
        this.userSubscription = this.userService.getOne(this.index).subscribe((res=>{
        //console.log(res['canteenID']);
        this.vendor_stallname = res['stallname'];
        //console.log(this.vendor_stallname);
        resolve(this.vendor_stallname);
  
        this.userSubscription.unsubscribe(); //Unsubscribe to prevent any issues that may arrise
      }))
    })
  }

}

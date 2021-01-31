import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { Observable, Subscription } from 'rxjs';

@Pipe({
  name: 'ordermonthlyName'
})
export class OrdermonthlyNamePipe implements PipeTransform {
  //vendor_name: any;
userSubscription: Subscription;
vendorSubscription: Subscription;
//vendor_stallname: any;
//vendor_canteen: any;
//vendor_both: any;
count: number;
index: any;

transform(index: any, data: any): any {
    
  // console.log('In Pipe....');
  // console.log(index);
  // console.log(data[index]);
  // this.vendor_name = name
  return new Promise((resolve) =>{

    resolve(data[index]);
   })
 }

}

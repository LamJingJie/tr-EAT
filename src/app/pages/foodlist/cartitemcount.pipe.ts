import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { Observable, Subscription } from 'rxjs';

@Pipe({
  name: 'cartitemcount'

  
})
export class CartitemcountPipe implements PipeTransform {

  constructor(private userService: UserService){}

  transform(index: any,  val: any): any {
    return new Promise((resolve) =>{
      //console.log(index);
      
      //console.log(val);
      //console.log(val[index]);
      resolve(val[index]);
    });
  }

}

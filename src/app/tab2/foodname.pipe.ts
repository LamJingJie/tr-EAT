import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { FoodService } from 'src/app/services/food/food.service';
import { Observable, Subscription } from 'rxjs';

@Pipe({
  name: 'foodname'
})
export class FoodnamePipe implements PipeTransform {

  foodSubscription: Subscription;

  constructor(private userService: UserService, private foodService: FoodService){}

  transform(foodid: any): any {

    return new Promise((resolve) =>{
      this.foodSubscription = this.foodService.getFoodById(foodid).subscribe((res=>{
        //console.log(res['foodname']);
        resolve(res['foodname']);

        this.foodSubscription.unsubscribe();
      }))
    })
  }

}

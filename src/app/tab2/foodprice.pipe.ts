import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { FoodService } from 'src/app/services/food/food.service';
import { Observable, Subscription } from 'rxjs';

@Pipe({
  name: 'foodprice'
})
export class FoodpricePipe implements PipeTransform {
foodSub: Subscription;
  constructor(private userService: UserService, private foodService: FoodService){}

  transform(foodid: any, quantity: any): any {

    return new Promise((resolve) =>{
      //console.log(foodid);
      //console.log(quantity);
      this.foodSub = this.foodService.getFoodById(foodid).subscribe((res=>{
        var foodcost = res['foodprice'] * quantity;
        //console.log(foodcost);
        resolve(foodcost);

        this.foodSub.unsubscribe();
      }))

    })
  }

}

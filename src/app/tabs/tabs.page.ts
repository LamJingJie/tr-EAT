import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
selectHome: boolean=false;
selectFav: boolean=false;
selectOrd: boolean=false;
selectHis: boolean=false;
  constructor() {}

  select_home(){
    this.selectHome = true;
    console.log("test" + this.selectHome);
  }

}

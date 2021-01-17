import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FoodlistPage } from './foodlist.page';

describe('FoodlistPage', () => {
  let component: FoodlistPage;
  let fixture: ComponentFixture<FoodlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FoodlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

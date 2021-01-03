import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminfoodPage } from './adminfood.page';

describe('AdminfoodPage', () => {
  let component: AdminfoodPage;
  let fixture: ComponentFixture<AdminfoodPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminfoodPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminfoodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

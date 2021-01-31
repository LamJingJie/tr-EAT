import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminorderMonthlyPage } from './adminorder-monthly.page';

describe('AdminorderMonthlyPage', () => {
  let component: AdminorderMonthlyPage;
  let fixture: ComponentFixture<AdminorderMonthlyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminorderMonthlyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminorderMonthlyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

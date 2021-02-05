import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminVerifyPage } from './admin-verify.page';

describe('AdminVerifyPage', () => {
  let component: AdminVerifyPage;
  let fixture: ComponentFixture<AdminVerifyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminVerifyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminVerifyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

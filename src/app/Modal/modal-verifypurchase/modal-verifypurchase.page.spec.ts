import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalVerifypurchasePage } from './modal-verifypurchase.page';

describe('ModalVerifypurchasePage', () => {
  let component: ModalVerifypurchasePage;
  let fixture: ComponentFixture<ModalVerifypurchasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalVerifypurchasePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalVerifypurchasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

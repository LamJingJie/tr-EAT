import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalVerifychckoutPage } from './modal-verifychckout.page';

describe('ModalVerifychckoutPage', () => {
  let component: ModalVerifychckoutPage;
  let fixture: ComponentFixture<ModalVerifychckoutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalVerifychckoutPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalVerifychckoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

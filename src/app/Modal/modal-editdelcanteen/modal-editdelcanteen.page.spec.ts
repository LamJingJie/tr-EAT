import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalEditdelcanteenPage } from './modal-editdelcanteen.page';

describe('ModalEditdelcanteenPage', () => {
  let component: ModalEditdelcanteenPage;
  let fixture: ComponentFixture<ModalEditdelcanteenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditdelcanteenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalEditdelcanteenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

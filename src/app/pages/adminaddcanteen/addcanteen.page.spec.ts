import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddcanteenPage } from './addcanteen.page';

describe('ModalAddcanteenPage', () => {
  let component: AddcanteenPage;
  let fixture: ComponentFixture<AddcanteenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcanteenPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddcanteenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

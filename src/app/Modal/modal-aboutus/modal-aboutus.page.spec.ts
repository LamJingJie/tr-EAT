import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalAboutusPage } from './modal-aboutus.page';

describe('ModalAboutusPage', () => {
  let component: ModalAboutusPage;
  let fixture: ComponentFixture<ModalAboutusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAboutusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAboutusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewaccountPage } from './viewaccount.page';

describe('ViewaccountPage', () => {
  let component: ViewaccountPage;
  let fixture: ComponentFixture<ViewaccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewaccountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewaccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminordersPage } from './adminorders.page';

describe('AdminordersPage', () => {
  let component: AdminordersPage;
  let fixture: ComponentFixture<AdminordersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminordersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminordersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

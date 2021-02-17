import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CategoryfilterComponent } from './categoryfilter.component';

describe('CategoryfilterComponent', () => {
  let component: CategoryfilterComponent;
  let fixture: ComponentFixture<CategoryfilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryfilterComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

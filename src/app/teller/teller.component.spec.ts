import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {TellerIndexComponent} from './teller.index.component';

describe('TellerIndexComponent', () => {
  let component: TellerIndexComponent;
  let fixture: ComponentFixture<TellerIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TellerIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TellerIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

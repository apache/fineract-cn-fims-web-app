import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ReportingBetweenParamComponent} from './between.component';
import {Component, ViewChild} from '@angular/core';
import {MdInputModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
describe('Test between component', () => {

  let fixture: ComponentFixture<DateTestComponent>;

  let testComponent: DateTestComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        MdInputModule,
        NoopAnimationsModule
      ],
      declarations: [
        DateTestComponent,
        ReportingBetweenParamComponent
      ]
    });

    fixture = TestBed.createComponent(DateTestComponent);
    testComponent = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should return same value', () => {
    const value = '2017-01-01..2017-01-01';

    testComponent.formControl.setValue(value);

    fixture.detectChanges();

    expect(testComponent.formControl.value).toEqual(value);
  });

  it('should mark control as valid when valid range', () => {
    const start = '2017-01-01';
    const end = '2017-01-01';

    testComponent.formControl.setValue(`${start}..${end}`);

    fixture.detectChanges();

    expect(testComponent.formControl.valid).toBeTruthy();
  });

  it('should mark control as invalid when invalid range', () => {
    const start = '2017-01-02';
    const end = '2017-01-01';

    testComponent.formControl.setValue(`${start}..${end}`);

    fixture.detectChanges();

    expect(testComponent.formControl.invalid).toBeTruthy();
  });

});

@Component({
  template: '<fims-reporting-between-param #paramComponent [formControl]="formControl" [required]="true" type="DATE"></fims-reporting-between-param>'
})
class DateTestComponent {

  @ViewChild('paramComponent') paramComponent: ReportingBetweenParamComponent;

  formControl: FormControl = new FormControl();
}

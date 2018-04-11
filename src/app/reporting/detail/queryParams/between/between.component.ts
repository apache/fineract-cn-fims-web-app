/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import {Component, forwardRef, Input, OnDestroy, OnInit} from '@angular/core';
import {Type} from '../../../../services/reporting/domain/type.model';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import {AbstractControlValueAccessor} from '../abstract-value-accessor';
import {Observable} from 'rxjs/Observable';
import {FimsValidators} from '../../../../common/validator/validators';
import {Subscription} from 'rxjs/Subscription';
import {Operator} from '../../../../services/reporting/domain/query-parameter.model';
import {createPlaceholder} from '../query-params.helper';

export const REPORTING_BETWEEN_PARAM_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ReportingBetweenParamComponent),
  multi: true,
};

export const REPORTING_BETWEEN_PARAM_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => ReportingBetweenParamComponent),
  multi: true,
};

@Component({
  providers: [ REPORTING_BETWEEN_PARAM_CONTROL_VALUE_ACCESSOR, REPORTING_BETWEEN_PARAM_VALIDATOR ],
  selector: 'fims-reporting-between-param',
  templateUrl: './between.component.html'
})
export class ReportingBetweenParamComponent extends AbstractControlValueAccessor
  implements ControlValueAccessor, Validator, OnInit, OnDestroy {

  changeSubscription: Subscription;

  formGroup: FormGroup;

  @Input() label: string;

  @Input() required: boolean;

  @Input() type: Type;

  @Input() operator: Operator;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    const validator = this.type === 'DATE' ? FimsValidators.matchRange('start', 'end') : FimsValidators.greaterThan('start', 'end');

    this.formGroup = this.formBuilder.group({
      start: ['', this.required ? [Validators.required] : []],
      end: ['', this.required ? [Validators.required] : []]
    }, { validator });

    this.changeSubscription = Observable.combineLatest(
      this.formGroup.get('start').valueChanges,
      this.formGroup.get('end').valueChanges,
      (start, end) => ({
        start,
        end
      })
    ).filter(result => result.start && result.end)
     .subscribe(result => this.value = this.concatValue(result.start, result.end));
  }

  ngOnDestroy(): void {
    this.changeSubscription.unsubscribe();
  }

  writeValue(value: string): void {
    if (value) {
      this.formGroup.setValue(this.splitValue(value));
    } else {
      this.formGroup.setValue({
        start: null,
        end: null
      });
    }
  }

  private splitValue(value: string): any {
    const values: string[] = value.split('..');

    if (values.length === 2) {
      return {
        start: values[0],
        end: values[1]
      };
    }
  }

  private concatValue(start: string, end: string): string {
    return `${start}..${end}`;
  }

  validate(c: AbstractControl): ValidationErrors {
    return this.formGroup.errors;
  }

  get placeholder(): string {
    return createPlaceholder(this.label, this.required);
  }
}

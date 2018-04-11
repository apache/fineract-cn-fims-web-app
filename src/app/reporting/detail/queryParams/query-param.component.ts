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

import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  forwardRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Operator} from '../../../services/reporting/domain/query-parameter.model';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Type} from '../../../services/reporting/domain/type.model';
import {AbstractControlValueAccessor} from './abstract-value-accessor';
import {ReportingInputParamComponent} from './input/input.component';
import {ReportingInParamComponent} from './in/in.component';
import {ReportingBetweenParamComponent} from './between/between.component';

export const ELEMENT_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ReportingQueryParamComponent),
  multi: true,
};

@Directive({
  selector: '[fimsQueryParamContainer]',
})
export class FimsQueryParamDirective {
  constructor(public viewContainer: ViewContainerRef) { }
}

@Component({
  providers: [ELEMENT_INPUT_CONTROL_VALUE_ACCESSOR ],
  selector: 'fims-reporting-query-param',
  template: '<div fimsQueryParamContainer></div>'
})
export class ReportingQueryParamComponent extends AbstractControlValueAccessor implements ControlValueAccessor, OnInit {

  @Input() label: string;

  @Input() required: boolean;

  @Input() operator: Operator;

  @Input() type: Type;

  @ViewChild(FimsQueryParamDirective) childElement: FimsQueryParamDirective;

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    super();
  }

  ngOnInit(): void {
    const ref: ComponentRef<any> = this.componentFactoryResolver
      .resolveComponentFactory(this.getComponentType(this.operator))
      .create(this.childElement.viewContainer.injector);

    this.childElement.viewContainer.insert(ref.hostView);

    ref.instance.label = this.label;
    ref.instance.required = this.required;
    ref.instance.type = this.type;
    ref.instance.operator = this.operator;

    ref.instance.registerOnChange((value: any) => {
      this.value = value;
    });
  }

  private getComponentType(operator: Operator): any {
    switch (operator) {
      case 'GREATER':
      case 'LESSER':
      case 'EQUALS':
      case 'LIKE': {
        return ReportingInputParamComponent;
      }

      case 'IN': {
        return ReportingInParamComponent;
      }

      case 'BETWEEN': {
        return ReportingBetweenParamComponent;
      }

      default:
        console.error(`Could not find component for operator: ${operator}`);
        break;
    }
  }
}

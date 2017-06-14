/**
 * Copyright 2017 The Mifos Initiative.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, Input, OnInit} from '@angular/core';
import {Catalog} from '../../../../services/catalog/domain/catalog.model';
import {FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Field} from '../../../../services/catalog/domain/field.model';
import {Value} from '../../../../services/catalog/domain/value.model';
import {FormComponent} from '../../../../common/forms/form.component';
import {FimsValidators} from '../../../../common/validator/validators';
import * as fromCustomers from '../../store';
import {CustomersStore} from '../../store/index';
import {LOAD_ALL} from '../../store/catalogs/catalog.actions';


@Component({
  selector: 'fims-custom-fields-component',
  templateUrl: './custom-fields.component.html'
})
export class CustomerCustomFieldsComponent extends FormComponent<Value[]> implements OnInit{

  private _formData: Value[];

  private _catalogs: Catalog[];

  @Input() set formData(formData: Value[]){
    this._formData = formData;
  };

  get formData(): Value[]{
    let raw: any = this.form.getRawValue();
    let values: Value[] = [];
    for(let catalogIdentifier in raw){
      let fields = raw[catalogIdentifier];
      for(let fieldIdentifier in fields){
        let fieldValue = fields[fieldIdentifier];

        let field: Field = this.findField(catalogIdentifier, fieldIdentifier);

        if(field.dataType === 'DATE'){
          fieldValue = fieldValue && fieldValue.length ? new Date(fieldValue).toISOString() : '';
        }

        values.push({
          catalogIdentifier: catalogIdentifier,
          fieldIdentifier: fieldIdentifier,
          value: fieldValue
        })
      }
    }
    return values;
  }

  set catalogs(catalogs: Catalog[]){
    for(let catalog of catalogs){
      this.form.setControl(catalog.identifier, this.buildFormGroup(catalog));
    }
    this._catalogs = catalogs;
  }

  get catalogs() : Catalog[] {
    return this._catalogs;
  }

  private getControlForCatalog(catalogIdentifier: string, fieldIdentifier: string): FormControl{
    let formGroup: FormGroup = this.form.controls[catalogIdentifier] as FormGroup;
    return formGroup.controls[fieldIdentifier] as FormControl;
  }

  constructor(private store: CustomersStore, private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({});
    this.store.select(fromCustomers.getAllCustomerCatalogEntities)
      .subscribe(catalogs => this.catalogs = catalogs);

    this.store.dispatch({ type: LOAD_ALL })
  }

  private findValue(catalogIdentifier: string, fieldIdentifier: string): Value{
    return this._formData.find((value: Value) => value.catalogIdentifier === catalogIdentifier && value.fieldIdentifier == fieldIdentifier)
  }

  private findField(catalogIdentifier: string, fieldIdentifier: string): Field{
    let catalog: Catalog = this._catalogs.find((catalog: Catalog) => catalog.identifier === catalogIdentifier);

    return catalog.fields.find((field: Field) => field.identifier === fieldIdentifier);
  }

  private buildFormGroup(catalog: Catalog): FormGroup{
    let group: any = {};

    for(let field of catalog.fields){
      let value = this.findValue(catalog.identifier, field.identifier);
      let valueString: string = value ? value.value : '';

      let formControl: FormControl = new FormControl({value: valueString, disabled: false});

      switch(field.dataType){
        case 'NUMBER':
          formControl.setValidators(this.buildNumberValidators(field));
          break;
        case 'TEXT':
          formControl.setValidators(this.buildTextValidators(field));
          break;
        case 'DATE':
          formControl.setValue(valueString ? valueString.substring(0, 10) : '');
          break;
        case 'SINGLE_SELECTION':
          formControl.setValue(valueString ? Number(valueString) : '');
          break;
      }

      group[field.identifier] = formControl;
    }

    return this.formBuilder.group(group);
  }

  private buildTextValidators(field: Field): ValidatorFn[]{
    let validators: ValidatorFn[] = [];

    if(field.length){
      validators.push(Validators.maxLength(field.length));
    }

    return validators;
  }

  private buildNumberValidators(field: Field): ValidatorFn[]{
    let validators: ValidatorFn[] = [];

    if(field.mandatory){
      validators.push(Validators.required);
    }

    if(field.minValue){
      validators.push(FimsValidators.minValue(field.minValue));
    }

    if(field.maxValue){
      validators.push(FimsValidators.maxValue(field.maxValue));
    }

    if(field.precision){
      validators.push(FimsValidators.maxPrecision(field.precision));
    }

    return validators;
  }
}

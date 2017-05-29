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

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TdStepComponent} from '@covalent/core';
import {ProductInstance} from '../../../../services/depositAccount/domain/instance/product-instance.model';
import {ProductDefinition} from '../../../../services/depositAccount/domain/definition/product-definition.model';

@Component({
  selector: 'fims-deposit-form-component',
  templateUrl: './form.component.html'
})
export class DepositFormComponent implements OnInit {

  detailForm: FormGroup;

  @ViewChild('detailsStep') detailsStep: TdStepComponent;

  @Input('editMode') editMode: boolean;

  @Input('customerId') customerId: string;

  @Input('productDefinitions') productDefinitions: ProductDefinition[];

  @Input('productInstance') set productInstance(productInstance: ProductInstance) {
    this.prepareDetailForm(productInstance);
  };

  @Output('onSave') onSave = new EventEmitter<ProductInstance>();
  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.detailsStep.open();
  }

  private prepareDetailForm(productInstance: ProductInstance): void {
    this.detailForm = this.formBuilder.group({
      productIdentifier: [productInstance.productIdentifier, [Validators.required]]
    });
  }

  get isValid(): boolean {
      return this.detailForm.valid;
  }

  save(): void {
    const productInstance: ProductInstance = {
      customerIdentifier: this.customerId,
      productIdentifier: this.detailForm.get('productIdentifier').value
    };

    this.onSave.emit(productInstance);
  }

  cancel(): void {
    this.onCancel.emit();
  }
}

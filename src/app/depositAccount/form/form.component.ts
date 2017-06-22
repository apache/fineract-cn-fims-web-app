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
import {ProductDefinition} from '../../../services/depositAccount/domain/definition/product-definition.model';
import {TdStepComponent} from '@covalent/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FimsValidators} from '../../../common/validator/validators';
import {interestPayableOptionList} from '../domain/interest-payable-option-list.model';
import {timeUnitOptionList} from '../domain/time-unit-option-list.model';
import {DepositProductChargesFormComponent} from './charges/charges.component';
import {Charge} from '../../../services/depositAccount/domain/definition/charge.model';
import {Currency} from '../../../services/currency/domain/currency.model';
import {Action} from '../../../services/depositAccount/domain/definition/action.model';
import {typeOptionList} from '../domain/type-option-list.model';
import {accountExists} from '../../../common/validator/account-exists.validator';
import {AccountingService} from '../../../services/accounting/accounting.service';
import {ledgerExists} from '../../../common/validator/ledger-exists.validator';

@Component({
  selector: 'fims-deposit-product-form',
  templateUrl: './form.component.html'
})
export class DepositProductFormComponent implements OnInit {

  interestPayableOptions = interestPayableOptionList;

  timeUnitOptions = timeUnitOptionList;

  typeOptions = typeOptionList;

  formGroup: FormGroup;

  @ViewChild('detailsStep') step: TdStepComponent;

  @ViewChild('chargesForm') chargesForm: DepositProductChargesFormComponent;
  charges: Charge[];

  @Input('editMode') editMode: boolean;

  @Input('definition') set definition(definition: ProductDefinition) {
    this.prepareForm(definition);
  }

  @Input('currencies') currencies: Currency[];

  @Input('actions') actions: Action[];

  @Output('onSave') onSave = new EventEmitter<ProductDefinition>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private accountingService: AccountingService) {}

  ngOnInit(): void {
    this.step.open();
  }

  private prepareForm(definition: ProductDefinition): void {
    this.charges = definition.charges;

    const interestDisabled = this.editMode && !definition.flexible;

    this.formGroup = this.formBuilder.group({
      identifier: [definition.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe()]],
      type: [definition.type, [Validators.required]],
      name: [definition.name, [Validators.required]],
      description: [definition.description],
      currencyCode: [definition.currency.code, [Validators.required]],
      minimumBalance: [definition.minimumBalance, [Validators.required]],
      interest: [{ value: definition.interest, disabled: interestDisabled }, [Validators.required, FimsValidators.minValue(0)]],
      flexible: [{ value: definition.flexible, disabled: this.editMode }, [Validators.required]],
      termPeriod: [definition.term.period, [Validators.required, FimsValidators.minValue(1)]],
      termTimeUnit: [definition.term.timeUnit, [Validators.required]],
      termInterestPayable: [definition.term.interestPayable, [Validators.required]],
      expenseAccountIdentifier: [definition.expenseAccountIdentifier, [Validators.required], accountExists(this.accountingService)],
      equityLedgerIdentifier: [definition.equityLedgerIdentifier, [Validators.required], ledgerExists(this.accountingService)]
    });
  }

  save(): void {
    const currency = this.currencies.find(currency => currency.code === this.formGroup.get('currencyCode').value);

    const definition: ProductDefinition = {
      identifier: this.formGroup.get('identifier').value,
      type: this.formGroup.get('type').value,
      name: this.formGroup.get('name').value,
      description: this.formGroup.get('description').value,
      minimumBalance: this.formGroup.get('minimumBalance').value,
      interest: this.formGroup.get('interest').value,
      flexible: this.formGroup.get('flexible').value,
      term: {
        period: this.formGroup.get('termPeriod').value,
        timeUnit: this.formGroup.get('termTimeUnit').value,
        interestPayable: this.formGroup.get('termInterestPayable').value
      },
      currency: {
        code: currency.code,
        name: currency.name,
        sign: currency.sign,
        scale: currency.digits
      },
      charges: this.chargesForm.formData,
      expenseAccountIdentifier: this.formGroup.get('expenseAccountIdentifier').value,
      equityLedgerIdentifier: this.formGroup.get('equityLedgerIdentifier').value
    };

    this.onSave.emit(definition);
  }

  cancel(): void {
    this.onCancel.emit();
  }

  get isValid(): boolean {
    return this.formGroup.valid && this.chargesForm.valid;
  }
}

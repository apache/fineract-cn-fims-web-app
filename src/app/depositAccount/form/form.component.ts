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

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ProductDefinition} from '../../../services/depositAccount/domain/definition/product-definition.model';
import {TdStepComponent} from '@covalent/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
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
export class DepositProductFormComponent implements OnInit, OnChanges {

  interestPayableOptions = interestPayableOptionList;

  timeUnitOptions = timeUnitOptionList;

  typeOptions = typeOptionList;

  formGroup: FormGroup;

  @ViewChild('detailsStep') step: TdStepComponent;

  @ViewChild('chargesForm') chargesForm: DepositProductChargesFormComponent;
  charges: Charge[];

  @Input('editMode') editMode: boolean;

  @Input('definition') definition: ProductDefinition;

  @Input('currencies') currencies: Currency[];

  @Input('actions') actions: Action[];

  @Output('onSave') onSave = new EventEmitter<ProductDefinition>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private accountingService: AccountingService) {
    this.formGroup = this.formBuilder.group({
      identifier: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe()]],
      type: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      currencyCode: ['', [Validators.required]],
      minimumBalance: ['', [Validators.required]],
      fixedTermEnabled: [false],
      interest: ['', [Validators.required, FimsValidators.minValue(0)]],
      flexible: ['', [Validators.required]],
      termPeriod: [''],
      termTimeUnit: [''],
      termInterestPayable: ['', [Validators.required]],
      expenseAccountIdentifier: ['', [Validators.required], accountExists(this.accountingService)],
      equityLedgerIdentifier: ['', [Validators.required], ledgerExists(this.accountingService)]
    });

    this.formGroup.get('fixedTermEnabled').valueChanges
      .startWith(null)
      .subscribe(enabled => this.toggleFixedTerm(enabled));
  }

  ngOnInit(): void {
    this.step.open();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.charges = this.definition.charges;

    const interestDisabled = this.editMode && !this.definition.flexible;

    const fixedTermEnabled: boolean = this.hasPeriodOrTimeUnit(this.definition);

    this.formGroup.reset({
      identifier: this.definition.identifier,
      type: this.definition.type,
      name: this.definition.name,
      description: this.definition.description,
      currencyCode: this.definition.currency.code,
      minimumBalance: this.definition.minimumBalance,
      fixedTermEnabled: fixedTermEnabled,
      interest: { value: this.definition.interest, disabled: interestDisabled },
      flexible: { value: this.definition.flexible, disabled: this.editMode },
      termPeriod: this.definition.term.period,
      termTimeUnit: this.definition.term.timeUnit,
      termInterestPayable: this.definition.term.interestPayable,
      expenseAccountIdentifier: this.definition.expenseAccountIdentifier,
      equityLedgerIdentifier: this.definition.equityLedgerIdentifier
    });
  }

  toggleFixedTerm(enabled: boolean): void {
    const termPeriodControl: FormControl = this.formGroup.get('termPeriod') as FormControl;
    const termTimeUnitControl: FormControl = this.formGroup.get('termTimeUnit') as FormControl;

    if(enabled) {
      termPeriodControl.enable();
      termTimeUnitControl.enable();

      termPeriodControl.setValidators([Validators.required, FimsValidators.minValue(1)]);
      termTimeUnitControl.setValidators([Validators.required]);
    } else {
      termPeriodControl.disable();
      termTimeUnitControl.disable();

      termPeriodControl.clearValidators();
      termTimeUnitControl.clearValidators();
    }
    termPeriodControl.updateValueAndValidity();
    termTimeUnitControl.updateValueAndValidity();
  }

  hasPeriodOrTimeUnit(product: ProductDefinition): boolean {
    return !!product.term.timeUnit || !!product.term.period;
  }

  save(): void {
    const currency = this.currencies.find(currency => currency.code === this.formGroup.get('currencyCode').value);

    const fixedTerm: boolean = this.formGroup.get('fixedTermEnabled').value === true;

    const definition: ProductDefinition = {
      identifier: this.formGroup.get('identifier').value,
      type: this.formGroup.get('type').value,
      name: this.formGroup.get('name').value,
      description: this.formGroup.get('description').value,
      minimumBalance: this.formGroup.get('minimumBalance').value,
      interest: this.formGroup.get('interest').value,
      flexible: this.formGroup.get('flexible').value,
      term: {
        period: fixedTerm ? this.formGroup.get('termPeriod').value : undefined,
        timeUnit: fixedTerm ? this.formGroup.get('termTimeUnit').value : undefined,
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

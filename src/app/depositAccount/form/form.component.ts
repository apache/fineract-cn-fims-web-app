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
import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ProductDefinition} from '../../services/depositAccount/domain/definition/product-definition.model';
import {TdStepComponent} from '@covalent/core';
import {AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {FimsValidators} from '../../common/validator/validators';
import {interestPayableOptionList} from '../domain/interest-payable-option-list.model';
import {timeUnitOptionList} from '../domain/time-unit-option-list.model';
import {DepositProductChargesFormComponent} from './charges/charges.component';
import {Charge} from '../../services/depositAccount/domain/definition/charge.model';
import {Currency} from '../../services/currency/domain/currency.model';
import {Action} from '../../services/depositAccount/domain/definition/action.model';
import {typeOptionList} from '../domain/type-option-list.model';
import {accountExists} from '../../common/validator/account-exists.validator';
import {AccountingService} from '../../services/accounting/accounting.service';
import {ledgerExists} from '../../common/validator/ledger-exists.validator';
import {Subscription} from 'rxjs/Subscription';
import {Type} from '../../services/depositAccount/domain/type.model';

@Component({
  selector: 'fims-deposit-product-form',
  templateUrl: './form.component.html'
})
export class DepositProductFormComponent implements OnInit, OnDestroy, OnChanges {

  private termChangeSubscription: Subscription;

  private typeChangeSubscription: Subscription;

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
      identifier: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe]],
      type: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.maxLength(256)]],
      description: ['', Validators.maxLength(2048)],
      currencyCode: ['', [Validators.required]],
      minimumBalance: ['', [Validators.required]],
      fixedTermEnabled: [false],
      interest: ['', [Validators.required, FimsValidators.minValue(0)]],
      flexible: ['', [Validators.required]],
      termPeriod: [''],
      termTimeUnit: [''],
      termInterestPayable: ['', [Validators.required]],
      cashAccountIdentifier: ['', [Validators.required], accountExists(this.accountingService)],
      expenseAccountIdentifier: ['', [Validators.required], accountExists(this.accountingService)],
      equityLedgerIdentifier: ['', [Validators.required], ledgerExists(this.accountingService)],
      accrueAccountIdentifier: ['', [Validators.required], accountExists(this.accountingService)]
    });

    this.termChangeSubscription = this.formGroup.get('fixedTermEnabled').valueChanges
      .startWith(null)
      .subscribe(enabled => this.toggleFixedTerm(enabled));

    this.typeChangeSubscription = this.formGroup.get('type').valueChanges
      .startWith(null)
      .subscribe(type => this.toggleType(type));
  }

  ngOnInit(): void {
    this.step.open();
  }

  ngOnDestroy(): void {
    this.termChangeSubscription.unsubscribe();
    this.typeChangeSubscription.unsubscribe();
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
      minimumBalance: this.definition.minimumBalance.toFixed(2),
      fixedTermEnabled: fixedTermEnabled,
      interest: { value: this.definition.interest.toFixed(2), disabled: interestDisabled },
      flexible: { value: this.definition.flexible, disabled: this.editMode },
      termPeriod: this.definition.term.period,
      termTimeUnit: this.definition.term.timeUnit,
      termInterestPayable: this.definition.term.interestPayable,
      cashAccountIdentifier: this.definition.cashAccountIdentifier,
      expenseAccountIdentifier: this.definition.expenseAccountIdentifier,
      accrueAccountIdentifier: this.definition.accrueAccountIdentifier,
      equityLedgerIdentifier: this.definition.equityLedgerIdentifier
    });
  }

  toggleFixedTerm(enabled: boolean): void {
    const termPeriodControl: FormControl = this.formGroup.get('termPeriod') as FormControl;
    const termTimeUnitControl: FormControl = this.formGroup.get('termTimeUnit') as FormControl;

    if (enabled) {
      this.enable(termPeriodControl, [Validators.required, FimsValidators.minValue(1), FimsValidators.maxScale(0)]);
      this.enable(termTimeUnitControl, [Validators.required]);
    } else {
      this.disable(termPeriodControl);
      this.disable(termTimeUnitControl);
    }
  }

  toggleType(type: Type): void {
    const enableAccrueAccount = type !== 'SHARE';

    const accrueAccountControl: FormControl = this.formGroup.get('accrueAccountIdentifier') as FormControl;

    if (enableAccrueAccount) {
      this.enable(accrueAccountControl, [Validators.required], accountExists(this.accountingService));
    } else {
      this.disable(accrueAccountControl);
    }
  }

  private enable(formControl: FormControl, validators: ValidatorFn[], asyncValidator?: AsyncValidatorFn): void {
    formControl.enable();
    formControl.setValidators(validators);
    formControl.setAsyncValidators(asyncValidator);
    formControl.updateValueAndValidity();
  }

  private disable(formControl: FormControl): void {
    formControl.disable();
    formControl.clearValidators();
    formControl.updateValueAndValidity();
  }

  hasPeriodOrTimeUnit(product: ProductDefinition): boolean {
    return !!product.term.timeUnit || !!product.term.period;
  }

  save(): void {
    const foundCurrency = this.currencies.find(currency => currency.code === this.formGroup.get('currencyCode').value);

    const isShare = this.formGroup.get('type').value === 'SHARE';

    const fixedTerm: boolean = this.formGroup.get('fixedTermEnabled').value === true;

    const definition: ProductDefinition = {
      identifier: this.formGroup.get('identifier').value,
      type: this.formGroup.get('type').value,
      name: this.formGroup.get('name').value,
      description: this.formGroup.get('description').value,
      minimumBalance: parseFloat(this.formGroup.get('minimumBalance').value),
      interest: parseFloat(this.formGroup.get('interest').value),
      flexible: this.formGroup.get('flexible').value,
      term: {
        period: fixedTerm ? this.formGroup.get('termPeriod').value : undefined,
        timeUnit: fixedTerm ? this.formGroup.get('termTimeUnit').value : undefined,
        interestPayable: this.formGroup.get('termInterestPayable').value
      },
      currency: {
        code: foundCurrency.code,
        name: foundCurrency.name,
        sign: foundCurrency.sign,
        scale: foundCurrency.digits
      },
      charges: this.chargesForm.formData,
      expenseAccountIdentifier: this.formGroup.get('expenseAccountIdentifier').value,
      equityLedgerIdentifier: this.formGroup.get('equityLedgerIdentifier').value,
      cashAccountIdentifier: this.formGroup.get('cashAccountIdentifier').value,
      accrueAccountIdentifier: !isShare ? this.formGroup.get('accrueAccountIdentifier').value : undefined
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

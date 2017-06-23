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

import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormComponent} from '../../../../../common/forms/form.component';
import {CreditWorthinessSnapshot} from '../../../../../services/portfolio/domain/individuallending/credit-worthiness-snapshot.model';
import {CaseCreditFactorFormComponent} from '../components/credit-factor.component';
import {CreditWorthinessFactor} from '../../../../../services/portfolio/domain/individuallending/credit-worthiness-factor.model';

export interface DebtToIncomeFormData {
  incomeSources: CreditWorthinessFactor[];
  debts: CreditWorthinessFactor[];
}

@Component({
  selector: 'fims-case-debt-to-income-form',
  templateUrl: './debt-to-income.component.html'
})
export class CaseDebtToIncomeFormComponent {

  numberFormat: string = '2.2-2';

  @ViewChild('incomeForm') incomeFactorComponent: CaseCreditFactorFormComponent;
  incomeSources: CreditWorthinessFactor[] = [];

  @ViewChild('debtForm') debtsFactorComponent: CaseCreditFactorFormComponent;
  debts: CreditWorthinessFactor[] = [];

  @Input('formData') set formData(formData: DebtToIncomeFormData) {
    this.incomeSources = formData.incomeSources;
    this.debts = formData.debts;
  }

  constructor() {}

  get formData(): DebtToIncomeFormData {
    return {
      incomeSources: this.incomeFactorComponent.formData,
      debts: this.debtsFactorComponent.formData
    };
  }

  get valid(): boolean {
    return this.incomeFactorComponent.valid && this.debtsFactorComponent.valid;
  }

  get pristine(): boolean {
    return this.incomeFactorComponent.pristine || this.debtsFactorComponent.pristine;
  }

  get ratio(): number {
    return this.divideIfNotZero(this.debtTotal, this.incomeTotal);
  }

  divideIfNotZero(numerator, denominator): number {
    if (denominator === 0 || isNaN(denominator)) {
      return null;
    } else {
      return numerator / denominator;
    }
  }

  get incomeTotal(): number {
    return this.sum(this.formData.incomeSources);
  }

  get debtTotal(): number {
    return this.sum(this.formData.debts);
  }

  private sum(factors: CreditWorthinessFactor[]): number {
    return factors.reduce((acc, val) => acc + val.amount, 0);
  }

}

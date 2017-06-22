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
import {CreditWorthinessFactor} from '../../../../../services/portfolio/domain/individuallending/credit-worthiness-factor.model';
import {CaseDebtToIncomeFormComponent, DebtToIncomeFormData} from '../debt-to-income/debt-to-income.component';
import {FormBuilder} from '@angular/forms';
import {customerExists} from '../../../../../common/validator/customer-exists.validator';
import {CustomerService} from '../../../../../services/customer/customer.service';

export interface CoSignerFormData {
  customerId: string;
  incomeSources: CreditWorthinessFactor[];
  debts: CreditWorthinessFactor[];
}

@Component({
  selector: 'fims-case-co-signer-form',
  templateUrl: './co-signer.component.html'
})
export class CaseCoSignerFormComponent extends FormComponent<CoSignerFormData> implements OnInit {

  private _formData: CoSignerFormData;

  @Input('formData') set formData(formData: CoSignerFormData) {
    this._formData = formData;
  }

  @ViewChild('debtToIncomeForm') debtToIncomeForm: CaseDebtToIncomeFormComponent;
  debtToIncomeFormData: DebtToIncomeFormData;

  constructor(private formBuilder: FormBuilder, private customerService: CustomerService) {
    super();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      customerIdentifier: [this._formData.customerId, [], customerExists(this.customerService)]
    });

    this.debtToIncomeFormData = {
      incomeSources: this._formData.incomeSources,
      debts: this._formData.debts
    }
  }

  get formData(): CoSignerFormData {
    return {
      customerId: this.form.get('customerIdentifier').value,
      incomeSources: this.debtToIncomeForm.formData.incomeSources,
      debts: this.debtToIncomeForm.formData.debts
    };
  }

  get valid(): boolean {
    return this.form.valid && this.debtToIncomeForm.valid;
  }
}

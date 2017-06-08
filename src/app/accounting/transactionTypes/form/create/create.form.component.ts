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

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromAccounting from '../../../store/index';
import {AccountingStore} from '../../../store/index';
import {Error} from '../../../../../services/domain/error.model';
import {TransactionType} from '../../../../../services/accounting/domain/transaction-type.model';
import {CREATE, RESET_FORM} from '../../../store/ledger/transaction-type/transaction-type.actions';
import {TransactionTypeFormComponent} from '../transaction-type-form.component';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateTransactionTypeFormComponent implements OnInit, OnDestroy {

  private formStateSubscription: Subscription;

  @ViewChild('form') formComponent: TransactionTypeFormComponent;

  transactionType: TransactionType = {
    code: '',
    name: ''
  };

  constructor(private router: Router, private route: ActivatedRoute, private store: AccountingStore) {}

  ngOnInit() {
    this.formStateSubscription = this.store.select(fromAccounting.getTransactionTypeFormError)
      .filter((error: Error) => !!error)
      .subscribe((error: Error) => {
        this.formComponent.showNumberValidationError();
      });
  }

  ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();

    this.store.dispatch({ type: RESET_FORM })
  }

  onSave(transactionType: TransactionType) {
    this.store.dispatch({ type: CREATE, payload: {
      transactionType,
      activatedRoute: this.route
    } });
  }

  onCancel() {
    this.navigateAway();
  }

  navigateAway(): void{
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

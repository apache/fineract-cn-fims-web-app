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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromAccounting from '../../../store/index';
import {AccountingStore} from '../../../store/index';
import {TransactionType} from '../../../../../services/accounting/domain/transaction-type.model';
import {SelectAction, UPDATE} from '../../../store/ledger/transaction-type/transaction-type.actions';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

@Component({
  templateUrl: './edit.form.component.html'
})
export class EditTransactionTypeFormComponent implements OnInit, OnDestroy {

  private actionsSubscription: Subscription;

  transactionType$: Observable<TransactionType>;

  constructor(private router: Router, private route: ActivatedRoute, private store: AccountingStore) {}

  ngOnInit() {
    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['code']))
      .subscribe(this.store);

    this.transactionType$ = this.store.select(fromAccounting.getSelectedTransactionType);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
  }

  onSave(transactionType: TransactionType) {
    this.store.dispatch({ type: UPDATE, payload: {
      transactionType,
      activatedRoute: this.route
    } });
  }

  onCancel() {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}

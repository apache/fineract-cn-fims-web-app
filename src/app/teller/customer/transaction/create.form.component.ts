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
import {TellerTransaction, TransactionType} from '../../../../services/teller/domain/teller-transaction.model';
import {TellerService} from '../../../../services/teller/teller-service';
import {TellerTransactionCosts} from '../../../../services/teller/domain/teller-transaction-costs.model';
import {CONFIRM_TRANSACTION} from '../../store/teller.actions';
import * as fromTeller from '../../store/index';
import {TellerStore} from '../../store/index';
import * as fromRoot from '../../../reducers/index';
import {DepositAccountService} from '../../../../services/depositAccount/deposit-account.service';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {TellerTransactionFormComponent, TellerTransactionFormData} from './form.component';
import {ProductInstance} from '../../../../services/depositAccount/domain/instance/product-instance.model';
import {Teller} from '../../../../services/teller/domain/teller.model';

const withdrawalTypes: TransactionType[] = ['ACCC', 'ACCT', 'CWDL'];

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateTellerTransactionForm implements OnInit, OnDestroy {

  private authenticatedTellerSubscription: Subscription;

  private usernameSubscription: Subscription;

  private tellerTransactionIdentifier: string;

  private _transactionType: TransactionType;

  private clerk: string;

  @ViewChild('form') form: TellerTransactionFormComponent;

  productInstances$: Observable<ProductInstance[]>;

  transactionCosts$: Observable<TellerTransactionCosts>;

  teller: Teller;

  checkCashdrawLimit: boolean;

  enableTargetAccount: boolean;

  transactionCreated: boolean;

  error: string;

  constructor(private router: Router, private route: ActivatedRoute, private store: TellerStore, private tellerService: TellerService, private depositService: DepositAccountService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => this.transactionType = params['transactionType']);

    this.productInstances$ = this.store.select(fromTeller.getTellerSelectedCustomer)
      .switchMap(customer => this.depositService.fetchProductInstances(customer.identifier));

    this.authenticatedTellerSubscription = this.store.select(fromTeller.getAuthenticatedTeller)
      .subscribe(teller => { this.teller = teller } );

    this.usernameSubscription = this.store.select(fromRoot.getUsername)
      .subscribe(username => this.clerk = username);
  }

  set transactionType(transactionType: TransactionType) {
    this._transactionType = transactionType;

    if(transactionType === 'ACCT') {
      this.enableTargetAccount = true;
    }

    const withdrawalType = withdrawalTypes.find(type => type === transactionType);
    if(withdrawalType) {
      this.checkCashdrawLimit = true;
    }
  }

  get transactionType(): TransactionType {
    return this._transactionType;
  }

  ngOnDestroy(): void {
    this.authenticatedTellerSubscription.unsubscribe();
    this.usernameSubscription.unsubscribe();
  }

  createTransaction(formData: TellerTransactionFormData): void {
    const transaction: TellerTransaction = {
      customerIdentifier: formData.customerIdentifier,
      productIdentifier: formData.productIdentifier,
      customerAccountIdentifier: formData.accountIdentifier,
      targetAccountIdentifier: formData.targetAccountIdentifier,
      amount: formData.amount,
      clerk: this.clerk,
      transactionDate: new Date().toISOString(),
      transactionType: this.transactionType
    };

    this.transactionCosts$ = this.tellerService.createTransaction(this.teller.code, transaction)
      .do(transactionCosts => this.tellerTransactionIdentifier = transactionCosts.tellerTransactionIdentifier)
      .do(() => this.transactionCreated = true);
  }

  confirmTransaction(): void {
    this.store.dispatch({
      type: CONFIRM_TRANSACTION,
      payload: {
        tellerCode: this.teller.code,
        tellerTransactionIdentifier: this.tellerTransactionIdentifier,
        command: 'CONFIRM',
        activatedRoute: this.route
      }
    });
  }

  cancelTransaction(): void {
    this.store.dispatch({
      type: CONFIRM_TRANSACTION,
      payload: {
        tellerCode: this.teller.code,
        tellerTransactionIdentifier: this.tellerTransactionIdentifier,
        command: 'CANCEL',
        activatedRoute: this.route
      }
    });
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route })
  }
}

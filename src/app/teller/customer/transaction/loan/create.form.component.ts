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
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TellerTransaction, TransactionType} from '../../../../services/teller/domain/teller-transaction.model';
import {TellerTransactionCosts} from '../../../../services/teller/domain/teller-transaction-costs.model';
import {CONFIRM_TRANSACTION} from '../../../store/teller.actions';
import * as fromTeller from '../../../store/index';
import {TellerStore} from '../../../store/index';
import * as fromRoot from '../../../../store/index';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {DepositTransactionFormComponent} from '../deposit/form.component';
import {Teller} from '../../../../services/teller/domain/teller.model';
import {PortfolioService} from '../../../../services/portfolio/portfolio.service';
import {TransactionForm} from '../domain/transaction-form.model';
import {FimsCase} from '../../../../services/portfolio/domain/fims-case.model';
import {TellerTransactionService} from '../../../services/transaction.service';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateLoanTransactionFormComponent implements OnInit, OnDestroy {

  private authenticatedTellerSubscription: Subscription;

  private usernameSubscription: Subscription;

  private tellerTransactionIdentifier: string;

  private clerk: string;

  private transactionType: TransactionType;

  @ViewChild('form') form: DepositTransactionFormComponent;

  caseInstances$: Observable<FimsCase[]>;

  transactionCosts$: Observable<TellerTransactionCosts>;

  paymentHint: string;

  teller: Teller;

  transactionCreated: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private store: TellerStore,
              private portfolioService: PortfolioService, private tellerTransactionService: TellerTransactionService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => this.transactionType = params['transactionType']);

    this.caseInstances$ = this.store.select(fromTeller.getTellerSelectedCustomer)
      .switchMap(customer => this.portfolioService.getAllCasesForCustomer(customer.identifier))
      .map(casePage => casePage.elements.filter(element => element.currentState === 'ACTIVE'));

    this.authenticatedTellerSubscription = this.store.select(fromTeller.getAuthenticatedTeller)
      .filter(teller => !!teller)
      .subscribe(teller => {
        this.teller = teller;
      });

    this.usernameSubscription = this.store.select(fromRoot.getUsername)
      .subscribe(username => this.clerk = username);
  }

  ngOnDestroy(): void {
    this.authenticatedTellerSubscription.unsubscribe();
    this.usernameSubscription.unsubscribe();
  }

  createTransaction(formData: TransactionForm): void {
    const transaction: TellerTransaction = {
      customerIdentifier: formData.customerIdentifier,
      productIdentifier: formData.productIdentifier,
      productCaseIdentifier: formData.productCaseIdentifier,
      customerAccountIdentifier: formData.accountIdentifier,
      amount: formData.amount,
      clerk: this.clerk,
      transactionDate: new Date().toISOString(),
      transactionType: this.transactionType
    };

    this.transactionCosts$ = this.tellerTransactionService.createTransaction(this.teller.code, transaction)
      .do(transactionCosts => this.tellerTransactionIdentifier = transactionCosts.tellerTransactionIdentifier)
      .do(() => this.transactionCreated = true);
  }

  confirmTransaction(chargesIncluded: boolean): void {
    this.store.dispatch({
      type: CONFIRM_TRANSACTION,
      payload: {
        tellerCode: this.teller.code,
        tellerTransactionIdentifier: this.tellerTransactionIdentifier,
        command: 'CONFIRM',
        chargesIncluded,
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

  caseSelected(caseInstance: FimsCase): void {
    this.portfolioService.getCostComponentsForAction(caseInstance.productIdentifier, caseInstance.identifier, 'ACCEPT_PAYMENT')
      .map(payment => payment.balanceAdjustments.ey * -1)
      .subscribe(paymentHint => this.paymentHint = paymentHint.toString());
  }

  cancel(): void {
    this.router.navigate(['../../'], {relativeTo: this.route});
  }
}

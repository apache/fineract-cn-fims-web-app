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
import {DepositAccountService} from '../../../../services/depositAccount/deposit-account.service';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {ProductInstance} from '../../../../services/depositAccount/domain/instance/product-instance.model';
import {Teller} from '../../../../services/teller/domain/teller.model';
import {TransactionForm} from '../domain/transaction-form.model';
import {ChequeTransactionFormComponent} from './form.component';
import {ChequeService} from '../../../../services/cheque/cheque.service';
import {MICRResolution} from '../../../../services/cheque/domain/micr-resolution.model';
import {Error} from '../../../../services/domain/error.model';
import {TellerTransactionService} from '../../../services/transaction.service';

@Component({
  templateUrl: './create.component.html'
})
export class CreateChequeTransactionFormComponent implements OnInit, OnDestroy {

  private authenticatedTellerSubscription: Subscription;

  private usernameSubscription: Subscription;

  private tellerTransactionIdentifier: string;

  private clerk: string;

  @ViewChild('form') form: ChequeTransactionFormComponent;

  transactionType: TransactionType;

  customerName$: Observable<string>;

  micrResolution$: Observable<MICRResolution>;

  micrResolutionError: Error;

  productInstances$: Observable<ProductInstance[]>;

  transactionCosts$: Observable<TellerTransactionCosts>;

  teller: Teller;

  transactionCreated: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private store: TellerStore,
              private depositService: DepositAccountService, private chequeService: ChequeService,
              private tellerTransactionService: TellerTransactionService) {}

  ngOnInit(): void {
    const selectedCustomer$ = this.store.select(fromTeller.getTellerSelectedCustomer)
      .filter(customer => !!customer);

    this.productInstances$ = selectedCustomer$
      .switchMap(customer => this.depositService.fetchProductInstances(customer.identifier))
      .map((instances: ProductInstance[]) => instances.filter(instance => instance.state === 'ACTIVE'));

    this.authenticatedTellerSubscription = this.store.select(fromTeller.getAuthenticatedTeller)
      .filter(teller => !!teller)
      .subscribe(teller => { this.teller = teller; } );

    this.usernameSubscription = this.store.select(fromRoot.getUsername)
      .subscribe(username => this.clerk = username);

    this.customerName$ = selectedCustomer$
      .map(customer => `${customer.givenName} ${customer.surname}`);
  }

  ngOnDestroy(): void {
    this.authenticatedTellerSubscription.unsubscribe();
    this.usernameSubscription.unsubscribe();
  }

  expandMICR(identifier: string): void {
    this.micrResolution$ = this.chequeService.expandMicr(identifier)
      .do(resolution => this.micrResolutionError = null)
      .catch(error => {
        this.micrResolutionError = error;
        return Observable.empty();
      });
  }

  createTransaction(formData: TransactionForm): void {
    const transaction: TellerTransaction = {
      customerIdentifier: formData.customerIdentifier,
      productIdentifier: formData.productIdentifier,
      customerAccountIdentifier: formData.accountIdentifier,
      targetAccountIdentifier: formData.targetAccountIdentifier,
      amount: formData.amount,
      clerk: this.clerk,
      transactionDate: new Date().toISOString(),
      cheque: formData.cheque,
      transactionType: 'CCHQ'
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

  cancel(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}

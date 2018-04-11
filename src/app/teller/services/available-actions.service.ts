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
import {Injectable} from '@angular/core';
import {DepositAccountService} from '../../services/depositAccount/deposit-account.service';
import {Observable} from 'rxjs/Observable';
import {TransactionType} from '../../services/teller/domain/teller-transaction.model';
import {PortfolioService} from '../../services/portfolio/portfolio.service';
import {FetchRequest} from '../../services/domain/paging/fetch-request.model';
import {FimsCase} from '../../services/portfolio/domain/fims-case.model';

export interface Action {
  transactionType: TransactionType;
  icon: string;
  title: string;
  relativeLink: string;
}

const depositActions: Action[] = [
  { transactionType: 'ACCO', icon: 'create', title: 'Open account', relativeLink: 'transaction/deposit' },
  { transactionType: 'ACCC', icon: 'close', title: 'Close account', relativeLink: 'transaction/deposit' },
  { transactionType: 'ACCT', icon: 'swap_horiz', title: 'Account transfer', relativeLink: 'transaction/deposit'},
  { transactionType: 'CDPT', icon: 'arrow_forward', title: 'Cash deposit', relativeLink: 'transaction/deposit'},
  { transactionType: 'CWDL', icon: 'arrow_back', title: 'Cash withdrawal', relativeLink: 'transaction/deposit'},
  { transactionType: 'CCHQ', icon: 'import_contacts', title: 'Cash cheque', relativeLink: 'transaction/cheque'}
];

const loanActions: Action[] = [
  { transactionType: 'PPAY', icon: 'arrow_forward', title: 'Repay loan', relativeLink: 'transaction/loan' }
];

@Injectable()
export class AvailableActionService {

  constructor(private depositService: DepositAccountService, private portfolioService: PortfolioService) {}

  getAvailableActions(customerIdentifier: string): Observable<Action[]> {
    const depositActions$ = this.getAvailableDepositActions(customerIdentifier);
    const loanActions$ = this.getAvailableLoanActions(customerIdentifier);
    return Observable.combineLatest(
      depositActions$,
      loanActions$,
      (availableDepositActions, availableLoanActions) =>
        availableDepositActions.concat(availableLoanActions)
    );
  }

  getAvailableDepositActions(customerIdentifier: string): Observable<Action[]> {
    return this.depositService.fetchPossibleTransactionTypes(customerIdentifier)
      .map(types => depositActions.filter(action =>
        !!types.find(type => action.transactionType === type.transactionType)
      ));
  }

  getAvailableLoanActions(customerIdentifier: string): Observable<Action[]> {
    return this.hasActivateLoans(customerIdentifier)
      .map(hasLoanProducts => hasLoanProducts ? loanActions : []);
  }

  private hasActivateLoans(customerIdentifier: string): Observable<boolean> {
    const fetchRequest: FetchRequest = {
      page: {
        pageIndex: 0,
        size: 100
      }
    };
    return this.portfolioService.getAllCasesForCustomer(customerIdentifier, fetchRequest)
      .map(page => page.totalElements > 0 && this.hasActiveLoan(page.elements));
  }

  private hasActiveLoan(cases: FimsCase[]): boolean {
    return !!cases.find(element => element.currentState === 'ACTIVE');
  }

}

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
import {AvailableActionService} from './available-actions.service';
import {DepositAccountService} from '../../services/depositAccount/deposit-account.service';
import {Observable} from 'rxjs/Observable';
import {PortfolioService} from '../../services/portfolio/portfolio.service';
import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AvailableTransactionType} from '../../services/depositAccount/domain/instance/available-transaction-type.model';
import {FimsCasePage} from '../../services/portfolio/domain/fims-case-page.model';
import {FimsCase} from '../../services/portfolio/domain/fims-case.model';
import {CaseState} from '../../services/portfolio/domain/case-state.model';

describe('AvailableActionService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AvailableActionService,
        {
          provide: DepositAccountService,
          useValue: jasmine.createSpyObj('depositService', ['fetchPossibleTransactionTypes'])
        },
        {
          provide: PortfolioService,
          useValue: jasmine.createSpyObj('portfolioService', ['getAllCasesForCustomer'])
        }
      ]
    });
  });

  function setupDeposit(transactionTypes: AvailableTransactionType[]) {
    const depositService = TestBed.get(DepositAccountService);
    depositService.fetchPossibleTransactionTypes.and.returnValue(Observable.of(transactionTypes));
  }

  function setupPortfolio(cases: FimsCasePage) {
    const portfolioService = TestBed.get(PortfolioService);
    portfolioService.getAllCasesForCustomer.and.returnValue(Observable.of(cases));
  }

  function mockCase(currentState: CaseState): FimsCase {
    return {
      identifier: 'test',
      productIdentifier: 'test',
      currentState,
      interest: 1,
      parameters: null,
      depositAccountIdentifier: 'test'
    };
  }

  it('should merge deposit, loan actions', fakeAsync(() => {
    setupDeposit([
      { transactionType: 'ACCC' }
    ]);

    setupPortfolio({
      elements: [mockCase('ACTIVE')],
      totalElements: 1,
      totalPages: 1
    });

    const actionService = TestBed.get(AvailableActionService);

    let result = null;

    actionService.getAvailableActions('test').subscribe(_result => result = _result);

    tick();

    // 1 deposit, 1 case
    expect(result.length).toBe(2);
  }));

  it('output deposit actions when deposit actions found', fakeAsync(() => {
    setupDeposit([
      { transactionType: 'ACCC' },
      { transactionType: 'CWDL' }
    ]);

    const actionService = TestBed.get(AvailableActionService);

    let result = null;

    actionService.getAvailableDepositActions('test').subscribe(_result => result = _result);

    tick();

    expect(result.length).toBe(2);
  }));

  it('not output any deposit actions when no deposit actions found', fakeAsync(() => {
    setupDeposit([]);

    const actionService = TestBed.get(AvailableActionService);

    let result = null;

    actionService.getAvailableDepositActions('test').subscribe(_result => result = _result);

    tick();

    expect(result).toEqual([]);
  }));

  it('should output actions when active cases found', fakeAsync(() => {
    setupPortfolio({
      elements: [mockCase('ACTIVE')],
      totalElements: 1,
      totalPages: 1
    });

    const actionService = TestBed.get(AvailableActionService);

    let result = null;

    actionService.getAvailableLoanActions('test').subscribe(_result => result = _result);

    tick();

    expect(result.length).toEqual(1);
  }));

  describe('should not output any loan actions', () => {
    it('when no cases found', fakeAsync(() => {
      setupPortfolio({
        elements: [],
        totalElements: 0,
        totalPages: 0
      });

      const actionService = TestBed.get(AvailableActionService);

      let result = null;

      actionService.getAvailableLoanActions('test').subscribe(_result => result = _result);

      tick();

      expect(result).toEqual([]);
    }));

    it('when no active cases found', fakeAsync(() => {
      setupPortfolio({
        elements: [mockCase('PENDING')],
        totalElements: 1,
        totalPages: 1
      });

      const actionService = TestBed.get(AvailableActionService);

      let result = null;

      actionService.getAvailableLoanActions('test').subscribe(_result => result = _result);

      tick();

      expect(result).toEqual([]);
    }));
  });

});

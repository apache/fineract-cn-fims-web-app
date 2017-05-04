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
import {Component, OnInit} from '@angular/core';
import {TrialBalance} from '../../../services/accounting/domain/trial-balance.model';
import * as fromAccounting from '../store';
import {LOAD_TRIAL_BALANCE} from '../store/ledger/ledger.actions';
import {Observable} from 'rxjs';
import {AccountingStore} from '../store/index';
import {MdCheckboxChange} from '@angular/material';

@Component({
  templateUrl: './trail-balance.component.html'
})
export class TrailBalanceComponent implements OnInit{

  includeEmptyEntries: boolean = true;

  trialBalance$: Observable<TrialBalance>;

  constructor(private store: AccountingStore){}

  ngOnInit(): void {
    this.trialBalance$ = this.store.select(fromAccounting.getTrialBalance);
    this.fetchTrialBalance();
  }

  fetchTrialBalance(event?: MdCheckboxChange): void{
    this.store.dispatch({ type: LOAD_TRIAL_BALANCE, payload: this.includeEmptyEntries });
  }

}

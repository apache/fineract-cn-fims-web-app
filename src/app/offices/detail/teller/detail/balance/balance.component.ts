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
import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as fromOffices from '../../../../store/index';
import {OfficesStore} from '../../../../store/index';
import {TellerBalance} from './services/teller-balance.model';
import {BalanceSheetService} from './services/balance-sheet.service';

@Component({
  templateUrl: './balance.component.html'
})
export class TellerBalanceComponent implements OnInit {

  numberFormat = '1.2-2';

  balance$: Observable<TellerBalance>;

  constructor(private balanceSheetService: BalanceSheetService, private store: OfficesStore) {}

  ngOnInit(): void {
    this.balance$ = Observable.combineLatest(
      this.store.select(fromOffices.getSelectedTeller).filter(teller => !!teller),
      this.store.select(fromOffices.getSelectedOffice).filter(office => !!office),
      (teller, office) => ({
        teller,
        office
      })
    ).switchMap(result => this.balanceSheetService.getBalance(result.office.identifier, result.teller.code));
  }
}

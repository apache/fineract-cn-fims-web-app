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
import {TellerService} from '../../../../../../services/teller/teller-service';
import {TellerBalanceSheet} from '../../../../../../services/teller/domain/teller-balance-sheet.model';
import {Observable} from 'rxjs/Observable';
import {OfficesStore} from '../../../../store/index';
import * as fromOffices from '../../../../store/index';

@Component({
  templateUrl: './balance.component.html'
})
export class TellerBalanceComponent implements OnInit {

  balance$: Observable<TellerBalanceSheet>;

  constructor(private tellerService: TellerService, private store: OfficesStore) {}

  ngOnInit(): void {
    this.balance$ = Observable.combineLatest(
      this.store.select(fromOffices.getSelectedTeller),
      this.store.select(fromOffices.getSelectedOffice),
      (teller, office) => ({
        teller,
        office
      })
    ).switchMap(result => this.tellerService.getBalance(result.office.identifier, result.teller.code));

  }
}

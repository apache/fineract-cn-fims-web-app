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
import {TellerService} from '../../../../../../services/teller/teller-service';
import {TellerBalance} from './teller-balance.model';
import {Observable} from 'rxjs/Observable';
import {TellerEntry} from '../../../../../../services/teller/domain/teller-entry.model';

@Injectable()
export class BalanceSheetService {

  constructor(private tellerService: TellerService) {
  }

  private compareEntry(entryA: TellerEntry, entryB: TellerEntry): number {
    return new Date(entryA.transactionDate).getTime() - new Date(entryB.transactionDate).getTime();
  }

  getBalance(officeIdentifier: string, tellerCode: string): Observable<TellerBalance> {
    return this.tellerService.getBalance(officeIdentifier, tellerCode)
      .map(balance => {
        const chequeEntries = balance.chequeEntries || [];
        const cashEntries = balance.cashEntries || [];

        const entries = cashEntries.concat(chequeEntries)
          .sort((entryA, entryB) => this.compareEntry(entryA, entryB));

        return {
          day: balance.day,
          cashOnHand: balance.cashOnHand,
          cashReceivedTotal: balance.cashReceivedTotal,
          cashDisbursedTotal: balance.cashDisbursedTotal,
          chequesReceivedTotal: balance.chequesReceivedTotal,
          entries
        };
      });
  }
}

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
import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromOffices from '../../../../../store/index';
import {OfficesStore} from '../../../../../store/index';
import {TellerDenomination} from '../../../../../../services/teller/domain/teller-denomination.model';
import {CREATE_DENOMINATION} from '../../../../../store/teller/denomination/denomination.actions';
import {Observable} from 'rxjs/Observable';
import {TellerService} from '../../../../../../services/teller/teller-service';
import {TellerBalanceSheet} from '../../../../../../services/teller/domain/teller-balance-sheet.model';

interface CurrentSelection {
  officeId: string;
  tellerId: string;
}

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateDenominationFormComponent {

  currentSelection$: Observable<CurrentSelection>;

  balanceSheet$: Observable<TellerBalanceSheet>;

  constructor(private router: Router, private route: ActivatedRoute, private store: OfficesStore, private tellerService: TellerService) {
    this.currentSelection$ = Observable.combineLatest(
      this.store.select(fromOffices.getSelectedOffice).filter(office => !!office),
      this.store.select(fromOffices.getSelectedTeller).filter(teller => !!teller),
      (office, teller) => ({
        office,
        teller
      })).map(result => ({
        officeId: result.office.identifier,
        tellerId: result.teller.code
      }));

    this.balanceSheet$ = this.currentSelection$
      .switchMap(selection => this.tellerService.getBalance(selection.officeId, selection.tellerId));
  }

  onSave(officeId: string, tellerCode: string, denomination: TellerDenomination): void {
    this.store.dispatch({ type: CREATE_DENOMINATION, payload: {
      officeId,
      tellerCode,
      denomination,
      activatedRoute: this.route
    }});
  }

  onCancel(): void {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}

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
import {OnInit, Component, ViewChild, OnDestroy} from '@angular/core';
import {Ledger} from '../../../../services/accounting/domain/ledger.model';
import {LedgerFormComponent} from '../form.component';
import {Router, ActivatedRoute} from '@angular/router';
import {Error} from '../../../../services/domain/error.model';
import * as fromAccounting from '../../store';
import {Subscription} from 'rxjs';
import {CREATE, CREATE_SUB_LEDGER, RESET_FORM, SelectAction} from '../../store/ledger/ledger.actions';
import {AccountingStore} from '../../store/index';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateLedgerFormComponent implements OnInit, OnDestroy {

  private formStateSubscription: Subscription;

  private ledgerSubscription: Subscription;

  @ViewChild('form') formComponent: LedgerFormComponent;

  parentLedger: Ledger;

  ledger: Ledger = {
    identifier: '',
    type: 'ASSET',
    name: '',
    showAccountsInChart: true,
    subLedgers: [],
  };

  constructor(private router: Router, private route: ActivatedRoute, private store: AccountingStore) {}

  ngOnInit() {
    this.formStateSubscription = this.store.select(fromAccounting.getLedgerFormError)
      .filter((error: Error) => !!error)
      .subscribe((error: Error) => this.formComponent.showIdentifierValidationError());

    this.ledgerSubscription = this.store.select(fromAccounting.getSelectedLedger)
      .subscribe(ledger => this.parentLedger = ledger);
  }

  ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();
    this.ledgerSubscription.unsubscribe();

    this.store.dispatch({ type: RESET_FORM })
  }

  onSave(ledger: Ledger) {
    if(this.parentLedger){
      this.store.dispatch({ type: CREATE_SUB_LEDGER, payload: {
        parentLedgerId: this.parentLedger.identifier,
        ledger,
        activatedRoute: this.route
      }});
    }else{
      this.store.dispatch({ type: CREATE, payload: {
        ledger,
        activatedRoute: this.route
      }});
    }
  }

  onCancel() {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

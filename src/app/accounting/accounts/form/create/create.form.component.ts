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
import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {AccountFormComponent} from '../form.component';
import {Account} from '../../../../../services/accounting/domain/account.model';
import {Router, ActivatedRoute} from '@angular/router';
import {Ledger} from '../../../../../services/accounting/domain/ledger.model';
import * as fromAccounting from '../../../store';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {Error} from '../../../../../services/domain/error.model';
import {CREATE} from '../../../store/account/account.actions';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateAccountFormComponent implements OnInit, OnDestroy {

  private formStateSubscription: Subscription;
  private selectedLedgerSubscription: Subscription;

  ledger: Ledger;

  @ViewChild('form') formComponent: AccountFormComponent;

  account: Account = {
    identifier: '',
    holders: [],
    signatureAuthorities: [],
    ledger: '',
    balance: 0
  };

  constructor(private router: Router, private route: ActivatedRoute, private store: Store<fromAccounting.State>) {}

  ngOnInit() {
    this.formStateSubscription = this.store.select(fromAccounting.getJournalEntryFormState)
      .subscribe((payload: {error: Error}) => {

        if(!payload.error) return;

        switch (payload.error.status) {
          case 400:
            //This should not happen
            break;
          case 409:
            this.formComponent.showIdentifierValidationError();
            break;
        }

      });

    this.selectedLedgerSubscription = this.store.select(fromAccounting.getSelectedLedger)
      .subscribe(ledger => {
        this.ledger = ledger;
        this.account.ledger = this.ledger.identifier;
        this.account.type = this.ledger.type;
      });
  }

  ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();
    this.selectedLedgerSubscription.unsubscribe();
  }

  onSave(account: Account) {
    this.store.dispatch({ type: CREATE, payload: {
      account,
      activatedRoute: this.route
    }});
  }

  onCancel() {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

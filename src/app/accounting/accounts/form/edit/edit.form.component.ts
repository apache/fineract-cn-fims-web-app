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
import {Account} from '../../../../../services/accounting/domain/account.model';
import {AccountFormComponent} from '../form.component';
import {ViewChild, OnInit, Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import * as fromAccounting from '../../../store';
import {AccountingStore} from '../../../store/index';
import {SelectAction, UPDATE} from '../../../store/account/account.actions';

@Component({
  templateUrl: './edit.form.component.html'
})
export class EditAccountFormComponent implements OnInit, OnDestroy {

  private actionsSubscription: Subscription;

  private accountSubscription: Subscription;

  account: Account;

  @ViewChild('form') formComponent: AccountFormComponent;

  constructor(private router: Router, private route: ActivatedRoute, private store: AccountingStore) {}

  ngOnInit() {
    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['id']))
      .subscribe(this.store);

    this.accountSubscription = this.store.select(fromAccounting.getSelectedAccount)
      .subscribe(account => this.account = account);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.accountSubscription.unsubscribe();
  }

  onSave(account: Account) {
    this.store.dispatch({ type: UPDATE, payload: {
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

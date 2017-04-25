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
import {OnInit, Component, OnDestroy} from '@angular/core';
import {Account} from '../../../services/accounting/domain/account.model';
import {ActivatedRoute} from '@angular/router';
import * as fromAccounting from '../store';
import * as fromRoot from '../../reducers';
import {Subscription} from 'rxjs';
import {AccountingStore} from '../store/index';
import {DELETE, SelectAction} from '../store/account/account.actions';
import {Observable} from 'rxjs/Observable';
import {FimsPermission} from '../../../services/security/authz/fims-permission.model';
import {TranslateService} from '@ngx-translate/core';
import {TdDialogService} from '@covalent/core';

@Component({
  templateUrl: './account.detail.component.html'
})
export class AccountDetailComponent implements OnInit, OnDestroy{

  private actionsSubscription: Subscription;

  private accountSubscription: Subscription;

  canDelete$: Observable<boolean>;

  account: Account;

  constructor(private route: ActivatedRoute, private dialogService: TdDialogService, private translate: TranslateService, private store: AccountingStore) {}

  ngOnInit(): void {
    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['id']))
      .subscribe(this.store);

    const account$: Observable<Account> = this.store.select(fromAccounting.getSelectedAccount)
      .filter(account => !!account);

    this.canDelete$ = Observable.combineLatest(
      this.store.select(fromRoot.getPermissions),
      account$,
      (permissions, account: Account) => ({
        hasPermission: this.hasDeletePermission(permissions),
        isAccountClosed: account.state === 'CLOSED'
      }))
      .map(result => result.hasPermission && result.isAccountClosed);

    this.accountSubscription = account$
      .subscribe(account => this.account = account);
  }

  private hasDeletePermission(permissions: FimsPermission[]): boolean {
    return permissions.filter(permission =>
        permission.id === 'accounting_accounts' &&
        permission.accessLevel === 'DELETE'
      ).length > 0
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.accountSubscription.unsubscribe();
  }

  confirmDeletion(): Observable<boolean>{
    let message = 'Do you want to delete this account?';
    let title = 'Confirm deletion';
    let button = 'DELETE ACCOUNT';

    return this.translate.get([title, message, button])
      .flatMap(result =>
        this.dialogService.openConfirm({
          message: result[message],
          title: result[title],
          acceptButton: result[button]
        }).afterClosed()
      );
  }

  deleteAccount(): void {
    this.confirmDeletion()
      .filter(accept => accept)
      .subscribe(() => {
        this.store.dispatch({ type: DELETE, payload: {
          account: this.account,
          activatedRoute: this.route
        }})
      });
  }

}

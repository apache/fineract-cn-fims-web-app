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

import {Component, OnDestroy} from '@angular/core';
import * as fromTeller from './store/index';
import * as fromRoot from '../reducers/index';
import {TellerStore} from './store/index';
import {LOCK_DRAWER} from './store/teller.actions';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {SEARCH} from '../reducers/customer/customer.actions';
import {Customer} from '../../services/customer/domain/customer.model';
import {Observable} from 'rxjs/Observable';
import {Teller} from '../../services/teller/domain/teller.model';

@Component({
  templateUrl: './teller.index.component.html'
})
export class TellerIndexComponent implements OnDestroy {

  private tellerCodeSubscription: Subscription;

  private teller: Teller;

  customer$: Observable<Customer[]>;

  constructor(private router: Router, private route: ActivatedRoute, private store: TellerStore) {
    this.tellerCodeSubscription = store.select(fromTeller.getAuthenticatedTeller)
      .subscribe(teller => this.teller = teller);

    this.customer$ = store.select(fromRoot.getSearchCustomers);
  }

  ngOnDestroy(): void {
    this.tellerCodeSubscription.unsubscribe();
  }

  logout(): void {
    this.store.dispatch({
      type: LOCK_DRAWER,
      payload: {
        tellerCode: this.teller.code
      }
    })
  }

  showCustomer(identifier: string): void {
    this.router.navigate(['customers/detail', identifier], { relativeTo: this.route })
  }

  search(searchTerm: string): void {
    this.store.dispatch({
      type: SEARCH,
      payload: {
        searchTerm
      }
    })
  }

  clearSearch(): void {}
}

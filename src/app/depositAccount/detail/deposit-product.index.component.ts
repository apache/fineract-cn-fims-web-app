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
import {DepositAccountStore} from '../store/index';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {SelectAction} from '../store/product.actions';

@Component({
  templateUrl: './deposit-product.index.component.html'
})
export class DepositProductIndexComponent implements OnInit, OnDestroy{

  private actionsSubscription: Subscription;

  constructor(private route: ActivatedRoute, private store: DepositAccountStore) {}

  ngOnInit(): void {
    this.actionsSubscription = this.route.params
      .map(params => new SelectAction(params['id']))
      .subscribe(this.store);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
  }
}

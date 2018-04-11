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
import {DepositAccountStore} from '../../../store/index';
import {CREATE} from '../../../store/dividends/dividend.actions';
import * as fromDepositAccounts from './../../../store';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {DistributeDividendFormData} from './form.component';

@Component({
  templateUrl: './create.component.html'
})
export class CreateDividendFormComponent implements OnInit {

  productDefinitionId$: Observable<string>;

  constructor(private router: Router, private route: ActivatedRoute, private store: DepositAccountStore) {}

  ngOnInit() {
    this.productDefinitionId$ = this.store.select(fromDepositAccounts.getSelectedProduct)
      .filter(product => !!product)
      .map(product => product.identifier);
  }

  save(payload: DistributeDividendFormData): void {
    this.store.dispatch({
      type: CREATE,
      payload: {
        productDefinitionId: payload.productDefinitionId,
        dividendDistribution: {
          dueDate: payload.dueDate,
          dividendRate: payload.dividendRate
        },
        activatedRoute: this.route
      }
    });
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

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
import * as fromDeposits from '../../store/index';
import {DepositsStore} from '../../store/index';
import {Observable} from 'rxjs/Observable';
import {ProductInstance} from '../../../../services/depositAccount/domain/instance/product-instance.model';
import {IssuingCount} from '../../../../services/cheque/domain/issuing-count.model';
import {ISSUE_CHEQUES} from '../../store/deposit.actions';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  templateUrl: './cheques.component.html'
})
export class IssueChequeComponent implements OnInit {

  depositInstance$: Observable<ProductInstance>;

  constructor(private store: DepositsStore, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.depositInstance$ = this.store.select(fromDeposits.getSelectedDepositInstance);
  }

  issueCheques(issuingCount: IssuingCount): void {
    this.store.dispatch({
      type: ISSUE_CHEQUES,
      payload: {
        issuingCount,
        activatedRoute: this.route
      }
    });
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}

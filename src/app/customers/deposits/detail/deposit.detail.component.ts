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
import {ProductInstance} from '../../../services/depositAccount/domain/instance/product-instance.model';
import {Observable} from 'rxjs/Observable';
import * as fromDeposits from '../store/index';
import {DepositsStore} from '../store/index';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  templateUrl: './deposit.detail.component.html'
})
export class DepositDetailComponent implements OnInit {

  depositInstance$: Observable<ProductInstance>;

  constructor(private router: Router, private route: ActivatedRoute, private store: DepositsStore) {}

  ngOnInit(): void {
    this.depositInstance$ = this.store.select(fromDeposits.getSelectedDepositInstance);
  }

  issueCheques(): void {
    this.router.navigate(['cheques'], { relativeTo: this.route });
  }
}

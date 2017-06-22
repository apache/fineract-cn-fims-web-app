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

import {Component, OnInit, ViewChild} from '@angular/core';
import {DepositFormComponent} from './form.component';
import {Customer} from '../../../../services/customer/domain/customer.model';
import {ProductInstance} from '../../../../services/depositAccount/domain/instance/product-instance.model';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromDeposits from '../store/index';
import {DepositsStore} from '../store/index';
import * as fromCustomers from '../../store/index';
import {Observable} from 'rxjs/Observable';
import {UPDATE} from '../store/deposit.actions';

@Component({
  templateUrl: './edit.component.html'
})
export class DepositEditComponent implements OnInit {

  @ViewChild('form') formComponent: DepositFormComponent;

  customer$: Observable<Customer>;

  productInstance$: Observable<ProductInstance>;

  constructor(private router: Router, private route: ActivatedRoute, private depositsStore: DepositsStore) {}

  ngOnInit(): void {
    this.customer$ = this.depositsStore.select(fromCustomers.getSelectedCustomer);
    this.productInstance$ = this.depositsStore.select(fromDeposits.getSelectedDepositInstance);
  }

  onSave(productInstance: ProductInstance): void {
    this.depositsStore.dispatch({ type: UPDATE, payload: {
      productInstance,
      activatedRoute: this.route
    }});
  }

  onCancel(): void{
    this.navigateAway();
  }

  navigateAway(): void{
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

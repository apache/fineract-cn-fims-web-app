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
import {Component} from '@angular/core';
import {PayrollConfiguration} from '../../../../services/payroll/domain/payroll-configuration.model';
import {Observable} from 'rxjs/Observable';
import * as fromCustomers from '../../../store/index';
import {CustomersStore} from '../../../store/index';
import {ActivatedRoute, Router} from '@angular/router';
import {UPDATE} from '../../../store/payroll/payroll.actions';
import {ProductInstance} from '../../../../services/depositAccount/domain/instance/product-instance.model';
import {DepositAccountService} from '../../../../services/depositAccount/deposit-account.service';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateCustomerPayrollFormComponent {

  private customerId: string;

  distribution$: Observable<PayrollConfiguration>;

  productInstances$: Observable<ProductInstance[]>;

  constructor(private store: CustomersStore, private router: Router, private route: ActivatedRoute,
              private depositService: DepositAccountService) {
    this.distribution$ = store.select(fromCustomers.getPayrollDistribution);

    this.productInstances$ = this.store.select(fromCustomers.getSelectedCustomer)
      .do(customer => this.customerId = customer.identifier)
      .switchMap(customer => this.depositService.fetchProductInstances(customer.identifier))
      .map(instances => instances.filter(instance => instance.state === 'ACTIVE'));
  }

  onSave(distribution: PayrollConfiguration): void {
    this.store.dispatch({
      type: UPDATE,
      payload: {
        customerId: this.customerId,
        distribution,
        activatedRoute: this.route
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

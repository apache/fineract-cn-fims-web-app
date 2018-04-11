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
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IdentificationCardScan} from '../../../../../services/customer/domain/identification-card-scan.model';
import * as fromCustomers from '../../../../store/index';
import {CustomersStore} from '../../../../store/index';
import {IdentificationCardScanComponent, IdentityCardScanFormData} from './scan.form.component';
import {CREATE, RESET_FORM} from '../../../../store/identityCards/scans/scans.actions';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Error} from '../../../../../services/domain/error.model';
import {Subscription} from 'rxjs/Subscription';
import {IdentificationCard} from '../../../../../services/customer/domain/identification-card.model';
import {Customer} from '../../../../../services/customer/domain/customer.model';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateIdentificationCardScanComponent implements OnInit, OnDestroy {

  private customerSubscription: Subscription;

  private identificationCardSubscription: Subscription;

  customer: Customer;

  identificationCard: IdentificationCard;

  error$: Observable<Error>;

  @ViewChild('form') formComponent: IdentificationCardScanComponent;

  constructor(private router: Router, private route: ActivatedRoute, private customersStore: CustomersStore) {}

  ngOnInit(): void {
    this.error$ = this.customersStore.select(fromCustomers.getCustomerIdentificationCardScanFormError);

    this.customerSubscription = this.customersStore.select(fromCustomers.getSelectedCustomer)
      .subscribe(customer => this.customer = customer);

    this.identificationCardSubscription = this.customersStore.select(fromCustomers.getSelectedIdentificationCard)
      .subscribe(identificationCard => this.identificationCard = identificationCard);
  }

  ngOnDestroy(): void {
    this.customerSubscription.unsubscribe();
    this.identificationCardSubscription.unsubscribe();

    this.customersStore.dispatch({ type: RESET_FORM });
  }

  onSave(formData: IdentityCardScanFormData): void {
    const scan: IdentificationCardScan = {
      identifier: formData.identifier,
      description: formData.description
    };

    this.customersStore.dispatch({
      type: CREATE,
      payload: {
        customerIdentifier: this.customer.identifier,
        identificationCardNumber: this.identificationCard.number,
        scan,
        file: formData.file,
        activatedRoute: this.route
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}

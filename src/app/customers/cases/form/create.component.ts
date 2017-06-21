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

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Case} from '../../../../services/portfolio/domain/case.model';
import {Customer} from '../../../../services/customer/domain/customer.model';
import {CaseFormComponent} from './form.component';
import * as fromCases from '../store/index';
import {CasesStore} from '../store/index';
import * as fromCustomers from '../../store/index';
import {Subscription} from 'rxjs';
import {CREATE, RESET_FORM} from '../store/case.actions';
import {Error} from '../../../../services/domain/error.model';
import {FimsCase} from '../store/model/fims-case.model';
import {Product} from '../../../../services/portfolio/domain/product.model';
import {PortfolioService} from '../../../../services/portfolio/portfolio.service';
import {Observable} from 'rxjs/Observable';

@Component({
  templateUrl: './create.component.html'
})
export class CaseCreateComponent implements OnInit, OnDestroy{

  private customerSubscription: Subscription;

  private formStateSubscription: Subscription;

  @ViewChild('form') formComponent: CaseFormComponent;

  products$: Observable<Product[]>;

  customer: Customer;

  caseInstance: FimsCase = {
    currentState: 'CREATED',
    identifier: '',
    productIdentifier: '',
    parameters: {
      customerIdentifier: '',
      maximumBalance: 0,
      paymentCycle: {
        alignmentDay: null,
        alignmentMonth: null,
        alignmentWeek: null,
        period: 1,
        temporalUnit: 'MONTHS',
      },
      termRange: {
        temporalUnit: 'MONTHS',
        maximum: 1
      },
      creditWorthinessSnapshots: []
    },
    accountAssignments: []
  };

  constructor(private router: Router, private route: ActivatedRoute, private casesStore: CasesStore, private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.customerSubscription = this.casesStore.select(fromCustomers.getSelectedCustomer)
      .subscribe(customer => this.customer = customer);

    this.formStateSubscription = this.casesStore.select(fromCases.getCaseFormError)
      .filter((error: Error) => !!error)
      .subscribe((error: Error) => {
        let detailForm = this.formComponent.detailForm;
        let errors = detailForm.form.get('identifier').errors || {};
        errors['unique'] = true;
        detailForm.form.get('identifier').setErrors(errors);
        this.formComponent.detailsStep.open();
      });

    this.products$ = this.portfolioService.findAllProducts(false)
      .map(productPage => productPage.elements);
  }

  ngOnDestroy(): void {
    this.customerSubscription.unsubscribe();
    this.formStateSubscription.unsubscribe();

    this.casesStore.dispatch({ type: RESET_FORM })
  }

  onSave(caseToSave: Case): void {
    this.casesStore.dispatch({ type: CREATE, payload: {
      productId: caseToSave.productIdentifier,
      caseInstance: caseToSave,
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

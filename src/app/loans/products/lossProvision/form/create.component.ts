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
import {LossProvisionStep} from '../../../../services/portfolio/domain/loss-provision-step.model';
import * as fromPortfolio from '../../store/index';
import {PortfolioStore} from '../../store/index';
import {ActivatedRoute, Router} from '@angular/router';
import {UPDATE} from '../../store/lossProvision/loss-provision.actions';
import {Observable} from 'rxjs/Observable';
import {FimsProduct} from '../../store/model/fims-product.model';

@Component({
  templateUrl: './create.component.html'
})
export class CreateProductLossProvisionFormComponent {

  product$: Observable<FimsProduct>;

  lossProvisionSteps$: Observable<LossProvisionStep[]>;

  constructor(private store: PortfolioStore, private router: Router, private route: ActivatedRoute) {
    this.product$ = store.select(fromPortfolio.getSelectedProduct);

    this.lossProvisionSteps$ = store.select(fromPortfolio.getProductLossProvisionConfiguration)
      .map(configuration => configuration.lossProvisionSteps);
  }

  save(productIdentifier: string, lossProvisionSteps: LossProvisionStep[]): void {
    this.store.dispatch({
      type: UPDATE,
      payload: {
        productIdentifier,
        configuration: {
          lossProvisionSteps
        },
        activatedRoute: this.route
      }
    });
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

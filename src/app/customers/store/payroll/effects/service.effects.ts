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
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {CustomerService} from '../../../../services/customer/customer.service';
import {Observable} from 'rxjs/Observable';
import * as payrollActions from '../payroll.actions';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';

@Injectable()
export class CustomerPayrollApiEffects {

  constructor(private actions$: Actions, private customerService: CustomerService) { }

  @Effect()
  updatePayroll$: Observable<Action> = this.actions$
    .ofType(payrollActions.UPDATE)
    .map((action: payrollActions.UpdatePayrollDistributionAction) => action.payload)
    .mergeMap(payload =>
      this.customerService.setPayrollDistribution(payload.customerId, payload.distribution)
        .map(() => new payrollActions.UpdatePayrollDistributionSuccessAction(payload))
        .catch((error) => of(new payrollActions.UpdatePayrollDistributionFailAction(error)))
    );

}

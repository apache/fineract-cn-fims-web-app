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
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import * as payrollActions from '../payroll.actions';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import {PayrollService} from '../../../../services/payroll/payroll.service';

@Injectable()
export class CustomerPayrollApiEffects {

  @Effect()
  updatePayroll$: Observable<Action> = this.actions$
    .ofType(payrollActions.UPDATE)
    .map((action: payrollActions.UpdatePayrollDistributionAction) => action.payload)
    .mergeMap(payload =>
      this.payrollService.setPayrollConfiguration(payload.customerId, payload.distribution)
        .map(() => new payrollActions.UpdatePayrollDistributionSuccessAction(payload))
        .catch((error) => of(new payrollActions.UpdatePayrollDistributionFailAction(error)))
    );

  constructor(private actions$: Actions, private payrollService: PayrollService) { }

}

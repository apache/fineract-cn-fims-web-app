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
import {Actions, Effect, toPayload} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import {of} from 'rxjs/observable/of';
import * as commandActions from '../commands.actions';
import {CustomerService} from '../../../../../services/customer/customer.service';

@Injectable()
export class CustomerCommandApiEffects {

  constructor(private actions$: Actions, private customerService: CustomerService) { }

  @Effect()
  loadCommands$: Observable<Action> = this.actions$
    .ofType(commandActions.LOAD_ALL)
    .map(toPayload)
    .mergeMap(customerId =>
      this.customerService.listCustomerCommand(customerId)
        .map(commands => new commandActions.LoadAllCompleteAction(commands))
        .catch((error) => of(new commandActions.LoadAllCompleteAction([])))
    );

}

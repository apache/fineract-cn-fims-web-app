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
import {Action} from '@ngrx/store';
import * as denominationActions from '../denomination.actions';
import {of} from 'rxjs/observable/of';
import {TellerService} from '../../../../../services/teller/teller-service';

@Injectable()
export class TellerDenominationApiEffects {

  @Effect()
  loadDenomination$: Observable<Action> = this.actions$
    .ofType(denominationActions.LOAD_DENOMINATION)
    .map((action: denominationActions.LoadDenominationAction) => action.payload)
    .mergeMap(payload =>
      this.tellerService.fetchTellerDenominations(payload.officeId, payload.tellerCode)
        .map(teller => new denominationActions.LoadDenominationSuccessAction(teller))
        .catch(error => of(new denominationActions.LoadDenominationSuccessAction([])))
    );

  @Effect()
  createDenomination$: Observable<Action> = this.actions$
    .ofType(denominationActions.CREATE_DENOMINATION)
    .map((action: denominationActions.CreateDenominationAction) => action.payload)
    .mergeMap(payload =>
      this.tellerService.saveTellerDenomination(payload.officeId, payload.tellerCode, payload.denomination)
        .map(() => new denominationActions.CreateDenominationSuccessAction(payload))
        .catch((error) => of(new denominationActions.CreateDenominationFailAction(error)))
    );

  constructor(private actions$: Actions, private tellerService: TellerService) {}

}

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
import {of, Observable} from 'rxjs';
import {Action} from '@ngrx/store';
import {Actions, Effect} from '@ngrx/effects';
import {ChequeService} from '../../../../services/cheque/cheque.service';
import {Injectable} from '@angular/core';
import * as chequeActions from '../cheque.actions';
import {ChequeCRUDActions} from '../cheque.actions';
import {LoadAllAction} from '../../../../common/store/action-creator/actions';
import {map, mergeMap, catchError} from 'rxjs/operators';

@Injectable()
export class ChequeApiEffects {

  @Effect()
  loadAllChequesByState$: Observable<Action> = this.actions$
    .ofType(ChequeCRUDActions.LOAD_ALL).pipe(
    map((action: LoadAllAction) => action.payload),
    mergeMap(payload =>
      this.chequeService.fetch(payload.state).pipe(
        map(cheques => ChequeCRUDActions.loadAllCompleteAction({
          resources: cheques,
          data: payload.data
        })),
        catchError(() => of(ChequeCRUDActions.loadAllCompleteAction({
          resources: [],
          data: payload.data
        }))))
    ));

  @Effect()
  processCheque$: Observable<Action> = this.actions$
    .ofType(chequeActions.PROCESS).pipe(
    map((action: chequeActions.ProcessAction) => action.payload),
    mergeMap(payload =>
      this.chequeService.process(payload.chequeIdentifier, payload.command).pipe(
        map(() => new chequeActions.ProcessSuccessAction(payload)),
        catchError(error => of(new chequeActions.ProcessFailAction(error))))
    ));

  constructor(private actions$: Actions, private chequeService: ChequeService) {}

}

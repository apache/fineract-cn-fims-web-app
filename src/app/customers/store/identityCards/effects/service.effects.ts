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

import {of} from 'rxjs/observable/of';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import {Actions, Effect} from '@ngrx/effects';
import {CustomerService} from '../../../../../services/customer/customer.service';
import {Injectable} from '@angular/core';
import * as identificationCards from '../identity-cards.actions';

@Injectable()
export class CustomerIdentificationCardApiEffects {

  constructor(private actions$: Actions, private customerService: CustomerService) {}

  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .ofType(identificationCards.LOAD_ALL)
    .debounceTime(300)
    .map((action: identificationCards.LoadAllAction) => action.payload)
    .switchMap(id => {
      const nextSearch$ = this.actions$.ofType(identificationCards.LOAD_ALL).skip(1);

      return this.customerService.fetchIdentificationCards(id)
        .takeUntil(nextSearch$)
        .map(identifications => new identificationCards.LoadAllCompleteAction(identifications))
        .catch(() => of(new identificationCards.LoadAllCompleteAction([])));
    });

  @Effect()
  createIdentificationCard$: Observable<Action> = this.actions$
    .ofType(identificationCards.CREATE)
    .map((action: identificationCards.CreateIdentityCardAction) => action.payload)
    .mergeMap(payload =>
      this.customerService.createIdentificationCard(payload.customerId, payload.identificationCard)
        .map(() => new identificationCards.CreateIdentityCardSuccessAction({
          resource: payload.identificationCard,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new identificationCards.CreateIdentityCardFailAction(error)))
    );

  @Effect()
  updateIdentificationCard$: Observable<Action> = this.actions$
    .ofType(identificationCards.UPDATE)
    .map((action: identificationCards.UpdateIdentityCardAction) => action.payload)
    .mergeMap(payload =>
      this.customerService.updateIdentificationCard(payload.customerId, payload.identificationCard)
        .map(() => new identificationCards.UpdateIdentityCardSuccessAction({
          resource: payload.identificationCard,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new identificationCards.UpdateIdentityCardFailAction(error)))
    );

  @Effect()
  deleteIdentificationCard$: Observable<Action> = this.actions$
    .ofType(identificationCards.DELETE)
    .map((action: identificationCards.DeleteIdentityCardAction) => action.payload)
    .mergeMap(payload =>
      this.customerService.deleteIdentificationCard(payload.customerId, payload.identificationCard.number)
        .map(() => new identificationCards.DeleteIdentityCardSuccessAction({
          resource: payload.identificationCard,
          activatedRoute: payload.activatedRoute
        }))
        .catch((error) => of(new identificationCards.DeleteIdentityCardFailAction(error)))
    );

}

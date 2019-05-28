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
import { of, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CustomerService } from '../../../../../services/customer/customer.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import * as identificationCardScans from '../scans.actions';
import { map, debounceTime, mergeMap, skip, takeUntil, switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class CustomerIdentificationCardScanApiEffects {

  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .pipe(ofType(identificationCardScans.LOAD_ALL),
      debounceTime(300),
      map((action: identificationCardScans.LoadAllAction) => action.payload),
      switchMap(payload => {
        const nextSearch$ = this.actions$.pipe(ofType(identificationCardScans.LOAD_ALL),(skip(1)));

        return this.customerService.fetchIdentificationCardScans(payload.customerIdentifier, payload.identificationCardNumber)
          .pipe(
            takeUntil(nextSearch$),
            map(scans => new identificationCardScans.LoadAllCompleteAction(scans)),
            catchError(() => of(new identificationCardScans.LoadAllCompleteAction([]))));
      }));

  @Effect()
  createIdentificationCardScan$: Observable<Action> = this.actions$
    .pipe(ofType(identificationCardScans.CREATE),
      map((action: identificationCardScans.CreateIdentityCardScanAction) => action.payload),
      mergeMap(payload =>
        this.customerService.uploadIdentificationCardScan(payload.customerIdentifier, payload.identificationCardNumber,
          payload.scan, payload.file).pipe(
            map(() => new identificationCardScans.CreateIdentityCardScanSuccessAction({
              resource: payload.scan,
              activatedRoute: payload.activatedRoute
            })),
            catchError((error) => of(new identificationCardScans.CreateIdentityCardScanFailAction(error))))
      ));

  @Effect()
  deleteIdentificationCardScan$: Observable<Action> = this.actions$
    .pipe(ofType(identificationCardScans.DELETE),
      map((action: identificationCardScans.DeleteIdentityCardScanAction) => action.payload),
      mergeMap(payload =>
        this.customerService.deleteIdentificationCardScan(payload.customerIdentifier, payload.identificationCardNumber,
          payload.scan.identifier).pipe(
            map(() => new identificationCardScans.DeleteIdentityCardScanSuccessAction({
              resource: payload.scan,
              activatedRoute: undefined
            })),
            catchError((error) => of(new identificationCardScans.DeleteIdentityCardScanFailAction(error))))
      ));

  constructor(private actions$: Actions, private customerService: CustomerService) { }
}

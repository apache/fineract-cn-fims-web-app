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

import * as fromRoot from '../../store';
import * as fromTellers from '../store/teller/tellers.reducer';
import * as fromDenominations from '../store/teller/denomination/denominations.reducer';
import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../store/index';
import {createSelector} from 'reselect';
import {
  createResourceReducer,
  getResourceAll,
  getResourceEntities,
  getResourceLoadedAt,
  getResourceSelected,
  ResourceState
} from '../../common/store/resource.reducer';
import {createFormReducer, FormState, getFormError} from '../../common/store/form.reducer';

export interface State extends fromRoot.State {
  offices: ResourceState;
  officeForm: FormState;
  tellers: ResourceState;
  tellerForm: FormState;
  denominations: fromDenominations.State;
}

const reducers = {
  offices: createResourceReducer('Office'),
  officeForm: createFormReducer('Office'),
  tellers: createResourceReducer('Office Teller', fromTellers.reducer, 'code'),
  tellerForm: createFormReducer('Office Teller'),
  denominations: fromDenominations.reducer
};

export const officeModuleReducer: ActionReducer<State> = createReducer(reducers);

export class OfficesStore extends Store<State> {}

export function officeStoreFactory(appStore: Store<fromRoot.State>) {
  appStore.replaceReducer(officeModuleReducer);
  return appStore;
}

export const getOfficesState = (state: State) => state.offices;

export const getOfficeFormState = (state: State) => state.officeForm;
export const getOfficeFormError = createSelector(getOfficeFormState, getFormError);

export const getOfficeEntities = createSelector(getOfficesState, getResourceEntities);
export const getOfficesLoadedAt = createSelector(getOfficesState, getResourceLoadedAt);
export const getSelectedOffice = createSelector(getOfficesState, getResourceSelected);

export const getTellerState = (state: State) => state.tellers;

export const getTellerFormState = (state: State) => state.tellerForm;
export const getTellerFormError = createSelector(getTellerFormState, getFormError);

export const getAllTellerEntities = createSelector(getTellerState, getResourceAll);

export const getTellersLoadedAt = createSelector(getTellerState, getResourceLoadedAt);
export const getSelectedTeller = createSelector(getTellerState, getResourceSelected);

export const getDenominationState = (state: State) => state.denominations;
export const getDenominationsEntities = createSelector(getDenominationState, fromDenominations.getDenominationEntities);

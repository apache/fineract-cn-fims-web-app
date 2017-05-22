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

import * as fromRoot from '../../reducers';
import {ActionReducer, Store} from '@ngrx/store';
import {createReducer} from '../../reducers/index';
import {createSelector} from 'reselect';
import {
  createResourceReducer,
  getResourceEntities,
  getResourceLoadedAt,
  getResourceSelected,
  ResourceState
} from '../../../components/store/resource.reducer';
import {createFormReducer, FormState, getFormError} from '../../../components/store/form.reducer';

export interface State extends fromRoot.State{
  offices: ResourceState;
  officeForm: FormState;
}

const reducers = {
  offices: createResourceReducer('Office'),
  officeForm: createFormReducer('Office')
};

export const officeModuleReducer: ActionReducer<State> = createReducer(reducers);

export const getOfficesState = (state: State) => state.offices;

export const getOfficeFormState = (state: State) => state.officeForm;
export const getOfficeFormError = createSelector(getOfficeFormState, getFormError);

export const getOfficeEntities = createSelector(getOfficesState, getResourceEntities);
export const getOfficesLoadedAt = createSelector(getOfficesState, getResourceLoadedAt);
export const getSelectedOffice = createSelector(getOfficesState, getResourceSelected);

export class OfficesStore extends Store<State>{}

export function officeStoreFactory(appStore: Store<fromRoot.State>){
  appStore.replaceReducer(officeModuleReducer);
  return appStore;
}

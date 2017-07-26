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

import * as security from './security.actions';
import {FimsPermission} from '../../../services/security/authz/fims-permission.model';

export interface State {
  permissions: FimsPermission[];
  loading: boolean;
}

const initialState: State = {
  permissions: [],
  loading: false
};

export function reducer(state = initialState, action: security.Actions): State {
  switch(action.type){

    case security.LOGIN_SUCCESS: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case security.PERMISSIONS_UPDATE_SUCCESS: {
      let permissions = action.payload;
      return Object.assign({}, state, {
        loading: false,
        permissions
      });
    }

    case security.PERMISSIONS_UPDATE_FAIL:
    case security.LOGOUT_SUCCESS: {
      return initialState;
    }

    default:
      return state;
  }
}

export const getPermissions = (state: State) => state.permissions;

export const getLoading = (state: State) => state.loading;

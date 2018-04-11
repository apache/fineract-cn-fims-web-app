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
import * as provisionActions from './loss-provision.actions';
import {LossProvisionConfiguration} from '../../../../services/portfolio/domain/loss-provision-configuration.model';

export interface State {
  configuration: LossProvisionConfiguration;
  loadedAt: number;
}

const initialState: State = {
  configuration: null,
  loadedAt: null
};

export function reducer(state: State = initialState, action: provisionActions.Actions): State {

  switch (action.type) {

    case provisionActions.LOAD: {
      const configuration: LossProvisionConfiguration = action.payload;

      return Object.assign({}, state, {
        configuration,
        loadedAt: Date.now()
      });
    }

    case provisionActions.UPDATE_SUCCESS: {
      const configuration: LossProvisionConfiguration = action.payload.configuration;

      return Object.assign({}, state, {
        configuration,
        loadedAt: state.loadedAt
      });
    }

    default: {
      return state;
    }
  }
}

export const getLossProvisionConfiguration = (state: State) => state.configuration;
export const getLossProvisionConfigurationLoadedAt = (state: State) => state.loadedAt;

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
import {PayrollConfiguration} from '../../../services/payroll/domain/payroll-configuration.model';
import * as payrollActions from './payroll.actions';
import {PayrollDistributionRoutePayload} from './payroll.actions';

export interface State {
  distribution: PayrollConfiguration;
  loadedAt: number;
}

const initialState: State = {
  distribution: null,
  loadedAt: null
};

export function reducer(state: State = initialState, action: payrollActions.Actions): State {

  switch (action.type) {

    case payrollActions.LOAD: {
      const distribution: PayrollConfiguration = action.payload;

      return {
        distribution,
        loadedAt: Date.now()
      };
    }

    case payrollActions.UPDATE_SUCCESS: {
      const payload: PayrollDistributionRoutePayload = action.payload;

      return {
        distribution: payload.distribution,
        loadedAt: state.loadedAt
      };
    }

    default: {
      return state;
    }
  }
}

export const getPayrollDistribution = (state: State) => state.distribution;
export const getPayrollDistributionLoadedAt = (state: State) => state.loadedAt;

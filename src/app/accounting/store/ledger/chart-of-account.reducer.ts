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

import {ChartOfAccountEntry} from '../../../../services/accounting/domain/chart-of-account-entry.model';
import * as ledger from './ledger.actions';

export interface State {
  chartOfAccountEntries: ChartOfAccountEntry[];
  loading: boolean;
}

const initialState: State = {
  chartOfAccountEntries: [],
  loading: false
};

export function reducer(state = initialState, action: ledger.Actions): State {

  switch (action.type) {

    case ledger.LOAD_CHART_OF_ACCOUNTS: {

      return Object.assign({}, state, {
        chartOfAccountEntries: [],
        loading: true
      });
    }

    case ledger.LOAD_CHART_OF_ACCOUNTS_COMPLETE: {
      const chartOfAccountEntries: ChartOfAccountEntry[] = action.payload;

      return {
        chartOfAccountEntries: chartOfAccountEntries,
        loading: false
      };
    }

    default: {
      return state;
    }
  }
}


export const getChartOfAccountEntries = (state: State) => state.chartOfAccountEntries;

export const getLoading = (state: State) => state.loading;

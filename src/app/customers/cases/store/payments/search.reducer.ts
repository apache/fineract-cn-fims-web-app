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

import * as paymentActions from './payment.actions';
import {PlannedPayment} from '../../../../../services/portfolio/domain/individuallending/planned-payment.model';
import {SearchPaymentsPayload} from './payment.actions';
import {PlannedPaymentPage} from '../../../../../services/portfolio/domain/individuallending/planned-payment-page.model';

export interface State {
  paymentPage: PlannedPaymentPage;
  loading: boolean;
  initialDisbursalDate: string;
}

const initialState: State = {
  paymentPage: {
    chargeNames: [],
    elements: [],
    totalElements: 0,
    totalPages: 0
  },
  loading: false,
  initialDisbursalDate: null
};

export function reducer(state = initialState, action: paymentActions.Actions): State {

  switch (action.type) {

    case paymentActions.SEARCH: {
      const payload: SearchPaymentsPayload = action.payload;

      return Object.assign({}, state, {
        paymentPage: initialState.paymentPage,
        initialDisbursalDate: payload.initialDisbursalDate,
        loading: true
      });
    }

    case paymentActions.SEARCH_COMPLETE: {
      const paymentsPage: PlannedPaymentPage = action.payload;

      return {
        paymentPage: paymentsPage,
        loading: false,
        initialDisbursalDate: state.initialDisbursalDate
      };
    }

    default: {
      return state;
    }
  }
}


export const getPaymentPage = (state: State) => state.paymentPage;

export const getLoading = (state: State) => state.loading;

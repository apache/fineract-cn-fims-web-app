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
  payments: PlannedPayment[];
  totalPages: number,
  totalElements: number,
  loading: boolean;
  initialDisbursalDate: string;
}

const initialState: State = {
  payments: [],
  totalPages: 0,
  totalElements: 0,
  loading: false,
  initialDisbursalDate: null
};

export function reducer(state = initialState, action: paymentActions.Actions): State {

  switch (action.type) {

    case paymentActions.SEARCH: {
      const payload: SearchPaymentsPayload = action.payload;

      return Object.assign({}, state, {
        initialDisbursalDate: payload.initialDisbursalDate,
        loading: true
      });
    }

    case paymentActions.SEARCH_COMPLETE: {
      const paymentsPage: PlannedPaymentPage = action.payload;

      return {
        payments: paymentsPage.elements,
        loading: false,
        totalElements: paymentsPage.totalElements,
        totalPages: paymentsPage.totalPages,
        initialDisbursalDate: state.initialDisbursalDate
      };
    }

    default: {
      return state;
    }
  }
}


export const getPayments = (state: State) => state.payments;

export const getLoading = (state: State) => state.loading;

export const getTotalPages = (state: State) => state.totalPages;

export const getTotalElements = (state: State) => state.totalElements;

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

import * as caseActions from './case.actions';
import {Error} from '../../../../services/domain/error.model';
import {Product} from '../../../../services/portfolio/domain/product.model';
import {FormState} from '../../../../common/store/form.reducer';

export interface State extends FormState {
  product: Product;
}

export const initialState: State = {
  error: null,
  product: null
};

export function reducer(state = initialState, action: caseActions.Actions): State {
  switch (action.type) {

    case caseActions.LOAD_PRODUCT_SUCCESS: {
      const product: Product = action.payload;
      return {
        error: state.error,
        product: product
      };
    }

    default:
      return state;

  }
}

export const getFormProduct = (state: State) => state.product;

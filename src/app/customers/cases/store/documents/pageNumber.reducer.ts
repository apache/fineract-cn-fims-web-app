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
import * as documentActions from './document.actions';
import {DeletePagePayload, UploadPagePayload} from './document.actions';

export interface State {
  pageNumbers: number[]
}

export const initialState: State = {
  pageNumbers: [],
};

export function reducer(state = initialState, action: documentActions.Actions): State {

  switch (action.type) {

    case documentActions.LOAD_ALL_PAGES: {
      return initialState;
    }

    case documentActions.LOAD_ALL_PAGES_COMPLETE: {
      const pageNumbers: number[] = action.payload;

      return {
        pageNumbers
      };
    }

    case documentActions.UPLOAD_PAGE_SUCCESS: {
      const payload: UploadPagePayload = action.payload;

      return {
        pageNumbers: state.pageNumbers.concat(payload.pageNumber)
      }
    }

    case documentActions.DELETE_PAGE_SUCCESS: {
      const payload: DeletePagePayload = action.payload;

      return {
        pageNumbers: state.pageNumbers.filter(pageNumber => pageNumber !== payload.pageNumber)
      }
    }

    default: {
      return state;
    }
  }
}

export const getPageNumbers = (state: State) => state.pageNumbers;

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

import {createFormReducer, FormState} from './form.reducer';
import {Error} from '../../services/domain/error.model';
import {Action} from '@ngrx/store';

class CreateSuccessAction implements Action {
  readonly type = '[Test] Create Success';

  constructor() {}
}

class CreateFailAction implements Action {
  readonly type = '[Test] Create Fail';

  constructor(public payload: Error) {}
}

class UpdateSuccessAction implements Action {
  readonly type = '[Test] Update Success';

  constructor() {}
}

class UpdateFailAction implements Action {
  readonly type = '[Test] Update Fail';

  constructor(public payload: Error) {}
}

describe('Resources Reducer', () => {

  let reducer;

  beforeEach(() => {
    reducer = createFormReducer('Test');
  });

  it('should set error on Create Fail Action', () => {
    const expectedResult: FormState = {
      error: new Error(409, 'test', 'test')
    };

    const result = reducer(undefined, new CreateFailAction(expectedResult.error));

    expect(result).toEqual(expectedResult);
  });

  it('should set error on Update Fail Action', () => {
    const expectedResult: FormState = {
      error: new Error(409, 'test', 'test')
    };

    const result = reducer(undefined, new UpdateFailAction(expectedResult.error));

    expect(result).toEqual(expectedResult);
  });

  it('should reset error on Create Success Action', () => {
    const expectedResult: FormState = {};

    const result = reducer(undefined, new CreateSuccessAction());

    expect(result).toEqual(expectedResult);
  });

  it('should reset error on Update Success Action', () => {
    const expectedResult: FormState = {};

    const result = reducer(undefined, new UpdateSuccessAction());

    expect(result).toEqual(expectedResult);
  });
});

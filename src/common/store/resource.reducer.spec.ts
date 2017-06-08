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

import {
  createResourceReducer, CreateResourceSuccessPayload, DeleteResourceSuccessPayload, LoadResourcePayload, ResourceState,
  UpdateResourceSuccessPayload
} from './resource.reducer';
import {Action} from '@ngrx/store';

class LoadAction implements Action {
  readonly type = '[Test] Load';

  constructor(public payload: LoadResourcePayload) { }
}

class SelectAction implements Action {
  readonly type = '[Test] Select';

  constructor(public payload: string) { }
}

class CreateSuccessAction implements Action {
  readonly type = '[Test] Create Success';

  constructor(public payload: CreateResourceSuccessPayload) { }
}

class UpdateSuccessAction implements Action {
  readonly type = '[Test] Update Success';

  constructor(public payload: UpdateResourceSuccessPayload) { }
}

class DeleteSuccessAction implements Action {
  readonly type = '[Test] Delete Success';

  constructor(public payload: DeleteResourceSuccessPayload) { }
}

describe('Resources Reducer', () => {

  let reducer;

  beforeEach(() => {
    reducer = createResourceReducer('Test');
  });

  it('should set selected id', () => {
    const expectedResult: ResourceState = {
      selectedId: 'test',
      entities: {},
      loadedAt: {},
      ids: [],
    };

    const result = reducer(undefined, new SelectAction('test'));

    expect(result).toEqual(expectedResult);
  });

  it('should add resource on load', () => {
    spyOn(Date, 'now').and.returnValue(1000);

    const resource = {
      identifier: 'test',
      name: 'test'
    };

    const expectedResult: ResourceState = {
      selectedId: null,
      entities: {
        'test': resource
      },
      loadedAt: {
        'test': 1000
      },
      ids: ['test'],
    };

    const result = reducer(undefined, new LoadAction({
      resource: resource
    }));

    expect(result).toEqual(expectedResult);
  });

  it('should add resource when create success', () => {
    const resource = {
      identifier: 'test',
      name: 'test'
    };

    const expectedResult: ResourceState = {
      selectedId: null,
      entities: {
        'test': resource
      },
      loadedAt: {},
      ids: ['test'],
    };

    const result = reducer(undefined, new CreateSuccessAction({
      resource: resource,
      activatedRoute: null
    }));

    expect(result).toEqual(expectedResult);
  });

  it('should update resource when update success', () => {
    const updatedResource = {
      identifier: 'test',
      name: 'newValue'
    };

    const initialState: ResourceState = {
      selectedId: null,
      entities: {
        'test': {
          name: 'oldValue'
        }
      },
      loadedAt: {},
      ids: ['test'],
    };

    const expectedResult: ResourceState = {
      selectedId: null,
      entities: {
        'test': updatedResource
      },
      loadedAt: {},
      ids: ['test'],
    };

    const result = reducer(initialState, new UpdateSuccessAction({
      resource: updatedResource,
      activatedRoute: null
    }));

    expect(result).toEqual(expectedResult);
  });

  it('should delete resource when delete success', () => {

  });

  it('should delegate to wrapper reducer on unhandled action', () => {

  });

});

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

import * as command from './commands.actions';
import {Command} from '../../../../services/customer/domain/command.model';

export interface State {
  commands: Command[];
}

export const initialState: State = {
  commands: []
};

export function reducer(state = initialState, action: command.Actions): State {

  switch (action.type) {

    case command.LOAD_ALL: {
      return initialState
    }

    case command.LOAD_ALL_COMPLETE: {
      const commands = action.payload;

      return {
        commands: commands
      };
    }

    default: {
      return state;
    }
  }
}

export const getCommands = (state: State) => state.commands;

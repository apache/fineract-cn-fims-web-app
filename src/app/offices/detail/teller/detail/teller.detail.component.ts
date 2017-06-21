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

import {Component, OnInit} from '@angular/core';
import * as fromOffices from '../../../store/index';
import {OfficesStore} from '../../../store/index';
import {Teller} from '../../../../../services/teller/domain/teller.model';
import {Observable} from 'rxjs/Observable';

@Component({
  templateUrl: './teller.detail.component.html'
})
export class OfficeTellerDetailComponent implements OnInit {

  teller$: Observable<Teller>;

  isClosed$: Observable<boolean>;

  constructor(private store: OfficesStore) {}

  ngOnInit(): void {
    this.teller$ = this.store.select(fromOffices.getSelectedTeller)
      .filter(teller => !!teller);

    this.isClosed$ = this.teller$
      .map(teller => teller.state === 'CLOSED');

  }

}

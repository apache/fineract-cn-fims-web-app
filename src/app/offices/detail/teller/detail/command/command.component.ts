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

import {Component, OnDestroy, OnInit} from '@angular/core';
import * as fromOffices from '../../../../store/index';
import {Observable} from 'rxjs/Observable';
import {
  Action,
  TellerManagementCommand
} from '../../../../../../services/teller/domain/teller-management-command.model';
import {Teller} from '../../../../../../services/teller/domain/teller.model';
import {OfficesStore} from '../../../../store/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Office} from '../../../../../../services/office/domain/office.model';
import {Subscription} from 'rxjs/Subscription';
import {EXECUTE_COMMAND} from '../../../../store/teller/teller.actions';

@Component({
  templateUrl: './command.component.html'
})
export class OfficeTellerCommandComponent implements OnInit, OnDestroy {

  private officeSubscription: Subscription;

  private tellerSubscription: Subscription;

  office: Office;

  teller: Teller;

  action: Action = 'OPEN';

  constructor(private router: Router, private route: ActivatedRoute, private store: OfficesStore) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => this.action = params['action']);

    this.officeSubscription = this.store.select(fromOffices.getSelectedOffice)
      .subscribe(office => this.office = office);

    this.tellerSubscription = this.store.select(fromOffices.getSelectedTeller)
      .subscribe(teller => this.teller = teller);
  }

  ngOnDestroy(): void {
    this.officeSubscription.unsubscribe();
    this.tellerSubscription.unsubscribe();
  }

  onOpen(command: TellerManagementCommand): void {
    this.executeCommand(command);
  }

  onClose(command: TellerManagementCommand): void {
    this.executeCommand(command);
  }

  private executeCommand(command: TellerManagementCommand): void {
    this.store.dispatch({
      type: EXECUTE_COMMAND,
      payload: {
        officeId: this.office.identifier,
        tellerCode: this.teller.code,
        activatedRoute: this.route,
        command
      }
    })
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route })
  }

}

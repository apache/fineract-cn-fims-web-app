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

import {Component, OnDestroy, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Teller} from '../../../../../services/teller/domain/teller.model';
import {OfficeTellerFormComponent} from './form.component';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromTeller from '../../../store/index';
import {OfficesStore} from '../../../store/index';
import {CREATE_TELLER, RESET_FORM} from '../../../store/teller/teller.actions';
import {Error} from '../../../../../services/domain/error.model';
import {Office} from '../../../../../services/office/domain/office.model';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateOfficeTellerFormComponent implements OnDestroy {

  private officeSubscription: Subscription;

  private formStateSubscription: Subscription;

  private office: Office;

  teller: Teller = {
    code: '',
    password: '',
    cashdrawLimit: 0,
    tellerAccountIdentifier: '',
    vaultAccountIdentifier: ''
  };

  @ViewChild('form') formComponent: OfficeTellerFormComponent;

  constructor(private router: Router, private route: ActivatedRoute, private store: OfficesStore) {
    this.officeSubscription = this.store.select(fromTeller.getSelectedOffice)
      .subscribe(office => this.office = office);

    this.formStateSubscription = store.select(fromTeller.getTellerFormError)
      .filter((error: Error) => !!error)
      .subscribe((error: Error) => this.formComponent.showCodeValidationError());
  }

  ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();
    this.officeSubscription.unsubscribe();
    this.store.dispatch({ type: RESET_FORM })
  }

  onSave(teller: Teller): void {
    this.store.dispatch({ type: CREATE_TELLER, payload: {
      officeId: this.office.identifier,
      teller,
      activatedRoute: this.route
    }});
  }

  onCancel(): void {
    this.navigateAway()
  }

  navigateAway(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}

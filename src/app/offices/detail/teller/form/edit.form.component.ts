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
import {Teller} from '../../../../../services/teller/domain/teller.model';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromOffices from '../../../store/index';
import {OfficesStore} from '../../../store/index';
import {RESET_FORM, UPDATE_TELLER} from '../../../store/teller/teller.actions';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Office} from '../../../../../services/office/domain/office.model';

@Component({
  templateUrl: './edit.form.component.html'
})
export class EditOfficeTellerFormComponent implements OnInit, OnDestroy {

  private officeSubscription: Subscription;

  private office: Office;

  teller$: Observable<Teller>;

  constructor(private router: Router, private route: ActivatedRoute, private store: OfficesStore) {}

  ngOnInit(): void {
    this.teller$ = this.store.select(fromOffices.getSelectedTeller);

    this.officeSubscription = this.store.select(fromOffices.getSelectedOffice)
      .subscribe(office => this.office = office);
  }

  ngOnDestroy(): void {
    this.store.dispatch({ type: RESET_FORM });
    this.officeSubscription.unsubscribe();
  }

  onSave(teller: Teller): void {
    this.store.dispatch({ type: UPDATE_TELLER, payload: {
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

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

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OfficeFormComponent} from '../form.component';
import {Office} from '../../../../services/office/domain/office.model';
import * as fromOffice from '../../store';
import {CREATE, CREATE_BRANCH, RESET_FORM} from '../../store/office.actions';
import {Error} from '../../../../services/domain/error.model';
import {Subscription} from 'rxjs';
import {OfficesStore} from '../../store/index';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreateOfficeFormComponent implements OnInit, OnDestroy{

  private formStateSubscription: Subscription;

  private parentIdentifier: string;

  office: Office = { identifier: '', parentIdentifier: '', name: '' };

  @ViewChild('form') formComponent: OfficeFormComponent;

  constructor(private router: Router, private route: ActivatedRoute, private store: OfficesStore) {

    this.formStateSubscription = store.select(fromOffice.getOfficeFormError)
      .filter((error: Error) => !!error)
      .subscribe((error: Error) => {
        let officeDetailForm = this.formComponent.detailForm;
        let errors = officeDetailForm.get('identifier').errors || {};
        errors['unique'] = true;
        officeDetailForm.get('identifier').setErrors(errors);
        this.formComponent.step.open();
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams) => {
      this.parentIdentifier = queryParams['parentId'];
    });
  }

  ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();

    this.store.dispatch({ type: RESET_FORM })
  }

  onSave(office: Office): void{
    if(this.parentIdentifier){
      office.parentIdentifier = this.parentIdentifier;
      this.store.dispatch({ type: CREATE_BRANCH, payload: {
        office,
        activatedRoute: this.route
      }});
    }else{
      this.store.dispatch({ type: CREATE, payload: {
        office,
        activatedRoute: this.route
      }});
    }
  }

  onCancel(): void{
    this.navigateAway()
  }

  navigateAway(): void{
    if(this.parentIdentifier){
      this.router.navigate(['../detail', this.parentIdentifier ], { relativeTo: this.route });
    }else{
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

}

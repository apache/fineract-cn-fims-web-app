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
import {Component} from '@angular/core';
import {AccountingStore} from '../../store/index';
import {PayrollCollectionSheet} from '../../../services/accounting/domain/payroll-collection-sheet.model';
import {CREATE} from '../../store/payroll/payroll-collection.actions';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  templateUrl: './create.form.component.html'
})
export class CreatePayrollFormComponent {

  constructor(private store: AccountingStore, private router: Router, private route: ActivatedRoute) {}

  onSave(sheet: PayrollCollectionSheet): void {
    this.store.dispatch({ type: CREATE, payload: {
      sheet,
      activatedRoute: this.route
    }});
  }

  onCancel(): void{
    this.navigateAway();
  }

  navigateAway(): void{
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

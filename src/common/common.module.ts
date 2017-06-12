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

import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  CovalentCommonModule, CovalentDataTableModule, CovalentDialogsModule,
  CovalentPagingModule
} from '@covalent/core';
import {LayoutCardOverComponent, LayoutCardOverComponentTags} from './layout-card-over/layout-card-over.component';
import {IdInputComponent} from './id-input/id-input.component';
import {PermissionDirective} from '../services/security/authz/permission.directive';
import {DataTableComponent} from './data-table/data-table.component';
import {StateDisplayComponent} from './state-display/state-display.component';
import {CommandDisplayComponent} from './command-display/command-display.component';
import {CustomerSelectComponent} from './customer-select/customer-select.component';
import {SelectListComponent} from './select-list/select-list.component';
import {EmployeeSelectComponent} from './employee-select/employee-select.component';
import {AccountSelectComponent} from './account-select/account-select.component';
import {ProductSelectComponent} from './product-select/product-select.component';
import {TranslateModule} from '@ngx-translate/core';
import {MinMaxComponent} from './min-max/min-max.component';
import {ValidateOnBlurDirective} from './validate-on-blur.directive';
import {LedgerSelectComponent} from './ledger-select/ledger-select.component';
import {FormContinueActionComponent} from './forms/form-continue-action.component';
import {FormFinalActionComponent} from './forms/form-final-action.component';
import {AddressFormComponent} from './address/address.component';
import {PortraitComponent} from './portrait/portrait.component';
import {CommonModule} from '@angular/common';
import {
  MdAutocompleteModule,
  MdButtonModule,
  MdCardModule, MdIconModule,
  MdInputModule, MdListModule,
  MdOptionModule,
  MdSnackBarModule,
  MdToolbarModule,
  MdTooltipModule
} from '@angular/material';
import {EmployeeAutoCompleteComponent} from './employee-autocomplete/employee-auto-complete.component';

@NgModule({
  imports: [
    CommonModule,
    CovalentCommonModule,
    CovalentDataTableModule,
    CovalentDialogsModule,
    CovalentPagingModule,
    FormsModule,
    MdAutocompleteModule,
    MdButtonModule,
    MdCardModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdOptionModule,
    MdSnackBarModule,
    MdToolbarModule,
    MdTooltipModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [
    LayoutCardOverComponent,
    LayoutCardOverComponentTags,
    SelectListComponent,
    CustomerSelectComponent,
    EmployeeSelectComponent,
    AccountSelectComponent,
    LedgerSelectComponent,
    ProductSelectComponent,
    EmployeeAutoCompleteComponent,
    IdInputComponent,
    PermissionDirective,
    DataTableComponent,
    StateDisplayComponent,
    CommandDisplayComponent,
    MinMaxComponent,
    ValidateOnBlurDirective,
    FormFinalActionComponent,
    FormContinueActionComponent,
    AddressFormComponent,
    PortraitComponent
  ],
  exports: [
    LayoutCardOverComponent,
    LayoutCardOverComponentTags,
    SelectListComponent,
    CustomerSelectComponent,
    EmployeeSelectComponent,
    AccountSelectComponent,
    LedgerSelectComponent,
    ProductSelectComponent,
    EmployeeAutoCompleteComponent,
    IdInputComponent,
    PermissionDirective,
    DataTableComponent,
    StateDisplayComponent,
    CommandDisplayComponent,
    MinMaxComponent,
    ValidateOnBlurDirective,
    FormFinalActionComponent,
    FormContinueActionComponent,
    AddressFormComponent,
    PortraitComponent
  ]
})
export class FimsSharedModule{}

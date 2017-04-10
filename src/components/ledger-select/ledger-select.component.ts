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

import {Component, Input, forwardRef, OnInit, OnDestroy} from '@angular/core';
import {FetchRequest} from '../../services/domain/paging/fetch-request.model';
import {Observable, Subscription} from 'rxjs';
import {AccountingService} from '../../services/accounting/accounting.service';
import {Account} from '../../services/accounting/domain/account.model';
import {AccountPage} from '../../services/accounting/domain/account-page.model';
import {FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {Ledger} from '../../services/accounting/domain/ledger.model';
import {LedgerPage} from '../../services/accounting/domain/ledger-page.model';

const noop: () => void = () => {
  // empty method
};

@Component({
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => LedgerSelectComponent), multi: true }
  ],
  selector: 'fims-ledger-select',
  templateUrl: './ledger-select.component.html'
})
export class LedgerSelectComponent implements ControlValueAccessor, OnInit{

  formControl: FormControl;

  @Input() title: string;

  @Input() required: boolean;

  ledgers: Observable<Ledger[]>;

  constructor(private accountingService: AccountingService) {}

  ngOnInit(): void {
    this.formControl = new FormControl('');

    this.ledgers = this.formControl.valueChanges
      .distinctUntilChanged()
      .debounceTime(500)
      .do(name => this.changeValue(name))
      .filter(name => name)
      .switchMap(name => this.onSearch(name));
  }

  changeValue(value: string): void{
    this._onChangeCallback(value);
  }

  writeValue(value: any): void {
    this.formControl.setValue(value);
  }

  registerOnChange(fn: any): void {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouchedCallback = fn;
  }

  private _onTouchedCallback: () => void = noop;

  private _onChangeCallback: (_: any) => void = noop;

  onSearch(searchTerm?: string): Observable<Ledger[]>{
    let fetchRequest: FetchRequest = {
      page: {
        pageIndex: 0,
        size: 5
      },
      searchTerm: searchTerm
    };

    return this.accountingService.fetchLedgers(true, fetchRequest)
      .map((ledgerPage: LedgerPage) => ledgerPage.ledgers);
  }

}

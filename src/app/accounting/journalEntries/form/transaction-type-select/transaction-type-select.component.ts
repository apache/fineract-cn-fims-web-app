/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {TransactionType} from '../../../../services/accounting/domain/transaction-type.model';
import {AccountingService} from '../../../../services/accounting/accounting.service';
import {FetchRequest} from '../../../../services/domain/paging/fetch-request.model';
import {TransactionTypePage} from '../../../../services/accounting/domain/transaction-type-page.model';

const noop: () => void = () => {
  // empty method
};

@Component({
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TransactionTypeSelectComponent), multi: true}
  ],
  selector: 'fims-transaction-type-select',
  templateUrl: './transaction-type-select.component.html'
})
export class TransactionTypeSelectComponent implements ControlValueAccessor, OnInit {

  private _onTouchedCallback: () => void = noop;

  private _onChangeCallback: (_: any) => void = noop;

  formControl: FormControl;

  @Input() title: string;

  @Input() required: boolean;

  transactionTypes: Observable<TransactionType[]>;

  constructor(private accountingService: AccountingService) {
  }

  ngOnInit(): void {
    this.formControl = new FormControl('');

    this.transactionTypes = this.formControl.valueChanges
      .distinctUntilChanged()
      .debounceTime(500)
      .do(name => this.changeValue(name))
      .filter(name => name)
      .switchMap(name => this.onSearch(name));
  }

  changeValue(value: string): void {
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

  onSearch(searchTerm?: string): Observable<TransactionType[]> {
    const fetchRequest: FetchRequest = {
      page: {
        pageIndex: 0,
        size: 5
      },
      searchTerm: searchTerm
    };

    return this.accountingService.fetchTransactionTypes(fetchRequest)
      .map((transactionTypePage: TransactionTypePage) => transactionTypePage.transactionTypes);
  }

}

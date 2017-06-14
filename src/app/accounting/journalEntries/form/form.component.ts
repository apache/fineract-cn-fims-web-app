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
import {JournalEntry} from '../../../../services/accounting/domain/journal-entry.model';
import {FormComponent} from '../../../../common/forms/form.component';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TdStepComponent} from '@covalent/core';
import {FetchRequest} from '../../../../services/domain/paging/fetch-request.model';
import {Account} from '../../../../services/accounting/domain/account.model';
import {Observable, Subscription} from 'rxjs';
import {toLongISOString} from '../../../../services/domain/date.converter';
import {FimsValidators} from '../../../../common/validator/validators';
import * as fromAccounting from '../../store';
import * as fromRoot from '../../../reducers';
import {CREATE, RESET_FORM} from '../../store/ledger/journal-entry/journal-entry.actions';
import {Error} from '../../../../services/domain/error.model';
import {SEARCH} from '../../../reducers/account/account.actions';
import {AccountingStore} from '../../store/index';
import {JournalEntryValidators} from './journal-entry.validator';
import {AccountingService} from '../../../../services/accounting/accounting.service';
import {transactionTypeExists} from './transaction-type-select/validator/transaction-type-exists.validator';

@Component({
  selector: 'fims-journal-entry-form-component',
  templateUrl: './form.component.html'
})
export class JournalEntryFormComponent extends FormComponent<JournalEntry> implements OnInit, OnDestroy {

  private formStateSubscription: Subscription;

  private userNameSubscription: Subscription;

  @ViewChild('detailsStep') detailsStep: TdStepComponent;

  selectedClerk: string;

  term = new FormControl();

  accounts: Observable<Account[]>;

  constructor(private formBuilder: FormBuilder, private router: Router, private route: ActivatedRoute, private store: AccountingStore, private accountingService: AccountingService) {
    super();
  }

  get formData(): JournalEntry {
    return null;
  }

  ngOnInit(): void {
    this.formStateSubscription = this.store.select(fromAccounting.getJournalEntryFormError)
      .filter((error: Error) => !!error)
      .subscribe((error: Error) => this.setError('transactionIdentifier', 'unique', true));

    this.accounts = this.store.select(fromRoot.getAccountSearchResults)
      .map(accountPage => accountPage.accounts);

    this.detailsStep.open();

    this.userNameSubscription = this.store.select(fromRoot.getUsername).subscribe(username => this.selectedClerk = username);

    this.form = this.formBuilder.group({
      transactionIdentifier: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe()]],
      transactionType: ['', [Validators.required], transactionTypeExists(this.accountingService)],
      transactionDate: [new Date().toISOString().slice(0, 10), Validators.required],
      note: [''],
      message: [''],
      creditors: this.formBuilder.array([], JournalEntryValidators.minItems(1)),
      debtors: this.formBuilder.array([], JournalEntryValidators.minItems(1))
    }, { validator: JournalEntryValidators.equalSum('creditors', 'debtors') });

    this.term.valueChanges
      .debounceTime(500)
      .subscribe((event) => this.onAccountSearch(event));

    this.onAccountSearch();
  }

  ngOnDestroy(): void {
    this.formStateSubscription.unsubscribe();
    this.userNameSubscription.unsubscribe();

    this.store.dispatch({ type: RESET_FORM })
  }

  onClerkSelectionChange(selections: string[]): void {
    this.selectedClerk = selections[0];
  }

  save(): void {
    let transactionDateString = toLongISOString(this.form.get('transactionDate').value);

    let journalEntry: JournalEntry = {
      transactionIdentifier: this.form.get('transactionIdentifier').value,
      transactionType: this.form.get('transactionType').value,
      transactionDate: transactionDateString,
      clerk: this.selectedClerk,
      note: this.form.get('note').value,
      message: this.form.get('message').value,
      creditors: this.form.get('creditors').value,
      debtors: this.form.get('debtors').value,
    };

    this.store.dispatch({ type: CREATE, payload: {
      journalEntry,
      activatedRoute: this.route
    } });
  }

  addCreditor(accountNumber: string): void {
    const control: FormArray = this.form.get('creditors') as FormArray;
    control.push(this.initCreditor(accountNumber));
  }

  removeCreditor(index: number): void {
    const control: FormArray = this.form.get('creditors') as FormArray;
    control.removeAt(index);
  }

  addDebtor(accountNumber: string): void {
    const control: FormArray = this.form.get('debtors') as FormArray;
    control.push(this.initDebtor(accountNumber));
  }

  removeDebtor(index: number): void {
    const control: FormArray = this.form.get('debtors') as FormArray;
    control.removeAt(index);
  }

  onCancel() {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  get debtors(): AbstractControl[] {
    const debtors: FormArray = this.form.get('debtors') as FormArray;
    return debtors.controls;
  }

  get creditors(): AbstractControl[] {
    const creditors: FormArray = this.form.get('creditors') as FormArray;
    return creditors.controls;
  }

  private onAccountSearch(searchTerm?: string): void {
    let fetchRequest: FetchRequest = {
      page: {
        pageIndex: 0,
        size: 5
      },
      searchTerm: searchTerm
    };

    this.store.dispatch({ type: SEARCH, payload: fetchRequest });
  }

  private initCreditor(accountNumber: string): FormGroup {
    return this.formBuilder.group({
      accountNumber: [accountNumber],
      amount: [0]
    })
  }

  private initDebtor(accountNumber: string): FormGroup {
    return this.formBuilder.group({
      accountNumber: [accountNumber],
      amount: [0]
    })
  }

}

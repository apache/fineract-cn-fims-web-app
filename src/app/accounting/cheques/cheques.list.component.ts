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
import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ITdDataTableColumn, TdDialogService} from '@covalent/core';
import {AccountingStore} from '../store/index';
import * as fromAccounting from '../store';
import {ChequeCRUDActions, ProcessAction} from '../store/cheques/cheque.actions';
import {TranslateService} from '@ngx-translate/core';
import {FimsCheque} from '../../services/cheque/domain/fims-cheque.model';
import {DatePipe} from '@angular/common';

@Component({
  templateUrl: './cheques.list.component.html',
  providers: [DatePipe]
})
export class ChequesListComponent implements OnInit {

  cheques$: Observable<FimsCheque[]>;

  columns: ITdDataTableColumn[] = [
    {name: 'identifier', label: 'Identifier'},
    {name: 'drawee', label: 'Drawee'},
    {name: 'drawer', label: 'Drawer'},
    {name: 'payee', label: 'Payee'},
    {name: 'amount', label: 'Amount'},
    {name: 'dateIssued', label: 'Date issued', format: value => this.datePipe.transform(value, 'shortDate')},
    {name: 'state', label: 'State'}
  ];

  constructor(private store: AccountingStore, private dialogService: TdDialogService,
              private translate: TranslateService, private datePipe: DatePipe) {
    this.cheques$ = store.select(fromAccounting.getAllChequeEntities);
  }

  ngOnInit(): void {
    this.store.dispatch(ChequeCRUDActions.loadAllAction({
      state: 'PENDING'
    }));
  }

  confirmAction(action: string): Observable<boolean> {
    const message = `Do you want to ${action} this cheque?`;
    const title = 'Confirm action';
    const button = `${action} cheque`;

    return this.translate.get([title, message, button])
      .flatMap(result =>
        this.dialogService.openConfirm({
          message: result[message],
          title: result[title],
          acceptButton: result[button]
        }).afterClosed()
      );
  }

  approveCheque(cheque: FimsCheque): void {
    this.confirmAction('APPROVE')
      .filter(accept => accept)
      .subscribe(() => {
        this.store.dispatch(new ProcessAction({
          chequeIdentifier: cheque.identifier,
          command: {
            action: 'APPROVE'
          }
        }));
      });
  }

  cancelCheque(cheque: FimsCheque): void {
    this.confirmAction('CANCEL')
      .filter(accept => accept)
      .subscribe(() => {
        this.store.dispatch(new ProcessAction({
          chequeIdentifier: cheque.identifier,
          command: {
            action: 'CANCEL'
          }
        }));
      });
  }

}

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
import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableData} from '../../../../../common/data-table/data-table.component';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import * as fromOffices from '../../../../store/index';
import {OfficesStore} from '../../../../store/index';
import {LoadDenominationAction} from '../../../../store/teller/denomination/denomination.actions';
import {DatePipe} from '@angular/common';

@Component({
  templateUrl: './denomination.list.component.html',
  providers: [DatePipe]
})
export class TellerDenominationListComponent implements OnInit, OnDestroy {

  private loadDenominationSubscription: Subscription;

  denominationData$: Observable<TableData>;

  isTellerNotPaused$: Observable<boolean>;

  columns: any[] = [
    {name: 'countedTotal', label: 'Counted total'},
    {name: 'note', label: 'Note'},
    {name: 'adjustingJournalEntry', label: 'Adjusting journal entry'},
    {
      name: 'createdOn', label: 'Created on', format: (v: any) => {
      return this.datePipe.transform(v, 'short');
    }
    },
    {name: 'createdBy', label: 'Created by'}
  ];

  constructor(private store: OfficesStore, private datePipe: DatePipe) {}

  ngOnInit(): void {
    const selectedTeller$ = this.store.select(fromOffices.getSelectedTeller).filter(teller => !!teller);

    this.isTellerNotPaused$ = selectedTeller$.map(teller => teller.state !== 'PAUSED');

    this.loadDenominationSubscription = Observable.combineLatest(
      this.store.select(fromOffices.getSelectedOffice).filter(office => !!office),
      selectedTeller$,
      (office, teller) => ({
        office,
        teller
      })
    ).map(result => new LoadDenominationAction({
      officeId: result.office.identifier,
      tellerCode: result.teller.code
    })).subscribe(this.store);

    this.denominationData$ = this.store.select(fromOffices.getDenominationsEntities)
      .map(tellers => ({
        data: tellers,
        totalElements: tellers.length,
        totalPages: 1
      }));
  }

  ngOnDestroy(): void {
    this.loadDenominationSubscription.unsubscribe();
  }

}

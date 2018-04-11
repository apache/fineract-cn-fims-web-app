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
import {TableData} from '../../../common/data-table/data-table.component';
import {Observable} from 'rxjs/Observable';
import {getAllTellerEntities, getSelectedOffice, OfficesStore} from '../../store/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Teller} from '../../../services/teller/domain/teller.model';
import {LoadTellerAction} from '../../store/teller/teller.actions';
import {DatePipe} from '@angular/common';

@Component({
  templateUrl: './teller.list.component.html',
  providers: [DatePipe]
})
export class OfficeTellerListComponent implements OnInit, OnDestroy {

  private loadTellerSubscription: Subscription;

  tellerData$: Observable<TableData>;

  columns: any[] = [
    {name: 'code', label: 'Number'},
    {name: 'cashdrawLimit', label: 'Cash withdrawal limit'},
    {name: 'assignedEmployee', label: 'Assigned employee'},
    {name: 'state', label: 'Status'},
    {
      name: 'lastOpenedOn', label: 'Last opened on', format: (v: any) => {
      return this.datePipe.transform(v, 'short');
    }}
  ];

  constructor(private store: OfficesStore, private route: ActivatedRoute, private router: Router, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadTellerSubscription = this.store.select(getSelectedOffice)
      .filter(office => !!office)
      .map(office => new LoadTellerAction(office.identifier))
      .subscribe(this.store);

    this.tellerData$ = this.store.select(getAllTellerEntities)
      .map(tellers => ({
        data: tellers,
        totalElements: tellers.length,
        totalPages: 1
      }));
  }

  ngOnDestroy(): void {
    this.loadTellerSubscription.unsubscribe();
  }

  rowSelect(teller: Teller): void {
    this.router.navigate(['detail', teller.code], {relativeTo: this.route});
  }

}

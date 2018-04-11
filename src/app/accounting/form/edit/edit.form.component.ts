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
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ledger} from '../../../services/accounting/domain/ledger.model';
import {LedgerFormComponent} from '../form.component';
import {ActivatedRoute, Router} from '@angular/router';
import {UPDATE} from '../../store/ledger/ledger.actions';
import * as fromAccounting from '../../store';
import {Subscription} from 'rxjs/Subscription';
import {AccountingStore} from '../../store/index';

@Component({
  templateUrl: './edit.form.component.html'
})
export class EditLedgerFormComponent implements OnInit, OnDestroy {

  private ledgerSubscription: Subscription;

  ledger: Ledger;

  @ViewChild('form') formComponent: LedgerFormComponent;

  constructor(private router: Router, private route: ActivatedRoute, private store: AccountingStore) {}

  ngOnInit() {
    this.ledgerSubscription = this.store.select(fromAccounting.getSelectedLedger)
      .subscribe(ledger => this.ledger = ledger);
  }

  ngOnDestroy(): void {
    this.ledgerSubscription.unsubscribe();
  }

  onSave(ledger: Ledger) {
    ledger.subLedgers = this.ledger.subLedgers;

    this.store.dispatch({ type: UPDATE, payload: {
      ledger,
      activatedRoute: this.route
    }});
  }

  onCancel() {
    this.navigateAway();
  }

  navigateAway(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

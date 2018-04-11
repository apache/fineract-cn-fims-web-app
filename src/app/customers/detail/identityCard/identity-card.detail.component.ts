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
import {Subscription} from 'rxjs/Subscription';
import * as fromCustomers from '../../store/index';
import {CustomersStore} from '../../store/index';
import {Customer} from '../../../services/customer/domain/customer.model';
import {DELETE} from '../../store/identityCards/identity-cards.actions';
import {CREATE, DELETE as DELETE_SCAN, LoadAllAction} from '../../store/identityCards/scans/scans.actions';
import {ActivatedRoute} from '@angular/router';
import {IdentificationCard} from '../../../services/customer/domain/identification-card.model';
import {Observable} from 'rxjs/Observable';
import {TranslateService} from '@ngx-translate/core';
import {TdDialogService} from '@covalent/core';
import {IdentificationCardScan} from '../../../services/customer/domain/identification-card-scan.model';
import {UploadIdentificationCardScanEvent} from './scans/scan.list.component';
import {ImageComponent} from '../../../common/image/image.component';
import {CustomerService} from '../../../services/customer/customer.service';

@Component({
  templateUrl: './identity-card.detail.component.html'
})
export class CustomerIdentityCardDetailComponent implements OnInit, OnDestroy {

  private actionSubscription: Subscription;

  private customer: Customer;

  identificationCard: IdentificationCard;

  scans$: Observable<IdentificationCardScan[]>;

  constructor(private route: ActivatedRoute, private customersStore: CustomersStore, private translate: TranslateService,
              private dialogService: TdDialogService, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.scans$ = this.customersStore.select(fromCustomers.getAllIdentificationCardScanEntities);

    this.actionSubscription = Observable.combineLatest(
      this.customersStore.select(fromCustomers.getSelectedIdentificationCard)
        .filter(identificationCard => !!identificationCard),
      this.customersStore.select(fromCustomers.getSelectedCustomer),
      (identificationCard, customer) => ({
        identificationCard,
        customer
      }))
      .do(result => this.customer = result.customer)
      .do(result => this.identificationCard = result.identificationCard)
      .map(result => new LoadAllAction({
        customerIdentifier: result.customer.identifier,
        identificationCardNumber: result.identificationCard.number
      }))
      .subscribe(this.customersStore);
  }

  ngOnDestroy(): void {
    this.actionSubscription.unsubscribe();
  }

  confirmDeletion(): Observable<boolean> {
    const message = 'Do you want to delete this identification card?';
    const title = 'Confirm deletion';
    const button = 'DELETE IDENTIFICATION CARD';

    return this.translate.get([title, message, button])
      .flatMap(result =>
        this.dialogService.openConfirm({
          message: result[message],
          title: result[title],
          acceptButton: result[button]
        }).afterClosed()
      );
  }

  deleteIdentificationCard(): void {
    this.confirmDeletion()
      .filter(accept => accept)
      .subscribe(() => {
        this.customersStore.dispatch({ type: DELETE, payload: {
          customerId: this.customer.identifier,
          identificationCard: this.identificationCard,
          activatedRoute: this.route
        }});
      });
  }

  viewScan(identifier: string): void {
    this.customerService.getIdentificationCardScanImage(this.customer.identifier, this.identificationCard.number, identifier)
      .subscribe(blob => {
        this.dialogService.open(ImageComponent, {
          data: blob
        });
      });
  }

  uploadScan(event: UploadIdentificationCardScanEvent): void {
    this.customersStore.dispatch({
      type: CREATE,
      payload: {
        customerIdentifier: this.customer.identifier,
        identificationCardNumber: this.identificationCard.number,
        scan: event.scan,
        file: event.file
      }
    });
  }

  confirmScanDeletion(): Observable<boolean> {
    const message = 'Do you want to delete this scan?';
    const title = 'Confirm deletion';
    const button = 'DELETE SCAN';

    return this.translate.get([title, message, button])
      .flatMap(result =>
        this.dialogService.openConfirm({
          message: result[message],
          title: result[title],
          acceptButton: result[button]
        }).afterClosed()
      );
  }

  deleteScan(scan: IdentificationCardScan): void {
    this.confirmScanDeletion()
      .filter(accept => accept)
      .subscribe(() => {
        this.customersStore.dispatch({ type: DELETE_SCAN, payload: {
          customerIdentifier: this.customer.identifier,
          identificationCardNumber: this.identificationCard.number,
          scan
        }});
      });
  }
}

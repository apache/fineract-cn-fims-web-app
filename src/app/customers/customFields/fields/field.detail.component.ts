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
import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {DELETE_FIELD} from '../../store/catalogs/catalog.actions';
import {Field} from '../../../services/catalog/domain/field.model';
import {CustomersStore} from '../../store/index';
import {TdDialogService} from '@covalent/core';
import * as fromCustomers from '../../store';
import {ActivatedRoute} from '@angular/router';
import {Catalog} from '../../../services/catalog/domain/catalog.model';

@Component({
  templateUrl: './field.detail.component.html'
})
export class FieldDetailComponent {

  catalog$: Observable<Catalog>;

  field$: Observable<Field>;

  constructor(private store: CustomersStore, private dialogService: TdDialogService, private route: ActivatedRoute) {
    this.catalog$ = store.select(fromCustomers.getCustomerCatalog);
    this.field$ = store.select(fromCustomers.getSelectedField);
  }

  confirmDeletion(): Observable<boolean> {
    return this.dialogService.openConfirm({
      message: 'Do you want to delete this field?',
      title: 'Confirm deletion',
      acceptButton: 'DELETE FIELD',
    }).afterClosed();
  }

  deleteField(catalogIdentifier: string, field: Field): void {
    this.confirmDeletion()
      .filter(accept => accept)
      .subscribe(() => {
        this.store.dispatch({ type: DELETE_FIELD, payload: {
          catalogIdentifier,
          field,
          activatedRoute: this.route
        } });
      });
  }
}

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
import {Catalog} from '../../services/catalog/domain/catalog.model';
import {Observable} from 'rxjs/Observable';
import {CustomersStore} from '../store/index';
import * as fromCustomers from '../store';
import {TableData} from '../../common/data-table/data-table.component';
import {dataTypes} from './domain/datatype-types.model';
import {TdDialogService} from '@covalent/core';
import {DELETE} from '../store/catalogs/catalog.actions';
import {ActivatedRoute, Router} from '@angular/router';
import {Field} from '../../services/catalog/domain/field.model';

@Component({
  templateUrl: './catalog.detail.component.html'
})
export class CatalogDetailComponent {

  catalog$: Observable<Catalog>;

  fieldData$: Observable<TableData>;

  columns: any[] = [
    { name: 'identifier', label: 'Identifier' },
    { name: 'dataType', label: 'Data type', format: value => dataTypes.find(type => type.type === value).label },
    { name: 'label', label: 'Label' },
    { name: 'hint', label: 'Hint' },
    { name: 'description', label: 'Description' },
    { name: 'mandatory', label: 'Mandatory' }
  ];

  constructor(private store: CustomersStore, private dialogService: TdDialogService, private route: ActivatedRoute,
              private router: Router) {
    this.catalog$ = store.select(fromCustomers.getCustomerCatalog)
      .filter(catalog => !!catalog);

    this.fieldData$ = this.catalog$
      .map(catalog => ({
        data: catalog.fields,
        totalElements: catalog.fields.length,
        totalPages: 1
      }));
  }

  rowSelect(field: Field): void {
    this.router.navigate(['field/detail', field.identifier], { relativeTo: this.route });
  }

  confirmDeletion(): Observable<boolean> {
    return this.dialogService.openConfirm({
      message: 'Do you want to delete this catalog?',
      title: 'Confirm deletion',
      acceptButton: 'DELETE CATALOG',
    }).afterClosed();
  }

  deleteCatalog(catalog: Catalog): void {
    this.confirmDeletion()
      .filter(accept => accept)
      .subscribe(() => {
        this.store.dispatch({ type: DELETE, payload: {
          catalog,
          activatedRoute: this.route
        } });
      });
  }
}

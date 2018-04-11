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
import * as fromCustomers from '../../../store/index';
import {CustomersStore} from '../../../store/index';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Field} from '../../../../services/catalog/domain/field.model';
import {UPDATE_FIELD} from '../../../store/catalogs/catalog.actions';
import {Catalog} from '../../../../services/catalog/domain/catalog.model';

@Component({
  templateUrl: './edit.form.component.html'
})
export class EditCatalogFieldFormComponent {

  catalog$: Observable<Catalog>;

  field$: Observable<Field>;

  constructor(private store: CustomersStore, private router: Router, private route: ActivatedRoute) {
    this.catalog$ = store.select(fromCustomers.getCustomerCatalog);
    this.field$ = store.select(fromCustomers.getSelectedField);
  }

  onSave(catalogIdentifier: string, field: Field): void {
    this.store.dispatch({
      type: UPDATE_FIELD,
      payload: {
        catalogIdentifier,
        field,
        activatedRoute: this.route
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

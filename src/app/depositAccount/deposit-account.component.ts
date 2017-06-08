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

import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {TableData} from '../../common/data-table/data-table.component';
import {FetchRequest} from '../../services/domain/paging/fetch-request.model';
import * as fromDepositAccounts from './store';
import {Observable} from 'rxjs';
import {SEARCH} from './store/product.actions';
import {DepositAccountStore} from './store/index';
import {ProductDefinition} from '../../services/depositAccount/domain/definition/product-definition.model';

@Component({
  templateUrl: './deposit-account.component.html'
})
export class DepositProductComponent implements OnInit{

  productData: Observable<TableData>;

  columns: any[] = [
    { name: 'identifier', label: 'Id' },
    { name: 'name', label: 'Name' },
    { name: 'type', label: 'Type' },
    { name: 'active', label: 'Active'},
    { name: 'interest', label: 'Interest'}
  ];

  constructor(private router: Router, private route: ActivatedRoute, private store: DepositAccountStore) {}

  ngOnInit(): void {
    this.productData = this.store.select(fromDepositAccounts.getProductSearchResults)
      .map(productPage => ({
        data: productPage.products,
        totalElements: productPage.totalElements,
        totalPages: productPage.totalPages
      }));
    this.fetchProducts();
  }

  fetchProducts(fetchRequest?: FetchRequest): void{
    this.store.dispatch({ type: SEARCH });
  }

  rowSelect(productDefinition: ProductDefinition): void{
    this.router.navigate(['detail', productDefinition.identifier], { relativeTo: this.route })
  }
}

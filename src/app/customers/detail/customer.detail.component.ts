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

import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Customer} from '../../../services/customer/domain/customer.model';
import {Catalog} from '../../../services/catalog/domain/catalog.model';
import {Field} from '../../../services/catalog/domain/field.model';
import {Option} from '../../../services/catalog/domain/option.model';
import * as fromCustomers from '../store';
import {Subscription} from 'rxjs';
import {CustomersStore} from '../store/index';
import {LOAD_ALL} from '../store/catalogs/catalog.actions';
import {CustomerService} from '../../../services/customer/customer.service';

interface CatalogFieldPair{
  catalog: Catalog;
  field: Field;
}

interface CustomCatalog{
  label: string;
  fields: CustomDetailField[]
}

interface CustomDetailField{
  label: string,
  value: string;
}

@Component({
  templateUrl: './customer.detail.component.html',
  styleUrls: ['./customer.detail.component.scss']
})
export class CustomerDetailComponent implements OnInit, OnDestroy {

  portrait: Blob;

  private catalogsSubscription: Subscription;

  private customerSubscription: Subscription;

  private _customer: Customer;

  private _catalogs: Catalog[];

  customCatalogs: CustomCatalog[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private store: CustomersStore, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.customerSubscription = this.store.select(fromCustomers.getSelectedCustomer)
      .do(customer => this.customer = customer)
      .flatMap(customer => this.customerService.getPortrait(customer.identifier))
      .subscribe(portrait => this.portrait = portrait);

    this.catalogsSubscription = this.store.select(fromCustomers.getAllCustomerCatalogEntities)
      .subscribe(catalogs => this.catalogs = catalogs);

    this.store.dispatch({ type: LOAD_ALL });
  }

  ngOnDestroy(): void {
    this.customerSubscription.unsubscribe();
    this.catalogsSubscription.unsubscribe();
  }

  searchCustomer(term): void {
    if(term){
      this.router.navigate(['../../../'], { queryParams: { term: term }, relativeTo: this.route });
    }
  }

  set customer(customer: Customer){
    this._customer = customer;

    let customCatalogs: CustomCatalog[] = [];

    if(customer.customValues){
      for(let value of customer.customValues){
        let catalog: Catalog = this._catalogs.find((catalog: Catalog) => catalog.identifier === value.catalogIdentifier);
        let field: Field = catalog.fields.find((field: Field) => field.identifier === value.fieldIdentifier);

        let valueString: string = value.value;

        switch(field.dataType){
          case 'DATE':
            valueString = valueString ? valueString.substr(0, 10) : '';
            break;
          case 'SINGLE_SELECTION':
            let option = field.options.find((option: Option) => option.value === Number(valueString));
            valueString = option.label;
            break;
        }

        let customField: CustomDetailField = {
          label: field.label,
          value: valueString
        };

        // If catalog does not exists
        if(!customCatalogs[value.catalogIdentifier]){
          customCatalogs[value.catalogIdentifier] = {
            label: catalog.name,
            fields: []
          }
        }
        customCatalogs[value.catalogIdentifier].fields.push(customField);
      }
    }

    // change from associative array to array
    for(let catalogIdentifier in customCatalogs){
      this.customCatalogs.push(customCatalogs[catalogIdentifier]);
    }
  };

  get customer(): Customer {
    return this._customer;
  }

  set catalogs(catalogs: Catalog[]) {
    this._catalogs = catalogs;
  }

  changePortrait(): void {
    this.router.navigate(['portrait'], { relativeTo: this.route })
  }

}

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

import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {FetchRequest} from '../../services/domain/paging/fetch-request.model';
import {Observable} from 'rxjs';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {PortfolioService} from '../../services/portfolio/portfolio.service';
import {ProductPage} from '../../services/portfolio/domain/product-page.model';
import {Product} from '../../services/portfolio/domain/product.model';

const noop: () => void = () => {
  // empty method
};

@Component({
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ProductSelectComponent), multi: true }
  ],
  selector: 'fims-product-select',
  templateUrl: './product-select.component.html'
})
export class ProductSelectComponent implements ControlValueAccessor, OnInit {

  formControl: FormControl;

  @Input() title: string;

  @Input() required: boolean;

  @Output() onProductSelected: EventEmitter<Product> = new EventEmitter<Product>();

  products: Observable<Product[]>;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.formControl = new FormControl('');

    this.products = this.formControl.valueChanges
      .distinctUntilChanged()
      .debounceTime(500)
      .do(product => {
        if(this.isObject(product)) {
          this.onProductSelected.emit(product)
        }
      })
      .map(product => this.isObject(product) ? product.name : product)
      .do(product => this.changeValue(product))
      .switchMap(name => this.onSearch(name));
  }

  private isObject(product: Product): boolean {
    return product && typeof product === 'object';
  }

  changeValue(value: string): void {
    this._onChangeCallback(value);
  }

  writeValue(value: any): void {
    this.formControl.setValue(value);
  }

  registerOnChange(fn: any): void {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouchedCallback = fn;
  }

  private _onTouchedCallback: () => void = noop;

  private _onChangeCallback: (_: any) => void = noop;

  onSearch(searchTerm?: string): Observable<Product[]> {
    let fetchRequest: FetchRequest = {
      page: {
        pageIndex: 0,
        size: 5
      },
      searchTerm: searchTerm
    };

    return this.portfolioService.findAllProducts(false, fetchRequest)
      .map((productPage: ProductPage) => productPage.elements);
  }

}

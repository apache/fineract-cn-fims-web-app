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

import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import {FetchRequest} from '../../services/domain/paging/fetch-request.model';
import {Observable} from 'rxjs';
import {Product} from '../../services/portfolio/domain/product.model';
import {PortfolioService} from '../../services/portfolio/portfolio.service';

@Component({
  selector: 'fims-product-select',
  templateUrl: './product-select.component.html'
})
export class ProductSelectComponent implements OnInit{

  @Input() title: string;

  @Input() preSelection: string[];

  @Output() onSelectionChange: EventEmitter<any> = new EventEmitter();

  products: Observable<Product[]>;

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit(): void {
    this.onSearch()
  }

  onSearch(searchTerm?: string): void{
    this.products = this.portfolioService.findAllProducts();
  }

  selectionChange(selections: string[]): void{
    this.onSelectionChange.emit(selections);
  }

}

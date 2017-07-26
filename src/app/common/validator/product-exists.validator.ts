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

import {AbstractControl, AsyncValidatorFn} from '@angular/forms';
import {Observable} from 'rxjs';
import {FetchRequest} from '../../services/domain/paging/fetch-request.model';
import {PortfolioService} from '../../services/portfolio/portfolio.service';

export function productExists(portfolioService: PortfolioService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<any> => {
    if (!control.dirty || !control.value || control.value.length === 0) return Observable.of(null);

    let fetchRequest: FetchRequest = {
      page: {
        pageIndex: 0,
        size: 1
      },
      searchTerm: control.value
    };

    return Observable.of(fetchRequest)
      .switchMap(fetchRequest => portfolioService.findAllProducts(false, fetchRequest))
      .map(productPage => productPage.elements)
      .map(products => {
        if(products.length === 1 && products[0].identifier === control.value){
          return null;
        }
        return {
          invalidProduct: true
        }
      });
  }
}

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

import {AsyncValidatorFn, AbstractControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {AccountingService} from '../../../../../../services/accounting/accounting.service';
import {FetchRequest} from '../../../../../../services/domain/paging/fetch-request.model';

export function transactionTypeExists(accountingService: AccountingService): AsyncValidatorFn {
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
      .switchMap(fetchRequest => accountingService.fetchTransactionTypes(fetchRequest))
      .map(transactionTypePage => transactionTypePage.transactionTypes)
      .map(transactionTypes => {
        if(transactionTypes.length === 1 && transactionTypes[0].code === control.value){
          return null;
        }
        return {
          invalidTransactionType: true
        }
      });
  }
}

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

import {Injectable} from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Catalog} from '../../../services/catalog/domain/catalog.model';
import {CatalogService} from '../../../services/catalog/catalog.service';
import {CustomerService} from '../../../services/customer/customer.service';
import {Command} from '../../../services/customer/domain/command.model';
import {AccountingService} from '../../../services/accounting/accounting.service';
import {AccountCommand} from '../../../services/accounting/domain/account-command.model';

@Injectable()
export class CommandsResolver implements Resolve<AccountCommand[]>{

  constructor(private accountingService: AccountingService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AccountCommand[]> {
    return this.accountingService.fetchAccountCommands(route.params['id'])
  }
}

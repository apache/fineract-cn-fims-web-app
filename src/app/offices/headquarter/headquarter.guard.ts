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
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {OfficeService} from '../../services/office/office.service';
import {OfficePage} from '../../services/office/domain/office-page.model';
import {Office} from '../../services/office/domain/office.model';

@Injectable()
export class HeadquarterGuard implements CanActivate {

  constructor(private officeService: OfficeService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const searchTerm = route.queryParams['term'];

    if (searchTerm) {
      return Observable.of(true);
    }

    return this.officeService.listOffices().map((officePage: OfficePage) => {
      if (officePage.totalElements) {
        const firstOffice: Office = officePage.offices[0];
        this.router.navigate(['offices/detail', firstOffice.identifier]);
      } else {
        this.router.navigate(['offices/hqNotFound']);
      }

      return false;
    });
  }
}

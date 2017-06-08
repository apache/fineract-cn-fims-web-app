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

import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';
import {Router} from '@angular/router';
import {Inject, Injectable} from '@angular/core';

@Injectable()
export class ExistsGuardService {

  constructor(private router: Router, @Inject('cacheExpiry') private cacheExpiry: number) {}

  isWithinExpiry(observable: Observable<number>): Observable<boolean> {
    return observable
      .map(loadedAtTimestamp => {
        if (!loadedAtTimestamp) {
          return false;
        }
        return loadedAtTimestamp + this.cacheExpiry > Date.now();
      })
      .take(1);
  }

  routeTo404OnError(observable: Observable<any>): Observable<any> {
    return observable.catch(() => {
      this.router.navigate(['/404']);
      return of(false);
    });
  }

}

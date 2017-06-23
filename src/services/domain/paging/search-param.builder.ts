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

import {URLSearchParams} from '@angular/http';
import {FetchRequest} from './fetch-request.model';
import {Page} from './page.model';
import {Sort} from './sort.model';

export function buildSearchParams(fetchRequest?: FetchRequest): URLSearchParams {
  const params = new URLSearchParams();

  fetchRequest = fetchRequest || {};

  const page: Page = fetchRequest.page || {pageIndex: 0, size: 10};
  const sort: Sort = fetchRequest.sort || {sortColumn: '', sortDirection: ''};

  params.append('term', fetchRequest.searchTerm ? fetchRequest.searchTerm : undefined);

  params.append('pageIndex', page.pageIndex !== undefined ? page.pageIndex.toString() : undefined);
  params.append('size', page.size ? page.size.toString() : undefined);

  params.append('sortColumn', sort.sortColumn ? sort.sortColumn : undefined);
  params.append('sortDirection', sort.sortDirection ? sort.sortDirection : undefined);

  return params;
}

export function buildDateRangeParam(startDate: string, endDate: string): string{
  return `${startDate}..${endDate}`;
}

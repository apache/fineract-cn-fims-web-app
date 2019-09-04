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

export type Status = 'PENDING' | 'ACTIVE' | 'CLOSED';
// export type Weekday = 'MONDAY(1)' | 'TUESDAY(2)' | 'WEDNESDAY(3)' | 'THURSDAY(4)' |
//                      'FRIDAY(5)' | 'SATURDAY(6)' | 'SUNDAY(7)';

export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;
import { Address } from '../../domain/address/address.model';

export interface Group {
    identifier: string;
    groupDefinitionIdentifier: string;
    name: string;
    leaders: string[];
    members: string[];
    office: string;
    assignedEmployee: string;
    weekday: number;
    status: Status;
    address: Address;
    applicationDate?: string;
    createdOn?: string;
    createdBy?: string;
    lastModifiedOn?: string;
    lastModifiedBy?: string;
}

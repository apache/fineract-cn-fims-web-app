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

import {CustomerState} from './customer-state.model';
import {CustomerType} from './customer-type.model';
import {DateOfBirth} from './date-of-birth.model';
import {IdentificationCard} from './identification-card.model';
import {Address} from '../../domain/address/address.model';
import {ContactDetail} from '../../domain/contact/contact-detail.model';
import {Value} from '../../catalog/domain/value.model';

export interface Customer {
  identifier: string;
  type: CustomerType;
  givenName: string;
  middleName?: string;
  surname: string;
  dateOfBirth: DateOfBirth;
  identificationCard?: IdentificationCard;
  accountBeneficiary?: string;
  referenceCustomer?: string;
  assignedOffice?: string;
  assignedEmployee?: string;
  address: Address;
  contactDetails?: ContactDetail[];
  currentState?: CustomerState;
  applicationDate?: string;
  customValues: Value[];
  member: boolean;
  createdBy?: string;
  createdOn?: string;
  lastModifiedBy?: string;
  lastModifiedOn?: string;
}

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
import {AccountAssignment} from '../../services/portfolio/domain/account-assignment.model';

export function findAccountDesignator(accountAssignments: AccountAssignment[], designator: string): AccountAssignment {
  return accountAssignments.find(assignment => assignment.designator === designator);
}

export function createAccountAssignment(identifier: string, designator: string): AccountAssignment {
  return {
    accountIdentifier: identifier,
    designator: designator
  };
}

export function createLedgerAssignment(identifier: string, designator: string): AccountAssignment {
  return {
    ledgerIdentifier: identifier,
    designator: designator
  };
}

export function accountIdentifier(assignment: AccountAssignment): string {
  return assignment ? assignment.accountIdentifier : undefined;
}

export function ledgerIdentifier(assignment: AccountAssignment): string {
  return assignment ? assignment.ledgerIdentifier : undefined;
}

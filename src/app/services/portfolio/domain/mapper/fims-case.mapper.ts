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
import {Case} from '../case.model';
import {AccountDesignators} from '../individuallending/account-designators.model';
import {accountIdentifier, findAccountDesignator} from '../../../../common/util/account-assignments';
import {FimsCase} from '../fims-case.model';

export function mapToCase(caseInstance: FimsCase): Case {
  return Object.assign({}, caseInstance, {
    parameters: JSON.stringify(caseInstance.parameters),
    accountAssignments: [
      {accountIdentifier: caseInstance.depositAccountIdentifier, designator: AccountDesignators.ENTRY}
    ]
  });
}

export function mapToFimsCase(caseInstance: Case): FimsCase {
  const entryDesignator = findAccountDesignator(caseInstance.accountAssignments, AccountDesignators.ENTRY);
  const customerLoanDesignator = findAccountDesignator(caseInstance.accountAssignments, AccountDesignators.CUSTOMER_LOAN_PRINCIPAL);

  return Object.assign({}, caseInstance, {
    parameters: JSON.parse(caseInstance.parameters),
    depositAccountIdentifier: accountIdentifier(entryDesignator),
    customerLoanAccountIdentifier: accountIdentifier(customerLoanDesignator),
  });
}

export function mapToFimsCases(caseInstances: Case[]): FimsCase[] {
  return caseInstances.map(instance => mapToFimsCase(instance));
}

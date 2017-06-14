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

import {FimsPermissionDescriptor} from './fims-permission-descriptor';
import {IdentityPermittableGroupIds} from '../../identity/domain/permittable-group-ids.model';
import {OfficePermittableGroupIds} from '../../office/domain/permittable-group-ids.model';
import {CustomerPermittableGroupIds} from '../../customer/domain/permittable-group-ids';
import {AccountingPermittableGroupIds} from '../../accounting/domain/permittable-group-ids';
import {PortfolioPermittableGroupIds} from '../../portfolio/domain/permittable-group-ids';
import {PermissionId} from './permission-id.type';
import {Injectable} from '@angular/core';
import {DepositAccountPermittableGroupIds} from '../../depositAccount/domain/permittable-group-ids';
import {TellerPermittableGroupIds} from '../../teller/domain/permittable-group-ids';

interface PermittableGroupMap {
  [s: string]: FimsPermissionDescriptor;
}

/**
 * Maps permittable group ids to internal keys
 */
@Injectable()
export class PermittableGroupIdMapper {

  private _permittableGroupMap: PermittableGroupMap = {};

  constructor() {
    this._permittableGroupMap[OfficePermittableGroupIds.EMPLOYEE_MANAGEMENT] = { id: 'office_employees', label: 'Employees' };
    this._permittableGroupMap[OfficePermittableGroupIds.OFFICE_MANAGEMENT] = { id: 'office_offices', label: 'Offices' };
    this._permittableGroupMap[OfficePermittableGroupIds.SELF_MANAGEMENT] = { id: 'office_self', label: 'User created resources(Offices & Employees)' };

    this._permittableGroupMap[IdentityPermittableGroupIds.IDENTITY_MANAGEMENT] = { id: 'identity_identities', label: 'Identities' };
    this._permittableGroupMap[IdentityPermittableGroupIds.ROLE_MANAGEMENT] = { id: 'identity_roles', label: 'Roles' };
    this._permittableGroupMap[IdentityPermittableGroupIds.SELF_MANAGEMENT] = { id: 'identity_self', label: 'User created resources(Identity & Roles)' };

    this._permittableGroupMap[CustomerPermittableGroupIds.CUSTOMER_MANAGEMENT] = { id: 'customer_customers', label: 'Customers' };
    this._permittableGroupMap[CustomerPermittableGroupIds.TASK_MANAGEMENT] = { id: 'customer_tasks', label: 'Tasks' };
    this._permittableGroupMap[CustomerPermittableGroupIds.CATALOG_MANAGEMENT] = { id: 'catalog_catalogs', label: 'Custom fields' };
    this._permittableGroupMap[CustomerPermittableGroupIds.IDENTITY_CARD_MANAGEMENT] = { id: 'customer_identifications', label: 'Customer identification cards' };
    this._permittableGroupMap[CustomerPermittableGroupIds.PORTRAIT_MANAGEMENT] = { id: 'customer_portrait', label: 'Customer portrait' };

    this._permittableGroupMap[AccountingPermittableGroupIds.ACCOUNT_MANAGEMENT] = { id: 'accounting_accounts', label: 'Accounts' };
    this._permittableGroupMap[AccountingPermittableGroupIds.JOURNAL_MANAGEMENT] = { id: 'accounting_journals', label: 'Journal' };
    this._permittableGroupMap[AccountingPermittableGroupIds.LEDGER_MANAGEMENT] = { id: 'accounting_ledgers', label: 'Ledger' };
    this._permittableGroupMap[AccountingPermittableGroupIds.TRANSACTION_TYPES] = { id: 'accounting_tx_types', label: 'Transaction types' };

    this._permittableGroupMap[PortfolioPermittableGroupIds.PRODUCT_OPERATIONS_MANAGEMENT] = { id: 'portfolio_product_operations', label: 'Loan product operations' };
    this._permittableGroupMap[PortfolioPermittableGroupIds.PRODUCT_MANAGEMENT] = { id: 'portfolio_products', label: 'Loan products' };
    this._permittableGroupMap[PortfolioPermittableGroupIds.CASE_MANAGEMENT] = { id: 'portfolio_cases', label: 'Customer loans' };

    this._permittableGroupMap[DepositAccountPermittableGroupIds.DEFINITION_MANAGEMENT] = { id: 'deposit_definitions', label: 'Deposit account management' };
    this._permittableGroupMap[DepositAccountPermittableGroupIds.INSTANCE_MANAGEMENT] = { id: 'deposit_instances', label: 'Deposit account for customers' };

    this._permittableGroupMap[TellerPermittableGroupIds.TELLER_MANAGEMENT] = { id: 'teller_management', label: 'Teller management' };
    this._permittableGroupMap[TellerPermittableGroupIds.TELLER_OPERATION] = { id: 'teller_operations', label: 'Teller operations' };
  }

  public map(permittableGroupId: string): FimsPermissionDescriptor {
    let descriptor: FimsPermissionDescriptor = this._permittableGroupMap[permittableGroupId];
    if(!descriptor){
      console.warn(`Could not find permission descriptor for permittable group id '${permittableGroupId}'`)
    }
    return descriptor;
  }

  public isValid(id: PermissionId): boolean {
    for(let key in this._permittableGroupMap){
      let descriptor: FimsPermissionDescriptor = this._permittableGroupMap[key];
      if(descriptor.id === id) return true;
    }
    return false;
  }

}

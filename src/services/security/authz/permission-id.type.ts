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

/**
 * List of supported permission ids for fims
 */
export type PermissionId = 'identity_self' | 'identity_identities' | 'identity_roles' |
  'office_self' | 'office_offices' | 'office_employees' |
  'customer_customers' | 'customer_tasks' | 'catalog_catalogs' | 'customer_identifications' | 'customer_portrait' |
  'accounting_accounts' | 'accounting_ledgers' | 'accounting_journals' | 'accounting_tx_types' |
  'portfolio_product_operations' | 'portfolio_products' | 'portfolio_cases' |
  'deposit_definitions' | 'deposit_instances' |
  'teller_management' | 'teller_operations';

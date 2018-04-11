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
/**
 * List of supported permission ids for fims
 */
export type PermissionId = 'identity_self' | 'identity_identities' | 'identity_roles' |
  'office_self' | 'office_offices' | 'office_employees' |
  'customer_customers' | 'customer_tasks' | 'catalog_catalogs' | 'customer_identifications' | 'customer_portrait' | 'customer_documents' |
  'accounting_accounts' | 'accounting_ledgers' | 'accounting_journals' | 'accounting_tx_types' | 'accounting_income_statement' |
  'accounting_fin_condition' |
  'portfolio_product_operations' | 'portfolio_loss_provision' | 'portfolio_products' | 'portfolio_cases' | 'portfolio_documents' |
  'deposit_definitions' | 'deposit_instances' |
  'teller_management' | 'teller_operations' |
  'reporting_management' |
  'cheque_management' | 'cheque_transaction' |
  'payroll_configuration' | 'payroll_distribution';

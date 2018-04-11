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
 * A debit is an accounting entry that either increases an asset or expense account, or decreases a liability or equity account.
 * It is positioned to the left in an accounting entry.
 *
 * A credit is an accounting entry that either increases a liability or equity account, or decreases an asset or expense account.
 */

export class AccountDesignators {

  public static readonly CUSTOMER_LOAN_GROUP = 'cll';

  public static readonly CUSTOMER_LOAN_PRINCIPAL = 'clp';

  public static readonly CUSTOMER_LOAN_INTEREST = 'cli';

  public static readonly CUSTOMER_LOAN_FEES = 'clf';

  public static readonly LOAN_FUNDS_SOURCE = 'ls';

  public static readonly PROCESSING_FEE_INCOME = 'pfi';

  public static readonly ORIGINATION_FEE_INCOME = 'ofi';

  public static readonly DISBURSEMENT_FEE_INCOME = 'dfi';

  public static readonly INTEREST_INCOME = 'ii';

  public static readonly INTEREST_ACCRUAL = 'ia';

  public static readonly LATE_FEE_INCOME = 'lfi';

  public static readonly LATE_FEE_ACCRUAL = 'lfa';

  public static readonly PRODUCT_LOSS_ALLOWANCE = 'pa';

  public static readonly GENERAL_LOSS_ALLOWANCE = 'aa';

  public static readonly GENERAL_EXPENSE = 'ge';

  public static readonly ENTRY = 'ey';

}

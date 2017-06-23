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
 * A debit is an accounting entry that either increases an asset or expense account, or decreases a liability or equity account.
 * It is positioned to the left in an accounting entry.
 *
 * A credit is an accounting entry that either increases a liability or equity account, or decreases an asset or expense account.
 */

export class AccountDesignators{

  public static readonly CUSTOMER_LOAN: string = "customer-loan";

  public static readonly PENDING_DISBURSAL: string = "pending-disbursal";

  public static readonly LOAN_FUNDS_SOURCE: string = "loan-funds-source";

  public static readonly PROCESSING_FEE_INCOME = "processing-fee-income";

  public static readonly ORIGINATION_FEE_INCOME = "origination-fee-income";

  public static readonly DISBURSEMENT_FEE_INCOME = "disbursement-fee-income";

  public static readonly INTEREST_INCOME = "interest-income";

  public static readonly INTEREST_ACCRUAL = "interest-accrual";

  public static readonly LATE_FEE_INCOME = "late-fee-income";

  public static readonly LATE_FEE_ACCRUAL = "late-fee-accrual";

  public static readonly ARREARS_ALLOWANCE = "arrears-allowance";

  public static readonly ENTRY = "entry";

}

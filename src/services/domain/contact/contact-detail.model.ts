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

export interface ContactDetail{
  type: ContactDetailType,
  group: ContactDetailGroup,
  value: string,
  preferenceLevel: number
}

export const BUSINESS: string = 'BUSINESS';
export const PRIVATE: string = 'PRIVATE';

export type ContactDetailGroup = 'BUSINESS' | 'PRIVATE';

export const EMAIL: string = 'EMAIL';
export const PHONE: string = 'PHONE';
export const MOBILE: string = 'MOBILE';

export type ContactDetailType = 'EMAIL' | 'PHONE' | 'MOBILE';

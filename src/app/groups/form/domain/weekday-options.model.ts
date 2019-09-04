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
import { Weekday } from '../../../services/group/domain/group.model';

interface WeekdayOption {
  type: Weekday;
  label: string;
}

export const WeekdayOptionList: WeekdayOption[] = [
  { type: 1, label: 'Monday' },
  { type: 2, label: 'Tuesday' },
  { type: 3, label: 'Wednesday' },
  { type: 4, label: 'Thursday' },
  { type: 5, label: 'Friday' },
  { type: 6, label: 'Saturday' },
  { type: 7, label: 'Sunday' },

];

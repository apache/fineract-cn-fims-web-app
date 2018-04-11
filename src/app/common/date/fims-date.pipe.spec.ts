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
import {DisplayFimsDate} from './fims-date.pipe';
import {FimsDate} from '../../services/domain/date.converter';

describe('DisplayFimsDate', () => {
  it('should show short date by default', () => {
    const pipe = new DisplayFimsDate('en-US');

    const fimsDate: FimsDate = {
      day: 1,
      month: 1,
      year: 2017
    };

    expect(pipe.transform(fimsDate)).toBe('1/1/2017');
  });

  it('should not add tz offset', () => {
    const pipe = new DisplayFimsDate('en-US');

    const fimsDate: FimsDate = {
      day: 1,
      month: 1,
      year: 2017
    };

    expect(pipe.transform(fimsDate, 'shortTime')).toBe('12:00 AM');
  });
});

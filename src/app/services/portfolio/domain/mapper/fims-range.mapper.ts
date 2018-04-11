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
import {BalanceSegmentSet} from '../balance-segment-set.model';
import {FimsRange} from '../range-model';

export function mapToBalanceSegmentSet(range: FimsRange): BalanceSegmentSet {
  const balanceSegmentSet: BalanceSegmentSet = {
    identifier: range.identifier,
    segments: range.segments.map(segment => segment.start),
    segmentIdentifiers: range.segments.map(segment => segment.identifier)
  };

  return balanceSegmentSet;
}

export function mapToFimsRanges(balanceSegmentSets: BalanceSegmentSet[]): FimsRange[] {
  return balanceSegmentSets.map(set => mapToFimsRange(set));
}

export function mapToFimsRange(balanceSegmentSet: BalanceSegmentSet): FimsRange {
  return {
    identifier: balanceSegmentSet.identifier,
    segments: balanceSegmentSet.segments.map((segment, index, array) => ({
      identifier: balanceSegmentSet.segmentIdentifiers[index],
      start: segment,
      end: hasNextIndex(array, index) ? array[index + 1] : undefined
    }))
  };
}

function hasNextIndex(array: number[], index: number): boolean {
  return array.length - 1 > index;
}

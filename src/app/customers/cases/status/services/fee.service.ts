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
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {PortfolioService} from '../../../../services/portfolio/portfolio.service';
import {Payment} from '../../../../services/portfolio/domain/payment.model';
import {ChargeDefinition} from '../../../../services/portfolio/domain/charge-definition.model';
import {Fee} from './domain/fee.model';

@Injectable()
export class FeeService {

  constructor(private portfolioService: PortfolioService) {}

  getFees(productIdentifier: string, caseIdentifier: string, action: string): Observable<Fee[]> {
    return Observable.combineLatest(
      this.portfolioService.getCostComponentsForAction(productIdentifier, caseIdentifier, action),
      this.portfolioService.findAllChargeDefinitionsForProduct(productIdentifier),
      (payment, chargeDefinitions) => ({
        payment,
        chargeDefinitions
      }))
      .map(result => this.map(result.payment, result.chargeDefinitions));
  }

  private map(payment: Payment, chargeDefinitions: ChargeDefinition[]): Fee[] {
    return payment.costComponents.reduce((fees, component) => {
      const foundDefinition = chargeDefinitions.find(definition => definition.identifier === component.chargeIdentifier);

      if (foundDefinition) {
        return fees.concat({
          name: foundDefinition.name,
          description: foundDefinition.description,
          amount: component.amount
        });
      }

      return fees;
    }, []);
  }

}

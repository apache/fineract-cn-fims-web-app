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
import {NotificationService, NotificationType} from '../../services/notification/notification.service';
import {TellerService} from '../../services/teller/teller-service';
import {TellerTransaction} from '../../services/teller/domain/teller-transaction.model';
import {Observable} from 'rxjs/Observable';
import {TellerTransactionCosts} from '../../services/teller/domain/teller-transaction-costs.model';

@Injectable()
export class TellerTransactionService {

  constructor(private tellerService: TellerService, private notificationService: NotificationService) {
  }

  createTransaction(tellerCode: string, tellerTransaction: TellerTransaction): Observable<TellerTransactionCosts> {
    return this.tellerService.createTransaction(tellerCode, tellerTransaction)
      .catch((error: Error) => {
        this.notificationService.send({
          type: NotificationType.ALERT,
          title: 'Invalid transaction',
          message: error.message
        });
        return Observable.empty();
      });
  }
}

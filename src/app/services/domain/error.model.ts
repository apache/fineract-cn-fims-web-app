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
import {Observable} from 'rxjs/Observable';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';

export class Error {
  status: number;
  statusText: string;
  message: string;

  static handleError(errorResponse: any): ErrorObservable {
    const error: Error = new Error(errorResponse.status, errorResponse.statusText, errorResponse.message);

    console.error(error.getErrorMessage());

    return Observable.throw(error);
  }

  constructor(status: number, statusText: string, message: string) {
    this.status = status;
    this.message = message;
    this.statusText = statusText;
  }

  getErrorMessage(): string {
    const errMsg: string = (this.message)
      ? this.message
      : this.status ? `${this.status} - ${this.statusText}` : 'Server error';
    return errMsg;
  }

}

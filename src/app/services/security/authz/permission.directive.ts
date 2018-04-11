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
import {Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {FimsPermission} from './fims-permission.model';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../store';
import {Subscription} from 'rxjs/Subscription';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[hasPermission]'
})
export class PermissionDirective implements OnInit, OnDestroy {

  private permissionSubscription: Subscription;

  @Input('hasPermission') hasPermission: FimsPermission;

  constructor(private store: Store<fromRoot.State>, private viewContainer: ViewContainerRef, private template: TemplateRef<Object>) {
  }

  ngOnInit(): void {
    this.viewContainer.clear();

    if (!this.hasPermission) {
      this.viewContainer.createEmbeddedView(this.template);
      return;
    }

    this.permissionSubscription = this.store.select(fromRoot.getPermissions)
      .map(permissions => permissions.filter(permission => permission.id === this.hasPermission.id
        && permission.accessLevel === this.hasPermission.accessLevel
      ))
      .map(matches => matches.length > 0)
      .subscribe(hasPermission => {
        this.viewContainer.clear();
        if (hasPermission) {
          this.viewContainer.createEmbeddedView(this.template);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.permissionSubscription) {
      this.permissionSubscription.unsubscribe();
    }
  }
}

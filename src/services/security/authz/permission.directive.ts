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
import {Directive, Input, ViewContainerRef, TemplateRef, OnInit, OnDestroy} from '@angular/core';
import {FimsPermission} from './fims-permission.model';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../app/reducers';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[hasPermission]'
})
export class PermissionDirective implements OnInit, OnDestroy{

  private permissionSubscription: Subscription;

  @Input('hasPermission') permission: FimsPermission;

  constructor(private store: Store<fromRoot.State>, private viewContainer: ViewContainerRef, private template: TemplateRef<Object>) {}

  ngOnInit(): void {
    this.viewContainer.clear();

    if(!this.permission){
      this.viewContainer.createEmbeddedView(this.template);
      return;
    }

    this.permissionSubscription = this.store.select(fromRoot.getPermissions)
      .map(permissions => permissions.filter(permission => permission.id === this.permission.id && permission.accessLevel === this.permission.accessLevel))
      .map(matches => matches.length > 0)
      .subscribe(hasPermission => {
        this.viewContainer.clear();
        if(hasPermission){
          this.viewContainer.createEmbeddedView(this.template)
        }
      });
  }

  ngOnDestroy(): void {
    this.permissionSubscription.unsubscribe();
  }
}

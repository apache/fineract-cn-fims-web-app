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
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterState } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Action, HttpClient } from '../services/http/http.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../store';
import { LOGOUT } from '../store/security/security.actions';
import { Observable } from 'rxjs/Observable';
import { FimsPermission } from '../services/security/authz/fims-permission.model';
import { CountryService } from '../services/country/country.service';
import { TdMediaService } from '@covalent/core';
import { Subscription } from 'rxjs/Subscription';
import { MatSidenav } from '@angular/material';

interface MenuItem {
  permission?: FimsPermission;
  icon: string;
  title: string;
  description?: string;
  routerLink: string;
}

@Component({
  selector: 'fims-main',
  templateUrl: './main.component.html',
  styleUrls: ['main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {

  private routerEventSubscription: Subscription;

  @ViewChild(MatSidenav) sidenav: MatSidenav;

  menuItems: MenuItem[] = [
    { title: 'Quick access', icon: 'dashboard', routerLink: '/quickAccess' },
    {
      title: 'Offices',
      description: 'Manage offices',
      icon: 'store',
      routerLink: '/offices',
      permission: { id: 'office_offices', accessLevel: 'READ' }
    },
    {
      title: 'Roles/Permissions',
      description: 'Manage roles and permissions',
      icon: 'https',
      routerLink: '/roles',
      permission: { id: 'identity_roles', accessLevel: 'READ' }
    },
    {
      title: 'Employees',
      description: 'Manage employees',
      icon: 'group',
      routerLink: '/employees',
      permission: { id: 'office_employees', accessLevel: 'READ' }
    },
    {
      title: 'Accounting',
      description: 'Manage ledger accounts',
      icon: 'receipt',
      routerLink: '/accounting',
      permission: { id: 'accounting_ledgers', accessLevel: 'READ' }
    },


    {
      title: 'Groups',
      description: 'Manage groups',
      icon: 'group',
      routerLink: '/groups',
      permission: { id: 'group_groups', accessLevel: 'READ' }
    },

    {
      title: 'Member',
      description: 'Manage members',
      icon: 'face',
      routerLink: '/customers',
      permission: { id: 'customer_customers', accessLevel: 'READ' }
    },
    {
      title: 'Loan products',
      description: 'Manage loan products',
      icon: 'credit_card',
      routerLink: '/loans',
      permission: { id: 'portfolio_products', accessLevel: 'READ' }
    },
    {
      title: 'Deposit',
      description: 'Account management',
      icon: 'attach_money',
      routerLink: '/deposits',
      permission: { id: 'deposit_definitions', accessLevel: 'READ' }
    },
    {
      title: 'Teller',
      description: 'Teller management',
      icon: 'person',
      routerLink: '/teller',
      permission: { id: 'teller_operations', accessLevel: 'READ' }
    },
    {
      title: 'Reports',
      description: 'View reports',
      icon: 'show_chart',
      routerLink: '/reports',
      permission: { id: 'reporting_management', accessLevel: 'READ' }
    },
  ];

  isLoading$: Observable<boolean>;

  isOpened$: Observable<boolean>;

  tenant$: Observable<string>;

  username$: Observable<string>;

  constructor(private router: Router, private titleService: Title, private httpClient: HttpClient, private countryService: CountryService,
    private store: Store<fromRoot.State>, private media: TdMediaService) { }

  ngOnInit(): void {
    this.routerEventSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.getTitle(this.router.routerState, this.router.routerState.root).join(' - '))
      .subscribe(title => this.titleService.setTitle(title));

    this.tenant$ = this.store.select(fromRoot.getTenant);
    this.username$ = this.store.select(fromRoot.getUsername);
    this.isOpened$ = this.media.registerQuery('gt-md');

    this.countryService.init();
  }

  ngOnDestroy(): void {
    this.routerEventSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.isLoading$ = this.httpClient.process
      .debounceTime(1000)
      .map((action: Action) => action === Action.QueryStart);

    this.media.broadcast();
  }

  getTitle(state: RouterState, parent: ActivatedRoute): string[] {
    const data = [];

    if (parent && parent.snapshot.data) {
      const dataProperty: any = parent.snapshot.data;

      if (dataProperty.title) {
        data.push(dataProperty.title);
      }
    }

    if (state && parent) {
      data.push(... this.getTitle(state, parent.firstChild));
    }

    return data;
  }

  toggleSideNav(): void {
    this.sidenav.toggle(!this.sidenav.opened);
  }

  logout(): void {
    this.store.dispatch({ type: LOGOUT });
  }

  goToSettings(): void {
    this.router.navigate(['/user']);
  }
}

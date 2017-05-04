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
import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Router, NavigationEnd, ActivatedRoute, RouterState} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {HttpClient, Action} from '../../services/http/http.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../reducers';
import {LOGOUT} from '../reducers/security/security.actions';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'fims-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit, AfterViewInit {

  icon: string;

  logo: string;

  isLoading$: Observable<boolean>;

  title: string;

  tenant$: Observable<string>;

  username$: Observable<string>;

  constructor(private router: Router, private titleService: Title, private httpClient: HttpClient, private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        let title = this.getTitle(this.router.routerState, this.router.routerState.root).join(" - ");
        this.titleService.setTitle(title);
        this.title = title;
      }
    });

    this.tenant$ = this.store.select(fromRoot.getTenant);
    this.username$ = this.store.select(fromRoot.getUsername)
  }

  ngAfterViewInit(): void {
    this.isLoading$ = this.httpClient.process
      .debounceTime(1000)
      .map((action: Action) => action === Action.QueryStart);
  }

  getTitle(state: RouterState, parent: ActivatedRoute){
    let data = [];

    if(parent && parent.snapshot.data){
      let dataProperty: any = parent.snapshot.data;

      if(dataProperty.title){
        data.push(dataProperty.title);
      }
    }

    if(state && parent){
      data.push(... this.getTitle(state, parent.firstChild));
    }

    return data;
  }

  logout(): void {
    this.store.dispatch({ type: LOGOUT });
  }

  goToSettings(): void {
    this.router.navigate(['/user']);
  }
}

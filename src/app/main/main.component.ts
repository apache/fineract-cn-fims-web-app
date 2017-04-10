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

@Component({
  selector: 'fims-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit, AfterViewInit {

  icon: string;

  logo: string;

  isLoading: boolean;

  title: string;

  constructor(private router: Router, private titleService: Title, private httpClient: HttpClient, private store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        let title = this.getTitle(this.router.routerState, this.router.routerState.root).join(" - ");
        this.titleService.setTitle(title);
        this.title = title;
      }
    });
  }

  ngAfterViewInit(): void {
    this.httpClient.process.subscribe((action: Action) => {
      if(action === Action.QueryStart){
        this.isLoading = true;
      }else if(action === Action.QueryStop){
        this.isLoading = false;
      }
    });


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

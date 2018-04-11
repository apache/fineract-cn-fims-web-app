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
import {Component, Directive, EventEmitter, Input, OnInit, Output} from '@angular/core';

// tslint:disable-next-line:directive-selector
@Directive({selector: 'fims-layout-card-over-header-menu'})
export class LayoutCardOverComponentTagsDirective { }

@Component({
  selector: 'fims-layout-card-over',
  templateUrl: './layout-card-over.component.html',
  styleUrls: ['./layout-card-over.component.scss']
})
export class LayoutCardOverComponent implements OnInit {

  @Input() title: string;

  @Input() subTitle: string;

  @Input() navigateBackTo: string[];

  @Input() searchTerm: string;

  @Input() searchable: boolean;

  @Output() search: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit(): void {}

  onSearch(searchTerm: string): void {
    this.search.emit(searchTerm);
  }

  get fullTitle(): string {
    const titles = [this.title, this.subTitle];
    return titles.filter(title => !!title).join(' - ');
  }
}

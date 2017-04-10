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

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'fims-select-list',
  templateUrl: './select-list.component.html'
})
export class SelectListComponent implements OnInit{

  selections: string[];

  term = new FormControl();

  @Input('preSelection') set preSelection(preSelection: string | string[]){
    preSelection = preSelection || [];
    let selections: string[] = Array.isArray(preSelection) ? preSelection : [preSelection];
    this.selections = selections;
  };

  @Input('listIcon') listIcon: string;

  @Input('noResultsMessage') noResultsMessage: string;

  @Input('noSelectionMessage') noSelectionMessage: string;

  @Input('data') data: Observable<any[]>;

  @Input('id') id: string;

  @Input('title') title: string;

  @Input('multiple') multiple: boolean = false;

  @Output() onSearch = new EventEmitter<string>();

  @Output() onSelectionChange = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {
    this.term.valueChanges
      .debounceTime(500)
      .subscribe((event) => this.onSearch.emit(event))
  }

  doSelect(id: any): void {
    if(this.selections.indexOf(id) > -1) return;

    if(this.multiple){
      this.selections.push(id);
    }else{
      this.selections = [id];
    }

    this.onSelectionChange.emit(this.selections);
  }

  doDeselect(id: any): void{
    let index = this.selections.indexOf(id);

    if(index > -1){
      this.selections.splice(index, 1);
    }

    this.onSelectionChange.emit(this.selections);
  }
}

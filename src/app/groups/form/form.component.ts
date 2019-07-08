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
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TdStepComponent } from '@covalent/core';
import { Group } from '../../services/group/domain/group.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupDetailFormData, GroupDetailFormComponent } from './detail/detail.component';
import { AddressFormComponent } from '../../common/address/address.component';
import { Address } from '../../services/domain/address/address.model';

@Component({
  selector: 'fims-group-form-component',
  templateUrl: './form.component.html'
})
export class GroupFormComponent implements OnInit {

  private _group: Group;
  @Input('editMode') editMode: boolean;

  @Output('onSave') onSave = new EventEmitter<Group>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  @ViewChild('detailsStep') step: TdStepComponent;

  @ViewChild('detailForm') detailForm: GroupDetailFormComponent;
  detailFormData: GroupDetailFormData;

  @ViewChild('addressForm') addressForm: AddressFormComponent;
  addressFormData: Address;

  selectedOffices: string[] = [];

  selectedEmployees: string[] = [];

  selectedLeaders: string[] = [];

  selectedMembers: string[] = [];


  constructor(private router: Router, private route: ActivatedRoute) { }

  @Input('group') set group(group: Group) {

    this._group = group;

    this.detailFormData = {
      identifier: group.identifier,
      name: group.name,
      groupDefinitionIdentifier: group.groupDefinitionIdentifier,
      weekday: group.weekday
    };

    this.addressFormData = group.address;

    this.selectedOffices = group.office ? [group.office] : [];

    this.selectedEmployees = group.assignedEmployee ? [group.assignedEmployee] : [];

    this.selectedLeaders = group.leaders;

    this.selectedMembers = group.members;

  };

  ngOnInit() {
    this.openDetailStep();
  }

  openDetailStep(): void {
    this.step.open();
  }

  showIdentifierValidationError(): void {
    this.detailForm.setError('identifier', 'unique', true);
    this.openDetailStep();
  }

  selectOffice(selections: string[]): void {
    this.selectedOffices = selections;
  }

  selectEmployee(selections: string[]): void {
    this.selectedEmployees = selections;
  }
  selectMembers(selections: string[]): void {
    this.selectedMembers = selections;
  }

  selectLeaders(selections: string[]): void {
    this.selectedLeaders = selections;
  }

  get isValid(): boolean {
    return (this.detailForm.valid && this.addressForm.valid)
  }

  get group(): Group {
    return this._group;
  }

  save() {
    const detailFormData = this.detailForm.formData;

    const group: Group = {
      identifier: detailFormData.identifier,
      groupDefinitionIdentifier: detailFormData.groupDefinitionIdentifier,
      name: detailFormData.name,
      address: this.addressForm.formData,
      status: 'PENDING',
      weekday: detailFormData.weekday,
      office: this.selectedOffices && this.selectedOffices.length > 0 ? this.selectedOffices[0] : undefined,
      assignedEmployee: this.selectedEmployees && this.selectedEmployees.length > 0 ? this.selectedEmployees[0] : undefined,
      leaders: this.selectedLeaders && this.selectedLeaders.length > 0 ? this.selectedLeaders : undefined,
      members: this.selectedMembers && this.selectedMembers.length > 0 ? this.selectedMembers : undefined,
    };

    this.onSave.emit(group);

  }

  cancel() {
    this.onCancel.emit();
  }

}

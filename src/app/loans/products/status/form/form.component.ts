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

import {Component, OnInit, Input, EventEmitter, Output, ViewChild} from '@angular/core';
import {TaskDefinition} from '../../../../../services/portfolio/domain/task-definition.model';
import {TdStepComponent} from '@covalent/core';
import {FormGroup, FormBuilder, Validators, FormArray, AbstractControl} from '@angular/forms';
import {ActionOption} from '../../../../../common/domain/action-option.model';
import {WorkflowAction} from '../../../../../services/portfolio/domain/individuallending/workflow-action.model';
import {FimsValidators} from '../../../../../common/validator/validators';

@Component({
  selector: 'fims-product-task-form-component',
  templateUrl: './form.component.html'
})
export class ProductTaskFormComponent implements OnInit{

  @Input('task') set task(task: TaskDefinition){
    this.prepareDetailForm(task);
  };

  @Input('editMode') editMode: boolean;

  @Output('onSave') onSave = new EventEmitter<TaskDefinition>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  @ViewChild('detailsStep') detailsStep: TdStepComponent;

  detailForm: FormGroup;

  actionOptions: ActionOption[] = [
    { type: 'OPEN', label: 'can be opened' },
    { type: 'DENY', label: 'can be denied' },
    { type: 'APPROVE', label: 'can be approved' },
    { type: 'DISBURSE', label: 'can be disbursed' },
    { type: 'WRITE_OFF', label: 'can be written off' },
    { type: 'CLOSE', label: 'can be closed' },
    { type: 'RECOVER', label: 'can recovered' },
    { type: 'ACCEPT_PAYMENT', label: 'can be repayed' },
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.openDetailsStep();
  }

  openDetailsStep(): void{
    this.detailsStep.open();
  }

  private prepareDetailForm(task: TaskDefinition) {
    this.detailForm = this.formBuilder.group({
      identifier: [task.identifier, [Validators.required, Validators.minLength(3), Validators.maxLength(32), FimsValidators.urlSafe()]],
      name: [task.name, [Validators.required]],
      description: [task.description, [Validators.required]],
      actions: this.initActions(task.actions),
      fourEyes: [task.fourEyes, [Validators.required]],
      mandatory: [task.mandatory, [Validators.required]],
    });
  }

  private initActions(values: string[]): FormArray{
    let formControls: FormGroup[] = [];
    values.forEach(value => formControls.push(this.initAction(value)));
    return this.formBuilder.array(formControls);
  }

  private initAction(value?: string): FormGroup{
    return this.formBuilder.group({
      action: [value ? value : '', Validators.required]
    })
  }

  addAction(): void{
    let actions: FormArray = this.detailForm.get('actions') as FormArray;
    actions.push(this.initAction());
  }

  removeAction(index: number): void{
    let actions: FormArray = this.detailForm.get('actions') as FormArray;
    actions.removeAt(index);
  }

  get actions(): AbstractControl[] {
    const actions: FormArray = this.detailForm.get('actions') as FormArray;
    return actions.controls;
  }

  save(): void{
    let actions: any[] = this.detailForm.get('actions').value;
    let rawActions: WorkflowAction[] = [];
    actions.forEach(action => rawActions.push(action.action));

    let task: TaskDefinition = {
      identifier: this.detailForm.get('identifier').value,
      name: this.detailForm.get('name').value,
      description: this.detailForm.get('description').value,
      actions: rawActions,
      fourEyes: this.detailForm.get('fourEyes').value,
      mandatory: this.detailForm.get('mandatory').value
    };
    this.onSave.emit(task);
  }

  cancel(): void{
    this.onCancel.emit();
  }

}

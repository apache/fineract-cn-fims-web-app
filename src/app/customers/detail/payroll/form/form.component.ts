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
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {PayrollDistribution} from '../../../../services/customer/domain/payroll-distribution.model';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TdStepComponent} from '@covalent/core';
import {FimsValidators} from '../../../../common/validator/validators';
import {ProductInstance} from '../../../../services/depositAccount/domain/instance/product-instance.model';
import {PayrollAllocation} from '../../../../services/customer/domain/payroll-allocation.model';

@Component({
  selector: 'fims-customer-payroll-form',
  templateUrl: './form.component.html'
})
export class CustomerPayrollFormComponent implements OnChanges {

  form: FormGroup;

  @ViewChild('detailsStep') detailsStep: TdStepComponent;

  @Input('productInstances') productInstances: ProductInstance[];

  @Input('distribution') distribution: PayrollDistribution;

  @Output('onSave') onSave = new EventEmitter<PayrollDistribution>();

  @Output('onCancel') onCancel = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      mainAccountNumber: ['', [Validators.required]],
      payrollAllocations: this.initAllocations([])
    });
  }

  ngOnInit(): void {
    this.detailsStep.open();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.distribution) {
      this.form.reset({
        mainAccountNumber: this.distribution.mainAccountNumber
      });

      this.distribution.payrollAllocations.forEach(allocation => this.addAllocation(allocation));
    }
  }

  save(): void {
    const distribution: PayrollDistribution = {
      mainAccountNumber: this.form.get('mainAccountNumber').value,
      payrollAllocations: this.form.get('payrollAllocations').value
    };

    this.onSave.emit(distribution);
  }

  cancel(): void {
    this.onCancel.emit();
  }

  private initAllocations(allocations: PayrollAllocation[]): FormArray {
    const formControls: FormGroup[] = [];
    allocations.forEach(allocation => formControls.push(this.initAllocation(allocation)));
    return this.formBuilder.array(formControls);
  }

  private initAllocation(allocation?: PayrollAllocation): FormGroup {
    return this.formBuilder.group({
      accountNumber: [allocation ? allocation.accountNumber : '', [Validators.required]],
      amount: [allocation ? allocation.amount : '', [Validators.required, FimsValidators.minValue(0)]],
      proportional: [allocation ? allocation.proportional : false]
    })
  }

  addAllocation(allocation?: PayrollAllocation): void {
    const allocations: FormArray = this.form.get('payrollAllocations') as FormArray;
    allocations.push(this.initAllocation(allocation));
  }

  removeAllocation(index: number): void {
    const allocations: FormArray = this.form.get('payrollAllocations') as FormArray;
    allocations.removeAt(index);
  }

  get allocations(): AbstractControl[] {
    const allocations: FormArray = this.form.get('payrollAllocations') as FormArray;
    return allocations.controls;
  }
}

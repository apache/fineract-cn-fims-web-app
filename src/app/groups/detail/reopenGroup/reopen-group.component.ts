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
import {Component, Input,Output,OnInit,EventEmitter} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormComponent} from '../../../common/forms/form.component';
import {FormBuilder, Validators,FormGroup} from '@angular/forms';
import {FimsValidators} from '../../../common/validator/validators';



@Component({
    selector:'fims-reopen-group',
    templateUrl:'./reopen-group.component.html'
})

export class ReopeningGroupComponent implements OnInit{
  form:FormGroup


  reasons=[
      {value:'Available members', viewValue:'Available members'},
      {value:'Funds Available', viewValue:'Funds Available'}
  ]

  constructor(private formBuilder: FormBuilder,private router: Router, private route: ActivatedRoute) {}

    ngOnInit(){
        this.form= this.formBuilder.group({
           openDate:['',Validators.required] 

        })
    }

    onSave(){
        console.log('reason.value, to be implemented');
    }

    onCancel() {
        this.navigateAway();
      }
    
      navigateAway(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
      }
}


  
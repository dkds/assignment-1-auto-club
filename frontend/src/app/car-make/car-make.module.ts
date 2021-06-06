import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { GraphQLModule } from '../graphql.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

import { CarMakeComponent } from './component/car-make-main.component';

import { carMakeReducers } from '../core/state/car-make/car-make.reducers';
import { CarMakeEffects } from '../core/state/car-make/car-make.effects';


const routes: Routes = [
  {
    path: '',
    component: CarMakeComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    GraphQLModule,
    SharedModule,
    RouterModule.forChild(routes),
    EffectsModule.forFeature([CarMakeEffects]),
    StoreModule.forFeature('carMake', carMakeReducers)
  ],
  declarations: [
    CarMakeComponent
  ]
})
export class CarMakeModule { }

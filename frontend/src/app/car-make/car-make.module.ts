import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { GraphQLModule } from '../graphql.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CarMakeComponent } from './component/car-make-main.component';
import { carMakeListReducer, carMakeRemoveReducer, carMakeSaveReducer } from '../core/state/car-make/car-make.reducers';
import { CarMakeEffects } from '../core/state/car-make/car-make.effects';


const routes: Routes = [
  {
    path: '',
    component: CarMakeComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    GraphQLModule,
    EffectsModule.forFeature([CarMakeEffects]),
    StoreModule.forFeature('carMake', {
      list: carMakeListReducer,
      save: carMakeSaveReducer,
      remove: carMakeRemoveReducer,
    })
  ],
  declarations: [
    CarMakeComponent
  ]
})
export class CarMakeModule { }

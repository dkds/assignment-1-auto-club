import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { GraphQLModule } from '../graphql.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { CarModelComponent } from './component/car-model-main.component';

import { CarMakeResolverService } from '../core/service/car-make-resolver.service';

import { carModelReducers } from '../core/state/car-model/car-model.reducers';
import { CarModelEffects } from '../core/state/car-model/car-model.effects';


const routes: Routes = [
  {
    path: '',
    component: CarModelComponent,
    resolve: { carMake: CarMakeResolverService }
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
    EffectsModule.forFeature([CarModelEffects]),
    StoreModule.forFeature('carModel', carModelReducers)
  ],
  declarations: [
    CarModelComponent
  ]
})
export class CarModelModule { }

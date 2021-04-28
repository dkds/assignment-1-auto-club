import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { GraphQLModule } from '../graphql.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CarMakeModule } from '../car-make/car-make.module';

import { CarModelComponent } from './component/car-model-main.component';
import { carModelListReducer, carModelRemoveReducer, carModelSaveReducer } from '../core/state/car-model/car-model.reducers';
import { CarModelEffects } from '../core/state/car-model/car-model.effects';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    GraphQLModule,
    CarMakeModule,
    EffectsModule.forFeature([CarModelEffects]),
    StoreModule.forFeature('carModel', {
      list: carModelListReducer,
      save: carModelSaveReducer,
      remove: carModelRemoveReducer,
    })
  ],
  declarations: [
    CarModelComponent
  ]
})
export class CarModelModule { }

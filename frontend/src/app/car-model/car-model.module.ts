import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { GraphQLModule } from '../graphql.module';

import { CarModelComponent } from './component/car-model-main.component';


const routes: Routes = [
  {
    path: '',
    component: CarModelComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    GraphQLModule
  ],
  declarations: [
    CarModelComponent
  ]
})
export class CarModelModule { }

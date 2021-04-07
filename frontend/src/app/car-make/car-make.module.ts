import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { GraphQLModule } from '../graphql.module';

import { CarMakeComponent } from './component/car-make-main.component';


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
    GraphQLModule
  ],
  declarations: [
    CarMakeComponent
  ]
})
export class CarMakeModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarMakeComponent } from './car-make/component/car-make-main.component';
import { CarModelComponent } from './car-model/component/car-model-main.component';

const routes: Routes = [
  {
    path: 'car-make',
    component: CarMakeComponent
  },
  {
    path: 'car-model',
    component: CarModelComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

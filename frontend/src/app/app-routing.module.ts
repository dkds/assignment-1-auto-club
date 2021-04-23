import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarModelComponent } from './car-model/component/car-model-main.component';

const routes: Routes = [
  {
    path: 'car-make',
    loadChildren: () => import('./car-make/car-make.module').then(m => m.CarMakeModule)
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

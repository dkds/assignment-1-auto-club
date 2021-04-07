import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'car-make',
    loadChildren: () => import('./car-make/car-make.module').then(m => m.CarMakeModule)
  },
  {
    path: 'car-model',
    loadChildren: () => import('./car-model/car-model.module').then(m => m.CarModelModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

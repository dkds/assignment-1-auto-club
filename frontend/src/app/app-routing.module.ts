import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'members',
    loadChildren: () => import('./member/member.module').then(m => m.MemberModule)
  },
  {
    path: 'car-model',
    loadChildren: () => import('./car-model/car-model.module').then(m => m.CarModelModule)
  },
  {
    path: 'car-make',
    loadChildren: () => import('./car-make/car-make.module').then(m => m.CarMakeModule)
  },
  {
    path: '**',
    redirectTo: 'members'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

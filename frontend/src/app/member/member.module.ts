import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule, NgbDatepickerModule, NgbPaginationModule, NgbProgressbarModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { GraphQLModule } from '../graphql.module';
import { HttpClientModule } from '@angular/common/http';

import { MemberComponent } from './component/member-main/member-main.component';
import { MemberFormComponent } from './component/member-form/member-form.component';
import { MemberImportFormComponent } from './component/member-import-form/member-import-form.component';
import { ToastsContainer } from './component/toast-container/toast-container.component';


const routes: Routes = [
  {
    path: '',
    component: MemberComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GraphQLModule,
    HttpClientModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgbPaginationModule,
    NgbToastModule,
    NgbProgressbarModule
  ],
  declarations: [
    MemberComponent,
    MemberFormComponent,
    MemberImportFormComponent,
    ToastsContainer
  ]
})
export class MemberModule { }

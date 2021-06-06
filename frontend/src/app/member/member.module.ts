import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule, NgbDatepickerModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { GraphQLModule } from '../graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { MemberComponent } from './component/member-main/member-main.component';
import { MemberFormComponent } from './component/member-form/member-form.component';
import { MemberImportFormComponent } from './component/member-import-form/member-import-form.component';
import { MemberExportFormComponent } from './component/member-export-form/member-export-form.component';

import { CarModelResolverService } from '../core/service/car-model-resolver.service';

import { memberReducers } from '../core/state/member/member.reducers';
import { MemberEffects } from '../core/state/member/member.effects';


const routes: Routes = [
  {
    path: '',
    component: MemberComponent,
    resolve: { carModel: CarModelResolverService }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GraphQLModule,
    HttpClientModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgbPaginationModule,
    SharedModule,
    RouterModule.forChild(routes),
    EffectsModule.forFeature([MemberEffects]),
    StoreModule.forFeature('member', memberReducers)
  ],
  declarations: [
    MemberComponent,
    MemberFormComponent,
    MemberImportFormComponent,
    MemberExportFormComponent,
  ]
})
export class MemberModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { GraphQLModule } from './graphql.module';
import { MemberModule } from './member/member.module';
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import { JobStatusService } from './core/service/job-status.service';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CarModelModule } from './car-model/car-model.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    CoreModule,
    MemberModule,
    CarModelModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot([])
  ],
  providers: [JobStatusService],
  bootstrap: [AppComponent]
})
export class AppModule { }

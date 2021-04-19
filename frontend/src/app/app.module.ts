import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { GraphQLModule } from './graphql.module';
import { MemberModule } from './member/member.module';
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import { JobStatusService } from './member/service/job-status.service';

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
  ],
  providers: [JobStatusService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { MemberModule } from './member/member.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { JobStatusService } from './member/service/job-status.service';
import { StoreModule } from '@ngrx/store';
import { membersReducer } from './state/reducers/member.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    GraphQLModule,
    HttpClientModule,
    MemberModule,
    StoreModule.forRoot({ members: membersReducer })
  ],
  providers: [JobStatusService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "../app-routing.module";
import { HeaderComponent } from "./components/header/header.component";

@NgModule({
  imports: [
    HttpClientModule,
    AppRoutingModule,
  ],
  declarations: [
    HeaderComponent,
  ],
  exports: [
    HeaderComponent,
  ]
})
export class CoreModule { }

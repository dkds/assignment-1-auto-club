import { NgModule } from "@angular/core";
import { NgbProgressbarModule, NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastsContainer } from "./components/toast-container/toast-container.component";

@NgModule({
    imports: [
        NgbProgressbarModule,
        NgbToastModule,
    ],
    declarations: [
        ToastsContainer
    ],
    exports: [
        ToastsContainer,
    ]
})
export class SharedModule { }

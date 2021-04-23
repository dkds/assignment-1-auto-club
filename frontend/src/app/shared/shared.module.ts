import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgbProgressbarModule, NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { ToastsContainer } from "./components/toast-container/toast-container.component";

@NgModule({
    imports: [
        CommonModule,
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

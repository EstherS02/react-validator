import { AfterContentInit, OnDestroy } from "@angular/core";
import { BaseDirective } from "./base-directive";
export declare class RxwebFormDirective extends BaseDirective implements AfterContentInit, OnDestroy {
    private clearTimeout;
    ngForm: any;
    ngAfterContentInit(): void;
    private configureModelValidations();
    ngOnDestroy(): void;
}

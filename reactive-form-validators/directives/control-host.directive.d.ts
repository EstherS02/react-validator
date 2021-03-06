import { EmbeddedViewRef, ViewContainerRef, OnDestroy } from '@angular/core';
export declare class ControlHostDirective implements OnDestroy {
    viewContainerRef: ViewContainerRef;
    view: EmbeddedViewRef<any>;
    constructor(viewContainerRef: ViewContainerRef);
    portal: any;
    ngOnDestroy(): void;
}

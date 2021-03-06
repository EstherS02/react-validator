import { AfterContentInit } from "@angular/core";
import { RxwebDynamicFormComponent } from './rx-web-dynamic-form.component';
export declare class RxwebControlComponent implements AfterContentInit {
    type: string;
    dynamicForm: RxwebDynamicFormComponent;
    data: any;
    control: any;
    ngAfterContentInit(): void;
}

import { FormArray } from "@angular/forms";
export declare class RxFormArray extends FormArray {
    private arrayObject;
    constructor(arrayObject: any[], controls: any, validatorOrOpts?: any, asyncValidator?: any);
    push(control: any): void;
    removeAt(index: number): void;
}

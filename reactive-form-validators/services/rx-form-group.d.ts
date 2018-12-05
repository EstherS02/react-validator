import { FormGroup, AbstractControl, ValidatorFn, AsyncValidatorFn } from "@angular/forms";
export declare class RxFormGroup extends FormGroup {
    private model;
    private entityObject;
    private baseObject;
    private entityService;
    constructor(model: any, entityObject: {
        [key: string]: any;
    }, controls: {
        [key: string]: AbstractControl;
    }, validatorOrOpts?: ValidatorFn | ValidatorFn[] | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null);
    isDirty(): boolean;
    resetForm(): void;
    getErrorSummary(onlyMessage: boolean): {
        [key: string]: any;
    };
    valueChangedSync(): void;
    readonly modelInstanceValue: any;
    readonly modelInstance: {
        [key: string]: any;
    };
    controlsError: {
        [key: string]: any;
    };
}

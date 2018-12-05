import { FormControl, ValidatorFn, AsyncValidatorFn } from "@angular/forms";
export declare class RxFormControl extends FormControl {
    private entityObject;
    private baseObject;
    private keyName;
    errorMessage: string;
    constructor(formState: any, validator: ValidatorFn | ValidatorFn[] | null, asyncValidator: AsyncValidatorFn | AsyncValidatorFn[] | null, entityObject: {
        [key: string]: any;
    }, baseObject: {
        [key: string]: any;
    }, controlName: string);
    setValue(value: any, options?: {
        dirty?: boolean;
        updateChanged?: boolean;
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    private getErrorMessage(errorObject, keyName);
}

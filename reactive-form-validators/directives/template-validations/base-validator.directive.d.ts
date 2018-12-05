import { Validator, ValidatorFn, AbstractControl } from '@angular/forms';
import { ControlExpressionProcess } from './control-expression-process';
export declare class BaseValidator extends ControlExpressionProcess implements Validator {
    protected validators: ValidatorFn[];
    protected element: any;
    protected eventName: string;
    protected setEventName(): void;
    validate(control: AbstractControl): {
        [key: string]: any;
    };
}

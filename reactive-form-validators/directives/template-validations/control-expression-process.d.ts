import { AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
export declare abstract class ControlExpressionProcess {
    protected validator: ValidatorFn;
    protected conditionalValidator: ValidatorFn;
    protected controlConfig: {
        [key: string]: any;
    };
    name: string;
    formControlName: string;
    isProcessed: boolean;
    protected controls: {
        [key: string]: FormControl;
    };
    private process(control, name);
    setModelConfig(control: AbstractControl): void;
    expressionProcessor(control: AbstractControl): void;
}

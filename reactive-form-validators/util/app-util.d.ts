import { AbstractControl } from "@angular/forms";
import { NumericValueType } from '../enums';
export declare class ApplicationUtil {
    static getParentObjectValue(control: AbstractControl): {
        [key: string]: any;
    };
    private static getParentControl(control);
    static getFormControl(fieldName: string, control: AbstractControl): any;
    private static parentObjectValue(control);
    static getConfigObject(config: any): any;
    static isNumeric(value: any): boolean;
    static notEqualTo(primaryValue: any, secondaryValue: any): boolean;
    static numericValidation(allowDecimal: boolean, acceptValue: NumericValueType): RegExp;
    static configureControl(control: any, config: any, type: string): void;
}

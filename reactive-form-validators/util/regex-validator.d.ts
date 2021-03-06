import { PasswordValidation } from "../models/password-validation.model";
export declare class RegexValidator {
    static isExits(value: any, regex: RegExp): boolean;
    static isValid(value: any, regex: RegExp): boolean;
    static isNotBlank(value: any): boolean;
    static isValidPassword(passwordValidation: PasswordValidation, value: string): {
        [key: string]: any;
    };
    static isZero(value: any): boolean;
    static commaRegex(): RegExp;
}

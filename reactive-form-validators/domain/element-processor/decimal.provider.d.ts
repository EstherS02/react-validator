import { DecimalPipe } from "@angular/common";
export declare class DecimalProvider {
    private decimalPipe;
    constructor(decimalPipe: DecimalPipe);
    replacer(value: any): void;
    transFormDecimal(value: any, digitsInfo: string): string;
}

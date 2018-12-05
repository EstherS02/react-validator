import { ControlValueAccessor } from '@angular/forms';
export declare class FileControlDirective implements ControlValueAccessor {
    writeValue(value: any): void;
    onChangeEvent: (value: any) => void;
    onBlurEvent: () => void;
    registerOnChange(eventFunction: any): void;
    registerOnTouched(eventFunction: any): void;
}

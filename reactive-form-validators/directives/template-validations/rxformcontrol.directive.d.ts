import { ElementRef, Renderer, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { BaseValidator } from './base-validator.directive';
import { DecimalProvider } from "../../domain/element-processor/decimal.provider";
import { AlphaConfig, ArrayConfig, BaseConfig, ChoiceConfig, CompareConfig, ComposeConfig, ContainsConfig, CreditCardConfig, DateConfig, DefaultConfig, DigitConfig, EmailConfig, ExtensionConfig, FactorConfig, MessageConfig, NumberConfig, NumericConfig, PasswordConfig, PatternConfig, RangeConfig, RequiredConfig, RuleConfig, SizeConfig, TimeConfig, DifferentConfig, RelationalOperatorConfig } from '../../models/config';
export declare class RxFormControlDirective extends BaseValidator implements OnInit, OnDestroy {
    private elementRef;
    private renderer;
    private decimalProvider;
    private eventListeners;
    validationControls: {
        [key: string]: FormControl;
    };
    allOf: ArrayConfig;
    alpha: AlphaConfig;
    alphaNumeric: AlphaConfig;
    ascii: BaseConfig;
    choice: ChoiceConfig;
    compare: CompareConfig;
    compose: ComposeConfig;
    contains: ContainsConfig;
    creditCard: CreditCardConfig;
    dataUri: BaseConfig;
    different: DifferentConfig;
    digit: DigitConfig;
    email: EmailConfig;
    endsWith: DefaultConfig;
    even: BaseConfig;
    extension: ExtensionConfig;
    factor: FactorConfig;
    fileSize: SizeConfig;
    greaterThanEqualTo: RelationalOperatorConfig;
    greaterThan: RelationalOperatorConfig;
    hexColor: MessageConfig;
    json: DefaultConfig;
    latitude: BaseConfig;
    latLong: BaseConfig;
    leapYear: BaseConfig;
    lessThan: RelationalOperatorConfig;
    lessThanEqualTo: RelationalOperatorConfig;
    longitude: BaseConfig;
    lowerCase: MessageConfig;
    mac: BaseConfig;
    maxDate: DateConfig;
    maxLength: NumberConfig;
    maxNumber: NumberConfig;
    minDate: DateConfig;
    minLength: NumberConfig;
    minNumber: NumberConfig;
    noneOf: ArrayConfig;
    numeric: NumericConfig;
    odd: BaseConfig;
    oneOf: ArrayConfig;
    password: PasswordConfig;
    pattern: PatternConfig;
    port: BaseConfig;
    primeNumber: BaseConfig;
    required: RequiredConfig;
    range: RangeConfig;
    rule: RuleConfig;
    startsWith: DefaultConfig;
    time: TimeConfig;
    upperCase: MessageConfig;
    url: DefaultConfig;
    formControl: FormControl | AbstractControl;
    constructor(elementRef: ElementRef, renderer: Renderer, decimalProvider: DecimalProvider);
    ngOnInit(): void;
    bindNumericElementEvent(config?: NumericConfig): void;
    bindValueChangeEvent(): void;
    private setValueOnElement(value);
    ngOnDestroy(): void;
}

import { PropValidationConfig } from "./prop-validation-config";
import { ValidatorFn } from '@angular/forms';
import { AutoInstanceConfig } from './interface/auto-instance-config.interface';
export declare class FormBuilderConfiguration {
    constructor(formBuilderConfiguration?: FormBuilderConfiguration);
    applyAllProps?: ValidatorFn[];
    excludeProps?: string[];
    includeProps?: string[];
    dynamicValidation?: {
        [key: string]: PropValidationConfig;
    };
    dynamicValidationConfigurationPropertyName?: string;
    autoInstanceConfig?: AutoInstanceConfig;
}

import { FormGroup } from "@angular/forms";
import { Type } from "../util";
import { BaseFormBuilder } from './base-form-builder';
import { FormBuilderConfiguration } from "../models";
import { RxFormGroup } from './rx-form-group';
export declare class RxFormBuilder extends BaseFormBuilder {
    private nestedProp;
    private conditionalObjectProps;
    private conditionalValidationInstance;
    private builderConfigurationConditionalObjectProps;
    private formGroupPropOtherValidator;
    private currentFormGroupPropOtherValidator;
    private isNested;
    private isGroupCalled;
    constructor();
    private getInstanceContainer(instanceFunc);
    private setValue(formGroup, object);
    private extractExpressions(fomrBuilderConfiguration);
    private addFormControl(property, propertyValidators, propValidationConfig, instance, entity);
    private additionalValidation(validations, propValidationConfig);
    private checkObjectPropAdditionalValidation<T>(instanceContainer, object);
    private getObject(model, entityObject?, formBuilderConfiguration?);
    group(groupObject: {
        [key: string]: any;
    }, validatorConfig?: FormBuilderConfiguration): FormGroup;
    private applyAllPropValidator(propName, validatorConfig, modelInstance);
    private dynamicValidationPropCheck(propName, validatorConfig);
    private createValidatorFormGroup(groupObject, entityObject, modelInstance, validatorConfig);
    private getValidatorConfig(validatorConfig, entityObject, rootPropertyName, arrayPropertyName?);
    private getProps(properties, rootPropertyName);
    formGroup<T>(model: Type<T> | {
        [key: string]: any;
    }, entityObject?: {
        [key: string]: any;
    } | FormBuilderConfiguration, formBuilderConfiguration?: FormBuilderConfiguration): RxFormGroup | FormGroup;
}

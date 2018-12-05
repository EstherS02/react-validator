import { FormBuilderConfiguration } from '../models/form-builder-configuration';
export declare class BaseFormBuilder {
    constructor();
    protected createInstance(): {};
    protected createClassObject(model: any, formBuilderConfiguration: FormBuilderConfiguration, classInstance?: any): any;
    protected updateObject(model: any, entityObject: any): any;
    private getInstance(model, objectArguments);
}

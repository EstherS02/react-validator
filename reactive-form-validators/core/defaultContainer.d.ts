import { DecoratorConfiguration, InstanceContainer, PropertyInfo } from './validator.interface';
export declare const defaultContainer: {
    get<T>(instanceFunc: any): InstanceContainer;
    addAnnotation(instanceFunc: any, decoratorConfiguration: DecoratorConfiguration): void;
    addInstanceContainer(instanceFunc: any): void;
    addProperty(instanceFunc: any, propertyInfo: PropertyInfo): void;
    addChangeValidation(instance: InstanceContainer, propertyName: string, columns: any[]): void;
    init(target: any, parameterIndex: any, propertyKey: string, annotationType: string, config: any): void;
    initPropertyObject(name: string, propertyType: string, entity: any, target): void;
    modelIncrementCount: number;
    clearInstance(instance: any): void;
    setConditionalValueProp(instance: InstanceContainer, propName: string, refPropName: string): void;
};

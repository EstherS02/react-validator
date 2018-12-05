export interface DecoratorConfiguration {
    annotationType: string;
    propertyName: string;
    propertyIndex: number;
    target?: any;
    propertyConstructor?: any;
    config?: any;
}
export interface InstanceContainer {
    instance: any;
    propertyAnnotations: DecoratorConfiguration[];
    properties?: PropertyInfo[];
    conditionalValidationProps?: {
        [key: string]: string[];
    };
    conditionalObjectProps?: {
        [key: string]: any;
    };
}
export interface PropertyInfo {
    name: string;
    propertyType: string;
    entity?: any;
}

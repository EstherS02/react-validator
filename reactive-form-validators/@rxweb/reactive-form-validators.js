import { Component, ContentChildren, Directive, ElementRef, Injectable, Input, NgModule, Renderer, TemplateRef, ViewContainerRef, forwardRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, NG_VALIDATORS, ReactiveFormsModule } from '@angular/forms';

class Linq {
    /**
     * @param {?} expression
     * @return {?}
     */
    static functionCreator(expression) {
        var /** @type {?} */ functionSetter = [];
        var /** @type {?} */ match = expression.match(/^\s*\(?\s*([^)]*)\s*\)?\s*=>(.*)/);
        var /** @type {?} */ splitSelect = match[2].split(",");
        for (var /** @type {?} */ i = 0; i < splitSelect.length; i++) {
            var /** @type {?} */ equalToOperator = splitSelect[i].match(/^\s*\(?\s*([^)]*)\s*\)?\s*==(.*)/);
            if (equalToOperator !== null) {
                functionSetter = new Function(match[1], "return " + equalToOperator.input);
            }
            else {
                equalToOperator = splitSelect[i].match(/^\s*\(?\s*([^)]*)\s*\)?\s*=(.*)/);
                if (equalToOperator === null) {
                    functionSetter = new Function(match[1], "return " + splitSelect.input);
                }
                else {
                    functionSetter = new Function(match[1], "return " + equalToOperator.input);
                }
            }
        }
        if (splitSelect.length == 0)
            functionSetter = { accessFunction: new Function(match[1], "return " + match[2]) };
        return functionSetter;
    }
    /**
     * @param {?} jObject
     * @param {?} expression
     * @param {?} parentObject
     * @return {?}
     */
    static IsPassed(jObject, expression, parentObject) {
        let /** @type {?} */ expressionFunction = expression;
        if (parentObject && typeof expression == "string")
            expressionFunction = Linq.functionCreator(expression);
        if (parentObject && expressionFunction)
            return expressionFunction(parentObject, jObject);
        return true;
    }
    /**
     * @param {?} expression
     * @return {?}
     */
    static expressionParser(expression) {
        let /** @type {?} */ columns = [];
        let /** @type {?} */ expressionString = expression.toString();
        let /** @type {?} */ expressionArguments = Linq.extractArguments(expressionString.match(/\(([^)]+)\)/g));
        if (expressionArguments.length > 0) {
            let /** @type {?} */ splitTexts = expressionString.replace(/\s/g, '').replace(new RegExp(/{|}/, "g"), "").split(new RegExp(/return|===|!==|==|!=|>=|>|<=|<|&&/));
            splitTexts.forEach(t => {
                expressionArguments.forEach(x => {
                    t = t.trim();
                    if (t.startsWith(x + '.')) {
                        var /** @type {?} */ splitText = t.split('.');
                        if (splitText.length == 2)
                            columns.push({ propName: splitText[1].trim() });
                        else {
                            var /** @type {?} */ arrayProp = splitText[1].split('[');
                            let /** @type {?} */ jObject = {
                                propName: splitText[splitText.length - 1].trim(),
                                objectPropName: arrayProp[0],
                                arrayIndex: arrayProp.length > 1 ? arrayProp[1].replace("]", "") : undefined
                            };
                            columns.push(jObject);
                        }
                    }
                });
            });
        }
        return columns;
    }
    /**
     * @param {?} splitTexts
     * @return {?}
     */
    static extractArguments(splitTexts) {
        let /** @type {?} */ expressionArguments = [];
        splitTexts[0].split(",").forEach(t => expressionArguments.push(t.trim().replace("(", "").replace(")", "")));
        return expressionArguments;
    }
    /**
     * @param {?} expression
     * @return {?}
     */
    static expressionColumns(expression) {
        var /** @type {?} */ columns = [];
        let /** @type {?} */ splitExpressions = [];
        if (typeof expression == "string") {
            expression.split("=>")[1].split(" && ").forEach(t => {
                t.split(" || ").forEach(x => {
                    splitExpressions.push(x.trim().split(' ')[0]);
                });
            });
            splitExpressions.forEach(t => {
                var /** @type {?} */ splitText = t.split('.');
                if (splitText.length == 2)
                    columns.push({ propName: splitText[1].trim() });
                else {
                    var /** @type {?} */ arrayProp = splitText[1].split('[');
                    let /** @type {?} */ jObject = {
                        propName: splitText[splitText.length - 1].trim(),
                        objectPropName: arrayProp[0],
                        arrayIndex: arrayProp.length > 1 ? arrayProp[1].replace("]", "") : undefined
                    };
                    columns.push(jObject);
                }
            });
        }
        else {
            columns = Linq.expressionParser(expression);
        }
        return columns;
    }
}

const AnnotationTypes = {
    numeric: 'numeric',
    required: 'required',
    minLength: 'minLength',
    maxLength: 'maxLength',
    minNumber: 'minNumber',
    maxNumber: 'maxNumber',
    pattern: 'pattern',
    password: 'password',
    compare: 'compare',
    minDate: 'minDate',
    maxDate: 'maxDate',
    alpha: 'alpha',
    alphaNumeric: 'alphaNumeric',
    email: 'email',
    hexColor: 'hexColor',
    lowerCase: 'lowerCase',
    url: 'url',
    upperCase: 'upperCase',
    nested: 'nested',
    propArray: 'propArray',
    propObject: 'propObject',
    contains: 'contains',
    range: 'range',
    custom: 'custom',
    digit: "digit",
    creditCard: "creditCard",
    time: "time",
    json: "json",
    greaterThan: "greaterThan",
    greaterThanEqualTo: "greaterThanEqualTo",
    lessThan: "lessThan",
    lessThanEqualTo: "lessThanEqualTo",
    choice: "choice",
    different: "different",
    even: "even",
    odd: "odd",
    factor: "factor",
    leapYear: "leapYear",
    allOf: "allOf",
    oneOf: "oneOf",
    noneOf: "noneOf",
    mac: "mac",
    ascii: "ascii",
    dataUri: "dataUri",
    port: "port",
    latLong: "latLong",
    extension: "extension",
    fileSize: "fileSize",
    endsWith: "endsWith",
    startsWith: "startsWith",
    primeNumber: "primeNumber",
    latitude: "latitude",
    longitude: "longitude",
    compose: "compose",
    rule: "rule",
    file: "file",
    image: "image"
};

const PROPERTY = "property";
const OBJECT_PROPERTY = "objectProperty";
const ARRAY_PROPERTY = "arrayProperty";
const STRING = "string";
const MESSAGE = "message";
const BLANK = "";

const ELEMENT_VALUE = "value";
const BLUR = "blur";
const FOCUS = "focus";
const CHANGE = "change";

const INPUT = "INPUT";
const SELECT = "SELECT";
const CHECKBOX = "checkbox";
const RADIO = "radio";
const FILE = "file";
const TEXTAREA = "textarea";

const CONTROLS_ERROR = "controlsError";
const VALUE_CHANGED_SYNC = "valueChangedSync";
const FUNCTION_STRING = "function";
const OBJECT_STRING = "object";
const RX_WEB_VALIDATOR = "rxwebValidator";
const NUMBER = "number";
const BOOLEAN = "boolean";

const defaultContainer = new (class {
    constructor() {
        this.instances = [];
        this.modelIncrementCount = 0;
    }
    /**
     * @template T
     * @param {?} instanceFunc
     * @return {?}
     */
    get(instanceFunc) {
        let /** @type {?} */ instance = this.instances.filter(instance => instance.instance === instanceFunc)[0];
        return instance;
    }
    /**
     * @param {?} target
     * @param {?} parameterIndex
     * @param {?} propertyKey
     * @param {?} annotationType
     * @param {?} config
     * @return {?}
     */
    init(target, parameterIndex, propertyKey, annotationType, config) {
        var /** @type {?} */ decoratorConfiguration = {
            propertyIndex: parameterIndex,
            propertyName: propertyKey,
            annotationType: annotationType,
            config: config
        };
        let /** @type {?} */ isPropertyKey = (propertyKey != undefined);
        this.addAnnotation(!isPropertyKey ? target : target.constructor, decoratorConfiguration);
    }
    /**
     * @param {?} name
     * @param {?} propertyType
     * @param {?} entity
     * @param {?} target
     * @return {?}
     */
    initPropertyObject(name, propertyType, entity, target) {
        var /** @type {?} */ propertyInfo = {
            name: name,
            propertyType: propertyType,
            entity: entity
        };
        defaultContainer.addProperty(target.constructor, propertyInfo);
    }
    /**
     * @param {?} instanceFunc
     * @return {?}
     */
    addInstanceContainer(instanceFunc) {
        let /** @type {?} */ instanceContainer = {
            instance: instanceFunc,
            propertyAnnotations: [],
            properties: []
        };
        this.instances.push(instanceContainer);
        return instanceContainer;
    }
    /**
     * @param {?} instanceFunc
     * @param {?} propertyInfo
     * @return {?}
     */
    addProperty(instanceFunc, propertyInfo) {
        let /** @type {?} */ instance = this.instances.filter(instance => instance.instance === instanceFunc)[0];
        if (instance) {
            this.addPropertyInfo(instance, propertyInfo);
        }
        else {
            instance = this.addInstanceContainer(instanceFunc);
            this.addPropertyInfo(instance, propertyInfo);
        }
    }
    /**
     * @param {?} instance
     * @param {?} propertyInfo
     * @return {?}
     */
    addPropertyInfo(instance, propertyInfo) {
        var /** @type {?} */ property = instance.properties.filter(t => t.name == propertyInfo.name)[0];
        if (!property)
            instance.properties.push(propertyInfo);
    }
    /**
     * @param {?} instanceFunc
     * @param {?} decoratorConfiguration
     * @return {?}
     */
    addAnnotation(instanceFunc, decoratorConfiguration) {
        this.addProperty(instanceFunc, { propertyType: PROPERTY, name: decoratorConfiguration.propertyName });
        let /** @type {?} */ instance = this.instances.filter(instance => instance.instance === instanceFunc)[0];
        if (instance)
            instance.propertyAnnotations.push(decoratorConfiguration);
        else {
            instance = this.addInstanceContainer(instanceFunc);
            instance.propertyAnnotations.push(decoratorConfiguration);
        }
        if (decoratorConfiguration.config && decoratorConfiguration.config.conditionalExpression) {
            let /** @type {?} */ columns = Linq.expressionColumns(decoratorConfiguration.config.conditionalExpression);
            this.addChangeValidation(instance, decoratorConfiguration.propertyName, columns);
        }
        if (instance && decoratorConfiguration.config && ((decoratorConfiguration.annotationType == AnnotationTypes.compare || decoratorConfiguration.annotationType == AnnotationTypes.greaterThan || decoratorConfiguration.annotationType == AnnotationTypes.greaterThanEqualTo || decoratorConfiguration.annotationType == AnnotationTypes.lessThan || decoratorConfiguration.annotationType == AnnotationTypes.lessThanEqualTo || decoratorConfiguration.annotationType == AnnotationTypes.different || decoratorConfiguration.annotationType == AnnotationTypes.factor) || (decoratorConfiguration.annotationType == AnnotationTypes.creditCard && decoratorConfiguration.config.fieldName))) {
            this.setConditionalValueProp(instance, decoratorConfiguration.config.fieldName, decoratorConfiguration.propertyName);
        }
    }
    /**
     * @param {?} instance
     * @param {?} propName
     * @param {?} refPropName
     * @return {?}
     */
    setConditionalValueProp(instance, propName, refPropName) {
        if (!instance.conditionalValidationProps)
            instance.conditionalValidationProps = {};
        if (!instance.conditionalValidationProps[propName])
            instance.conditionalValidationProps[propName] = [];
        if (instance.conditionalValidationProps[propName].indexOf(refPropName) == -1)
            instance.conditionalValidationProps[propName].push(refPropName);
    }
    /**
     * @param {?} instance
     * @param {?} propertyName
     * @param {?} columns
     * @return {?}
     */
    addChangeValidation(instance, propertyName, columns) {
        if (instance) {
            if (!instance.conditionalValidationProps)
                instance.conditionalValidationProps = {};
            columns.forEach(t => {
                if (t.propName && !t.objectPropName) {
                    if (!instance.conditionalValidationProps[t.propName])
                        instance.conditionalValidationProps[t.propName] = [];
                    if (instance.conditionalValidationProps[t.propName].indexOf(propertyName) == -1)
                        instance.conditionalValidationProps[t.propName].push(propertyName);
                }
                else {
                    if (t.propName && t.objectPropName) {
                        if (!instance.conditionalObjectProps)
                            instance.conditionalObjectProps = [];
                        t.referencePropName = propertyName;
                        instance.conditionalObjectProps.push(t);
                    }
                }
            });
        }
    }
    /**
     * @param {?} instanceFunc
     * @return {?}
     */
    clearInstance(instanceFunc) {
        let /** @type {?} */ instance = this.instances.filter(instance => instance.instance === instanceFunc)[0];
        if (instance) {
            let /** @type {?} */ indexOf = this.instances.indexOf(instance);
            this.instances.splice(indexOf, 1);
        }
    }
})();

class BaseFormBuilder {
    constructor() {
    }
    /**
     * @return {?}
     */
    createInstance() {
        let /** @type {?} */ instance = {};
        defaultContainer.modelIncrementCount = defaultContainer.modelIncrementCount + 1;
        let /** @type {?} */ modelName = `RxWebModel${defaultContainer.modelIncrementCount}`;
        instance.constructor = Function(`"use strict";return(function ${modelName}(){ })`)();
        return instance;
    }
    /**
     * @param {?} model
     * @param {?} formBuilderConfiguration
     * @param {?=} classInstance
     * @return {?}
     */
    createClassObject(model, formBuilderConfiguration, classInstance) {
        let /** @type {?} */ instanceContainer = defaultContainer.get(model);
        let /** @type {?} */ autoInstanceConfig = formBuilderConfiguration ? formBuilderConfiguration.autoInstanceConfig : undefined;
        if (!autoInstanceConfig) {
            return classInstance && typeof classInstance != "function" ? classInstance : this.getInstance(model, []);
        }
        else {
            classInstance = classInstance && typeof classInstance != "function" ? classInstance : this.getInstance(model, autoInstanceConfig.arguments || []);
            if (autoInstanceConfig.objectPropInstanceConfig && autoInstanceConfig.objectPropInstanceConfig.length > 0) {
                autoInstanceConfig.objectPropInstanceConfig.forEach(t => {
                    let /** @type {?} */ objectProperty = instanceContainer.properties.filter(property => property.name == t.propertyName && property.propertyType == OBJECT_PROPERTY)[0];
                    if (objectProperty)
                        classInstance[t.propertyName] = this.getInstance(objectProperty.entity, t.arguments || []);
                });
            }
            if (autoInstanceConfig.arrayPropInstanceConfig && autoInstanceConfig.arrayPropInstanceConfig.length > 0) {
                autoInstanceConfig.arrayPropInstanceConfig.forEach(t => {
                    let /** @type {?} */ property = instanceContainer.properties.filter(property => property.name == t.propertyName && property.propertyType == ARRAY_PROPERTY)[0];
                    if (property) {
                        classInstance[t.propertyName] = [];
                        for (var /** @type {?} */ i = 0; i < t.rowItems; i++) {
                            classInstance[t.propertyName].push(this.getInstance(property.entity, t.arguments || []));
                        }
                    }
                });
            }
            return classInstance;
        }
    }
    /**
     * @param {?} model
     * @param {?} entityObject
     * @return {?}
     */
    updateObject(model, entityObject) {
        let /** @type {?} */ instanceContainer = defaultContainer.get(model);
        let /** @type {?} */ classInstance = this.getInstance(model, []);
        if (instanceContainer) {
            instanceContainer.properties.forEach(t => {
                switch (t.propertyType) {
                    case PROPERTY:
                        classInstance[t.name] = entityObject[t.name];
                        break;
                    case OBJECT_PROPERTY:
                        if (entityObject[t.name])
                            classInstance[t.name] = this.updateObject(t.entity, entityObject[t.name]);
                        break;
                    case ARRAY_PROPERTY:
                        if (entityObject[t.name] && Array.isArray(entityObject[t.name])) {
                            classInstance[t.name] = [];
                            for (let /** @type {?} */ row of entityObject[t.name]) {
                                let /** @type {?} */ instanceObject = this.updateObject(t.entity, row);
                                classInstance[t.name].push(instanceObject);
                            }
                        }
                        break;
                }
            });
        }
        return classInstance;
    }
    /**
     * @param {?} model
     * @param {?} objectArguments
     * @return {?}
     */
    getInstance(model, objectArguments) {
        let /** @type {?} */ classInstance = Object.create(model.prototype);
        model.apply(classInstance, objectArguments);
        return classInstance;
    }
}

class FormBuilderConfiguration {
    /**
     * @param {?=} formBuilderConfiguration
     */
    constructor(formBuilderConfiguration) {
        if (formBuilderConfiguration)
            for (var column in formBuilderConfiguration)
                this[column] = formBuilderConfiguration[column];
    }
}

class ReactiveFormConfig {
    /**
     * @param {?} jObject
     * @return {?}
     */
    static set(jObject) {
        if (jObject)
            ReactiveFormConfig.json = jObject;
    }
}
ReactiveFormConfig.json = {};

class ObjectMaker {
    /**
     * @param {?} key
     * @param {?} message
     * @param {?} values
     * @return {?}
     */
    static toJson(key, message, values) {
        let /** @type {?} */ messageText = (message) ? message : (ReactiveFormConfig && ReactiveFormConfig.json && ReactiveFormConfig.json.validationMessage && ReactiveFormConfig.json.validationMessage[key]) ? ReactiveFormConfig.json.validationMessage[key] : '';
        values.forEach((t, index) => {
            messageText = messageText.replace(`{{${index}}}`, t);
        });
        let /** @type {?} */ jObject = {};
        jObject[key] = {
            message: messageText, refValues: values
        };
        return jObject;
    }
    /**
     * @return {?}
     */
    static null() {
        return null;
    }
}

/**
 * @param {?} conditionalValidationProps
 * @return {?}
 */
function conditionalChangeValidator(conditionalValidationProps) {
    var /** @type {?} */ oldValue = undefined;
    var /** @type {?} */ setTimeOut = (control) => {
        var /** @type {?} */ timeOut = window.setTimeout(t => {
            window.clearTimeout(timeOut);
            control.updateValueAndValidity();
        }, 100);
    };
    return (control) => {
        const /** @type {?} */ parentFormGroup = control.parent;
        let /** @type {?} */ value = control.value;
        if (parentFormGroup && oldValue != value) {
            oldValue = value;
            conditionalValidationProps.forEach(t => {
                if (t.indexOf("[]") != -1) {
                    var /** @type {?} */ splitText = t.split("[]");
                    var /** @type {?} */ formArray = (parentFormGroup.get([splitText[0]]));
                    if (formArray)
                        formArray.controls.forEach(formGroup => {
                            var /** @type {?} */ abstractControl = formGroup.get(splitText[1]);
                            if (abstractControl) {
                                setTimeOut(abstractControl);
                            }
                        });
                }
                else {
                    var /** @type {?} */ control = null;
                    t.split('.').forEach((name, index) => { control = (index == 0) ? parentFormGroup.controls[name] : control.controls[name]; });
                    if (control) {
                        setTimeOut(control);
                    }
                }
            });
        }
        return ObjectMaker.null();
    };
}

class CreditCardRegex {
    constructor() {
        this.Visa = new RegExp('^(?:4[0-9]{12})(?:[0-9]{3})?$');
        this.AmericanExpress = new RegExp('^(?:3[47][0-9]{13})$');
        this.Maestro = new RegExp('^(?:(?:5[0678]\\d\\d|6304|6390|67\\d\\d)\\d{8,15})$');
        this.JCB = new RegExp('^(?:(?:2131|1800|35\\d{3})\\d{11})$');
        this.Discover = new RegExp('^(?:6(?:011|5[0-9]{2})(?:[0-9]{12}))$');
        this.DinersClub = new RegExp('^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$');
        this.MasterCard = new RegExp('^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$');
    }
}

const RegExRule = {
    alpha: /^[a-zA-Z]+$/,
    alphaExits: /[a-zA-Z]/,
    alphaWithSpace: /^[a-zA-Z\s]+$/,
    macId: /^([0-9a-fA-F][0-9a-fA-F]:){5}([0-9a-fA-F][0-9a-fA-F])$/,
    onlyDigit: /^[0-9]+$/,
    isDigitExits: /[0-9]/,
    lowerCase: /[a-z]/,
    upperCase: /[A-Z]/,
    specialCharacter: /[!@#$%^&*(),.?":{}|<>]/,
    advancedEmail: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    basicEmail: /^(([^<>()\[\]\\.,,:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    alphaNumeric: /^[0-9a-zA-Z]+$/,
    alphaNumericWithSpace: /^[0-9a-zA-Z\s]+$/,
    hexColor: /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i,
    strictHexColor: /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i,
    float: /^(?:[-+]?(?:[0-9]+))?(?:\.[0-9]*)?(?:[eE][\+\-]?(?:[0-9]+))?$/,
    decimal: /^[-+]?([0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)$/,
    hexaDecimal: /^[0-9A-F]+$/i,
    date: /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
    time: /^(00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9])$/,
    timeWithSeconds: /^(00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])$/,
    url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
    creditCard: new CreditCardRegex(),
    ascii: /^[\x00-\x7F]+$/,
    dataUri: /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)$/i,
    lat: /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/,
    long: /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/,
};

const ALPHABET = "alphabet";
const DIGIT = "digit";
const CONTAINS = "contains";
const LOWERCASE = "lowerCase";
const UPPERCASE = "upperCase";
const SPECIAL_CHARACTER = "specialCharacter";
const MIN_LENGTH = "minLength";
const MAX_LENGTH = "maxLength";
class RegexValidator {
    /**
     * @param {?} value
     * @param {?} regex
     * @return {?}
     */
    static isExits(value, regex) {
        return value.match(regex) != null;
    }
    /**
     * @param {?} value
     * @param {?} regex
     * @return {?}
     */
    static isValid(value, regex) {
        return regex.test(value);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    static isNotBlank(value) {
        return value != undefined && value != "" && value != null;
    }
    /**
     * @param {?} passwordValidation
     * @param {?} value
     * @return {?}
     */
    static isValidPassword(passwordValidation, value) {
        let /** @type {?} */ isValid = false;
        let /** @type {?} */ keyName = "status";
        let /** @type {?} */ objectProperties = Object.getOwnPropertyNames(passwordValidation);
        for (let /** @type {?} */ propertyName of objectProperties) {
            switch (propertyName) {
                case ALPHABET:
                    isValid = RegexValidator.isExits(value, RegExRule.alphaExits);
                    keyName = ALPHABET;
                    break;
                case DIGIT:
                    isValid = RegexValidator.isValid(value, RegExRule.isDigitExits);
                    keyName = DIGIT;
                    break;
                case CONTAINS:
                    isValid = value.indexOf(passwordValidation[CONTAINS]) != -1;
                    keyName = CONTAINS;
                    break;
                case LOWERCASE:
                    isValid = RegexValidator.isValid(value, RegExRule.lowerCase);
                    keyName = LOWERCASE;
                    break;
                case UPPERCASE:
                    isValid = RegexValidator.isValid(value, RegExRule.upperCase);
                    keyName = UPPERCASE;
                    break;
                case SPECIAL_CHARACTER:
                    isValid = RegexValidator.isExits(value, RegExRule.specialCharacter);
                    keyName = SPECIAL_CHARACTER;
                    break;
                case MIN_LENGTH:
                    isValid = value.length >= passwordValidation[propertyName];
                    keyName = MIN_LENGTH;
                    break;
                case MAX_LENGTH:
                    isValid = value.length <= passwordValidation[propertyName];
                    keyName = MAX_LENGTH;
                    break;
            }
            if (!isValid)
                break;
        }
        return { isValid: isValid, keyName: keyName };
    }
    /**
     * @param {?} value
     * @return {?}
     */
    static isZero(value) {
        return value == 0;
    }
    /**
     * @return {?}
     */
    static commaRegex() {
        return new RegExp(",", "g");
    }
}

let NumericValueType = {};
NumericValueType.PositiveNumber = 1;
NumericValueType.NegativeNumber = 2;
NumericValueType.Both = 3;
NumericValueType[NumericValueType.PositiveNumber] = "PositiveNumber";
NumericValueType[NumericValueType.NegativeNumber] = "NegativeNumber";
NumericValueType[NumericValueType.Both] = "Both";

class ApplicationUtil {
    /**
     * @param {?} control
     * @return {?}
     */
    static getParentObjectValue(control) {
        if (control.parent) {
            let /** @type {?} */ parent = this.parentObjectValue(control.parent);
            return parent.value;
        }
        return {};
    }
    /**
     * @param {?} control
     * @return {?}
     */
    static getParentControl(control) {
        if (control.parent) {
            let /** @type {?} */ parent = this.parentObjectValue(control.parent);
            return parent;
        }
        return control;
    }
    /**
     * @param {?} fieldName
     * @param {?} control
     * @return {?}
     */
    static getFormControl(fieldName, control) {
        let /** @type {?} */ splitText = fieldName.split('.');
        if (splitText.length > 1 && control.parent) {
            var /** @type {?} */ formControl = this.getParentControl(control);
            splitText.forEach((name, index) => { formControl = formControl.controls[name]; });
            return formControl;
        }
        return (control.parent) ? control.parent.get([fieldName]) : undefined;
    }
    /**
     * @param {?} control
     * @return {?}
     */
    static parentObjectValue(control) {
        if (!control.parent)
            return control;
        else
            control = this.parentObjectValue(control.parent);
        return control;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    static getConfigObject(config) {
        return (config != undefined && config != true) ? config : {};
    }
    /**
     * @param {?} value
     * @return {?}
     */
    static isNumeric(value) {
        return (value - parseFloat(value) + 1) >= 0;
    }
    /**
     * @param {?} primaryValue
     * @param {?} secondaryValue
     * @return {?}
     */
    static notEqualTo(primaryValue, secondaryValue) {
        let /** @type {?} */ firstValue = (primaryValue == undefined || primaryValue == null) ? "" : primaryValue;
        let /** @type {?} */ secondValue = (secondaryValue == undefined || secondaryValue == null) ? "" : secondaryValue;
        return (firstValue != secondValue);
    }
    /**
     * @param {?} allowDecimal
     * @param {?} acceptValue
     * @return {?}
     */
    static numericValidation(allowDecimal, acceptValue) {
        acceptValue = (acceptValue == undefined) ? NumericValueType.PositiveNumber : acceptValue;
        let /** @type {?} */ regex = /^[0-9]+$/;
        switch (acceptValue) {
            case NumericValueType.PositiveNumber:
                regex = (!allowDecimal) ? /^[0-9]+$/ : /^[0-9\.]+$/;
                break;
            case NumericValueType.NegativeNumber:
                regex = (!allowDecimal) ? /^[-][0-9]+$/ : /^[-][0-9\.]+$/;
                break;
            case NumericValueType.Both:
                regex = (!allowDecimal) ? /^[-|+]?[0-9]+$/ : /^[-|+]?[0-9\.]+$/;
                break;
        }
        return regex;
    }
    /**
     * @param {?} control
     * @param {?} config
     * @param {?} type
     * @return {?}
     */
    static configureControl(control, config, type) {
        if (config) {
            if (!control.validatorConfig) {
                let /** @type {?} */ jObject = {};
                jObject[type] = config;
                Object.assign(control, { validatorConfig: jObject });
            }
            else
                control.validatorConfig[type] = config;
        }
    }
}

class FormProvider {
    /**
     * @param {?} control
     * @param {?} config
     * @return {?}
     */
    static ProcessRule(control, config) {
        const /** @type {?} */ formGroupValue = ApplicationUtil.getParentObjectValue(control);
        const /** @type {?} */ parentObject = (control.parent) ? control.parent.value : undefined;
        return Linq.IsPassed(formGroupValue, config.conditionalExpression, parentObject);
    }
}

/**
 * @param {?} config
 * @return {?}
 */
function alphaValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                var /** @type {?} */ testResult = (!config.allowWhiteSpace) ?
                    RegexValidator.isValid(control.value, RegExRule.alpha) :
                    RegexValidator.isValid(control.value, RegExRule.alphaWithSpace);
                if (!testResult)
                    return ObjectMaker.toJson(AnnotationTypes.alpha, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function alphaNumericValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                var /** @type {?} */ testResult = (!config.allowWhiteSpace) ?
                    RegexValidator.isValid(control.value, RegExRule.alphaNumeric) :
                    RegexValidator.isValid(control.value, RegExRule.alphaNumericWithSpace);
                if (!testResult)
                    return ObjectMaker.toJson(AnnotationTypes.alphaNumeric, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function compareValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        const /** @type {?} */ compareControl = ApplicationUtil.getFormControl(config.fieldName, control);
        const /** @type {?} */ controlValue = control.value;
        const /** @type {?} */ compareControlValue = (compareControl) ? compareControl.value : '';
        if (RegexValidator.isNotBlank(controlValue) || RegexValidator.isNotBlank(compareControlValue)) {
            if (!(compareControl && compareControl.value === controlValue))
                return ObjectMaker.toJson(AnnotationTypes.compare, config.message || null, [controlValue, compareControlValue]);
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function containsValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (control.value.indexOf(config.value) == -1)
                    return ObjectMaker.toJson(AnnotationTypes.contains, config.message || null, [config.value, control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function creditCardValidator(config) {
    return (control) => {
        const /** @type {?} */ controlValue = control.value;
        const /** @type {?} */ formGroupValue = ApplicationUtil.getParentObjectValue(control);
        config = ApplicationUtil.getConfigObject(config);
        const /** @type {?} */ parentObject = (control.parent) ? control.parent.value : undefined;
        const /** @type {?} */ refFieldControl = config.fieldName ? ApplicationUtil.getFormControl(config.fieldName, control) : undefined;
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(controlValue)) {
                let /** @type {?} */ isValid = false;
                let /** @type {?} */ cardTypes = config.fieldName && parentObject[config.fieldName] ? [parentObject[config.fieldName]] : config.creditCardTypes;
                for (let /** @type {?} */ creditCardType of cardTypes) {
                    switch (creditCardType) {
                        case "AmericanExpress":
                            isValid = RegexValidator.isValid(controlValue, RegExRule.creditCard.AmericanExpress);
                            break;
                        case "DinersClub":
                            isValid = RegexValidator.isValid(controlValue, RegExRule.creditCard.DinersClub);
                            break;
                        case "Discover":
                            isValid = RegexValidator.isValid(controlValue, RegExRule.creditCard.Discover);
                            break;
                        case "JCB":
                            isValid = RegexValidator.isValid(controlValue, RegExRule.creditCard.JCB);
                            break;
                        case "Maestro":
                            isValid = RegexValidator.isValid(controlValue, RegExRule.creditCard.Maestro);
                            break;
                        case "MasterCard":
                            isValid = RegexValidator.isValid(controlValue, RegExRule.creditCard.MasterCard);
                            break;
                        case "Visa":
                            isValid = RegexValidator.isValid(controlValue, RegExRule.creditCard.Visa);
                            break;
                    }
                }
                isValid = isValid ? controlValue.length == 16 : isValid;
                if (!isValid)
                    return ObjectMaker.toJson(AnnotationTypes.creditCard, config.message || null, [controlValue]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function digitValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!RegexValidator.isValid(control.value, RegExRule.onlyDigit))
                    return ObjectMaker.toJson(AnnotationTypes.digit, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

class DecoratorName {
}
DecoratorName.alpha = "alpha";
DecoratorName.alphaNumeric = "alpha-numeric";
DecoratorName.compare = "compare";
DecoratorName.contains = "contains";
DecoratorName.crediCard = "credit-card";
DecoratorName.email = "email";
DecoratorName.hexColor = "hex-color";
DecoratorName.lowerCase = "lower-case";
DecoratorName.maxDate = "max-date";
DecoratorName.minDate = "min-date";
DecoratorName.maxLength = "max-length";
DecoratorName.maxNumber = "max-number";
DecoratorName.minNumber = "min-number";
DecoratorName.minLength = "min-length";
DecoratorName.password = "password";
DecoratorName.pattern = "pattern";
DecoratorName.range = "range";
DecoratorName.required = "required";
DecoratorName.upperCase = "upper-case";
DecoratorName.digit = "digit";
DecoratorName.nested = "nested";

class DateProvider {
    /**
     * @return {?}
     */
    regex() {
        var /** @type {?} */ regExp;
        if (ReactiveFormConfig && ReactiveFormConfig.json && ReactiveFormConfig.json.internationalization && ReactiveFormConfig.json.internationalization.dateFormat && ReactiveFormConfig.json.internationalization.seperator) {
            switch (ReactiveFormConfig.json.internationalization.dateFormat) {
                case 'ymd':
                    regExp = /^(\d{4}-\d{1,2}-\d{1,2})$/;
                    break;
                case 'dmy':
                case 'mdy':
                    regExp = /^(\d{1,2}-\d{1,2}-\d{4})$/;
                    break;
            }
        }
        return regExp;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    getDate(value) {
        let /** @type {?} */ year, /** @type {?} */ month, /** @type {?} */ day;
        if (ReactiveFormConfig && ReactiveFormConfig.json && ReactiveFormConfig.json.internationalization && ReactiveFormConfig.json.internationalization.dateFormat && ReactiveFormConfig.json.internationalization.seperator) {
            var /** @type {?} */ seperator = ReactiveFormConfig.json.internationalization.seperator;
            switch (ReactiveFormConfig.json.internationalization.dateFormat) {
                case 'ymd':
                    [year, month, day] = value.split(seperator).map((val) => +val);
                    break;
                case 'dmy':
                    [day, month, year] = value.split(seperator).map((val) => +val);
                    break;
                case 'mdy':
                    [month, day, year] = value.split(seperator).map((val) => +val);
                    break;
            }
        }
        return new Date(year, month - 1, day);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    isValid(value) {
        value = value.replace(ReactiveFormConfig.json.internationalization.seperator, '-').replace(ReactiveFormConfig.json.internationalization.seperator, '-');
        return this.regex().test(value);
    }
}

/**
 * @param {?} config
 * @return {?}
 */
function emailValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!RegexValidator.isValid(control.value, RegExRule.basicEmail))
                    return ObjectMaker.toJson(AnnotationTypes.email, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function hexColorValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                let /** @type {?} */ hexRegex = RegExRule.strictHexColor;
                if (!RegexValidator.isValid(control.value, hexRegex))
                    return ObjectMaker.toJson(AnnotationTypes.hexColor, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function lowercaseValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!(control.value === control.value.toLowerCase()))
                    return ObjectMaker.toJson(AnnotationTypes.lowerCase, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function maxDateValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        var /** @type {?} */ dateProvider = new DateProvider();
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (dateProvider.isValid(control.value)) {
                    let /** @type {?} */ maxDate = config.value;
                    let /** @type {?} */ currentValueDate = dateProvider.getDate(control.value);
                    if (!(maxDate >= currentValueDate))
                        return ObjectMaker.toJson(AnnotationTypes.maxDate, config.message || null, [control.value]);
                }
                else
                    return ObjectMaker.toJson(AnnotationTypes.maxDate, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function maxLengthValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!(control.value.length <= config.value))
                    return ObjectMaker.toJson(AnnotationTypes.maxLength, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function maxNumberValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!(parseFloat(control.value) <= config.value))
                    return ObjectMaker.toJson(AnnotationTypes.maxNumber, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function minDateValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        var /** @type {?} */ dateProvider = new DateProvider();
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (dateProvider.isValid(control.value)) {
                    let /** @type {?} */ minDate = config.value;
                    let /** @type {?} */ currentControlValue = dateProvider.getDate(control.value);
                    if (!(currentControlValue >= minDate))
                        return ObjectMaker.toJson(AnnotationTypes.minDate, config.message || null, [control.value]);
                }
                else
                    return ObjectMaker.toJson(AnnotationTypes.minDate, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function minLengthValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!(String(control.value).length >= config.value))
                    return ObjectMaker.toJson(AnnotationTypes.minLength, config.message || null, [config.value, control.value.length, control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function minNumberValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!(parseFloat(control.value) >= config.value))
                    return ObjectMaker.toJson(AnnotationTypes.minNumber, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function passwordValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        let /** @type {?} */ controlValue = control.value;
        const /** @type {?} */ formGroupValue = ApplicationUtil.getParentObjectValue(control);
        if (RegexValidator.isNotBlank(controlValue)) {
            let /** @type {?} */ validation = RegexValidator.isValidPassword(config.validation, controlValue);
            if (!validation.isValid)
                return ObjectMaker.toJson(AnnotationTypes.password, config.message || null, [controlValue]);
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function rangeValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!(String(control.value).indexOf(".") == -1 && parseInt(control.value) >= config.minimumNumber && parseInt(control.value) <= config.maximumNumber))
                    return ObjectMaker.toJson(AnnotationTypes.range, config.message || null, [config.minimumNumber, config.maximumNumber, control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function uppercaseValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!(control.value === control.value.toUpperCase()))
                    return ObjectMaker.toJson(AnnotationTypes.upperCase, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function requiredValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (!RegexValidator.isNotBlank(control.value)) {
                return ObjectMaker.toJson(AnnotationTypes.required, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function patternValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                for (var /** @type {?} */ pattern in config.expression)
                    if (!(RegexValidator.isValid(control.value, config.expression[pattern])))
                        return ObjectMaker.toJson(pattern, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function timeValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                var /** @type {?} */ testResult = false;
                testResult = config.allowSeconds ? RegexValidator.isValid(control.value, RegExRule.timeWithSeconds) : RegexValidator.isValid(control.value, RegExRule.time);
                if (!testResult)
                    return ObjectMaker.toJson(AnnotationTypes.time, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function urlValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!RegexValidator.isValid(control.value, RegExRule.url))
                    return ObjectMaker.toJson(AnnotationTypes.url, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function jsonValidator(config) {
    /**
     * @param {?} value
     * @return {?}
     */
    function process(value) {
        var /** @type {?} */ result = false;
        try {
            var /** @type {?} */ json = JSON.parse(value);
            result = !!json && typeof json === 'object';
        }
        catch (ex) {
            result = false;
        }
        return result;
    }
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (process(control.value))
                    return ObjectMaker.toJson(AnnotationTypes.json, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function greaterThanValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        const /** @type {?} */ matchControl = control.root.get([config.fieldName]);
        const /** @type {?} */ matchControlValue = (matchControl) ? matchControl.value : '';
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value) && RegexValidator.isNotBlank(matchControlValue)) {
                if (!(matchControl && parseFloat(control.value) > parseFloat(matchControlValue)))
                    return ObjectMaker.toJson(AnnotationTypes.greaterThan, config.message || null, [control.value, matchControlValue]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function greaterThanEqualToValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        const /** @type {?} */ matchControl = control.root.get([config.fieldName]);
        const /** @type {?} */ matchControlValue = (matchControl) ? matchControl.value : '';
        if (FormProvider.ProcessRule(control, config)) {
            if ((RegexValidator.isNotBlank(control.value) && RegexValidator.isNotBlank(matchControlValue))) {
                if (!(matchControl && parseFloat(control.value) >= parseFloat(matchControlValue)))
                    return ObjectMaker.toJson(AnnotationTypes.greaterThanEqualTo, config.message || null, [control.value, matchControlValue]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function lessThanEqualToValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        const /** @type {?} */ matchControl = control.root.get([config.fieldName]);
        const /** @type {?} */ matchControlValue = (matchControl) ? matchControl.value : '';
        if (FormProvider.ProcessRule(control, config)) {
            if ((RegexValidator.isNotBlank(control.value) && RegexValidator.isNotBlank(matchControlValue))) {
                if (!(matchControl && parseFloat(control.value) <= parseFloat(matchControlValue)))
                    return ObjectMaker.toJson(AnnotationTypes.lessThanEqualTo, config.message || null, [control.value, matchControlValue]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function lessThanValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        const /** @type {?} */ matchControl = control.root.get([config.fieldName]);
        const /** @type {?} */ matchControlValue = (matchControl) ? matchControl.value : '';
        if (FormProvider.ProcessRule(control, config)) {
            if ((RegexValidator.isNotBlank(control.value) && RegexValidator.isNotBlank(matchControlValue))) {
                if (!(matchControl && parseFloat(control.value) < parseFloat(matchControlValue)))
                    return ObjectMaker.toJson(AnnotationTypes.lessThan, config.message || null, [control.value, matchControlValue]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function choiceValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            config.minLength = (config.minLength == undefined) ? 0 : config.minLength;
            config.maxLength = (config.maxLength == undefined) ? 0 : config.maxLength;
            if (control.value instanceof Array) {
                if (!((config.minLength <= control.value.length && config.maxLength == 0) || (config.maxLength >= control.value.length)))
                    return ObjectMaker.toJson(AnnotationTypes.choice, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function differentValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        const /** @type {?} */ differentControl = control.root.get([config.fieldName]);
        const /** @type {?} */ differentControlValue = (differentControl) ? differentControl.value : '';
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!(differentControl && differentControl.value != control.value))
                    return ObjectMaker.toJson(AnnotationTypes.different, config.message || null, [control.value, differentControlValue]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function numericValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!RegexValidator.isValid(control.value, ApplicationUtil.numericValidation(config.allowDecimal, config.acceptValue)))
                    return ObjectMaker.toJson(AnnotationTypes.numeric, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function evenValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!(control.value % 2 == 0))
                    return ObjectMaker.toJson(AnnotationTypes.even, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function oddValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!(!(control.value % 2 == 0)) || !ApplicationUtil.isNumeric(control.value))
                    return ObjectMaker.toJson(AnnotationTypes.odd, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function factorValidator(config) {
    /**
     * @param {?} dividend
     * @return {?}
     */
    function positiveFactors(dividend) {
        let /** @type {?} */ factors = [];
        let /** @type {?} */ index = 1;
        for (index = 1; index <= Math.floor(Math.sqrt(dividend)); index += 1) {
            if (dividend % index === 0) {
                factors.push(index);
                if (dividend / index !== index)
                    factors.push(dividend / index);
            }
        }
        factors.sort((x, y) => { return x - y; });
        return factors;
    }
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        const /** @type {?} */ dividendField = (control.parent && config.fieldName) ? control.parent.get([config.fieldName]) : undefined;
        const /** @type {?} */ dividend = (config.fieldName && dividendField) ? dividendField.value : config.dividend;
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value) && dividend > 0) {
                if (!RegexValidator.isValid(control.value, RegExRule.onlyDigit) || positiveFactors(dividend).indexOf(parseInt(control.value)) == -1)
                    return ObjectMaker.toJson(AnnotationTypes.factor, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function leapYearValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                var /** @type {?} */ testResult = (control.value % 100 === 0) ? (control.value % 400 === 0) : (control.value % 4 === 0);
                if (!testResult)
                    return ObjectMaker.toJson(AnnotationTypes.leapYear, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function allOfValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (control.value instanceof Array) {
                var /** @type {?} */ testResult = false;
                for (let /** @type {?} */ value of config.matchValues) {
                    testResult = control.value.some((y) => y == value);
                    if (!testResult)
                        break;
                }
                if (!testResult)
                    return ObjectMaker.toJson(AnnotationTypes.allOf, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function oneOfValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (control.value instanceof Array) {
                var /** @type {?} */ testResult = false;
                for (let /** @type {?} */ value of config.matchValues) {
                    testResult = control.value.some((y) => y == value);
                    if (testResult)
                        break;
                }
                if (!testResult)
                    return ObjectMaker.toJson(AnnotationTypes.oneOf, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function noneOfValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (control.value instanceof Array) {
                var /** @type {?} */ testResult = false;
                for (let /** @type {?} */ value of config.matchValues) {
                    testResult = control.value.some((y) => y == value);
                    if (testResult)
                        break;
                }
                if (testResult)
                    return ObjectMaker.toJson(AnnotationTypes.noneOf, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function macValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!RegexValidator.isValid(control.value, RegExRule.macId))
                    return ObjectMaker.toJson(AnnotationTypes.mac, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function asciiValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                var /** @type {?} */ testResult = RegexValidator.isValid(control.value, RegExRule.ascii);
                if (!testResult)
                    return ObjectMaker.toJson(AnnotationTypes.ascii, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function dataUriValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!RegexValidator.isValid(control.value, RegExRule.dataUri))
                    return ObjectMaker.toJson(AnnotationTypes.dataUri, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function portValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                var /** @type {?} */ testResult = RegexValidator.isValid(control.value, RegExRule.onlyDigit) && (control.value >= 0 && control.value <= 65535);
                if (!testResult)
                    return ObjectMaker.toJson(AnnotationTypes.port, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function latitudeValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!RegexValidator.isValid(control.value, RegExRule.lat))
                    return ObjectMaker.toJson(AnnotationTypes.latitude, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function extensionValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                let /** @type {?} */ files = (control.value);
                let /** @type {?} */ testResult = true;
                for (let /** @type {?} */ file of files) {
                    let /** @type {?} */ splitText = file.name.split(".");
                    let /** @type {?} */ extension = splitText[splitText.length - 1];
                    let /** @type {?} */ result = config.extensions.filter(t => { return extension.toLowerCase() == t.toLowerCase(); })[0];
                    if (!result) {
                        testResult = false;
                        break;
                    }
                }
                if (!testResult)
                    return ObjectMaker.toJson(AnnotationTypes.extension, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function fileSizeValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                let /** @type {?} */ files = (control.value);
                let /** @type {?} */ minFileSize = config.minSize ? config.minSize : 0;
                let /** @type {?} */ testResult = false;
                for (let /** @type {?} */ file of files) {
                    let /** @type {?} */ fileSize = file.size;
                    testResult = (!(fileSize >= minFileSize && fileSize <= config.maxSize));
                    if (testResult)
                        break;
                }
                if (testResult)
                    return ObjectMaker.toJson(AnnotationTypes.fileSize, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function endsWithValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                var /** @type {?} */ endString = String(control.value).substr(control.value.length - config.value.length, config.value.length);
                if (endString != config.value)
                    return ObjectMaker.toJson(AnnotationTypes.endsWith, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function startsWithValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                var /** @type {?} */ startString = String(control.value).substr(0, config.value.length);
                if (startString != config.value)
                    return ObjectMaker.toJson(AnnotationTypes.startsWith, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function primeNumberValidator(config) {
    /**
     * @param {?} value
     * @return {?}
     */
    function isPrime(value) {
        let /** @type {?} */ isPrimeNumber = value != 1;
        for (var /** @type {?} */ i = 2; i < value; i++) {
            if (value % i == 0) {
                isPrimeNumber = false;
                break;
            }
        }
        return isPrimeNumber;
    }
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!ApplicationUtil.isNumeric(control.value) || !isPrime(control.value))
                    return ObjectMaker.toJson(AnnotationTypes.primeNumber, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function latLongValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                let /** @type {?} */ splitText = control.value.split(',');
                if (!(splitText.length > 1 && RegexValidator.isValid(splitText[0], RegExRule.lat) && RegexValidator.isValid(splitText[1], RegExRule.long)))
                    return ObjectMaker.toJson(AnnotationTypes.latLong, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function longitudeValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (!RegexValidator.isValid(control.value, RegExRule.long))
                    return ObjectMaker.toJson(AnnotationTypes.longitude, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function composeValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (config.validators) {
                let /** @type {?} */ result = undefined;
                for (let /** @type {?} */ validator of config.validators) {
                    result = validator(control);
                    if (result)
                        break;
                }
                if (result)
                    return result;
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @param {?} entity
 * @return {?}
 */
function ruleValidator(config, entity) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            let /** @type {?} */ result = null;
            for (let /** @type {?} */ rule of config.customRules) {
                result = rule(entity);
                if (result)
                    break;
            }
            if (result)
                return result;
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function fileValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                let /** @type {?} */ files = (control.value);
                let /** @type {?} */ minFiles = config.minFiles ? config.minFiles : 1;
                if (!(files.length > 0 && files[0] instanceof File && files.length >= minFiles && files.length <= config.maxFiles))
                    return ObjectMaker.toJson(AnnotationTypes.file, config.message || null, [control.value]);
            }
        }
        return ObjectMaker.null();
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function customValidator(config) {
    return (control) => {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            const /** @type {?} */ formGroupValue = ApplicationUtil.getParentObjectValue(control);
            const /** @type {?} */ parentObject = (control.parent) ? control.parent.value : undefined;
            let /** @type {?} */ result = null;
            for (let /** @type {?} */ rule of config.customRules) {
                result = rule(formGroupValue, parentObject, config.additionalValue);
                if (result)
                    break;
            }
            if (result)
                return result;
        }
        return ObjectMaker.null();
    };
}

const APP_VALIDATORS = {
    "alphaNumeric": alphaNumericValidator,
    "alpha": alphaValidator,
    "compare": compareValidator,
    "email": emailValidator,
    "hexColor": hexColorValidator,
    "lowerCase": lowercaseValidator,
    "maxDate": maxDateValidator,
    "maxNumber": maxNumberValidator,
    "minDate": minDateValidator,
    "minNumber": minNumberValidator,
    "contains": containsValidator,
    "upperCase": uppercaseValidator,
    "maxLength": maxLengthValidator,
    "minLength": minLengthValidator,
    "password": passwordValidator,
    "range": rangeValidator,
    "required": requiredValidator,
    "creditCard": creditCardValidator,
    "digit": digitValidator,
    "pattern": patternValidator,
    "time": timeValidator,
    "url": urlValidator,
    "json": jsonValidator,
    "greaterThan": greaterThanValidator,
    "greaterThanEqualTo": greaterThanEqualToValidator,
    "lessThan": lessThanValidator,
    "lessThanEqualTo": lessThanEqualToValidator,
    "choice": choiceValidator,
    "different": differentValidator,
    "numeric": numericValidator,
    "even": evenValidator,
    "odd": oddValidator,
    "factor": factorValidator,
    "leapYear": leapYearValidator,
    "allOf": allOfValidator,
    "oneOf": oneOfValidator,
    "noneOf": noneOfValidator,
    "mac": macValidator,
    "ascii": asciiValidator,
    "dataUri": dataUriValidator,
    "port": portValidator,
    "latLong": latLongValidator,
    "extension": extensionValidator,
    "fileSize": fileSizeValidator,
    "endsWith": endsWithValidator,
    "startsWith": startsWithValidator,
    "primeNumber": primeNumberValidator,
    "latitude": latitudeValidator,
    "longitude": longitudeValidator,
    "compose": composeValidator,
    "rule": ruleValidator,
    "file": fileValidator
};

class RxFormControl extends FormControl {
    /**
     * @param {?} formState
     * @param {?} validator
     * @param {?} asyncValidator
     * @param {?} entityObject
     * @param {?} baseObject
     * @param {?} controlName
     */
    constructor(formState, validator, asyncValidator, entityObject, baseObject, controlName) {
        super(formState, validator, asyncValidator);
        this.entityObject = entityObject;
        this.baseObject = baseObject;
        this.keyName = controlName;
    }
    /**
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    setValue(value, options) {
        if (options && options.dirty)
            this.baseObject[this.keyName] = value;
        this.entityObject[this.keyName] = value;
        super.setValue(value, options);
        if (this.errors) {
            Object.keys(this.errors).forEach(t => {
                this.parent[CONTROLS_ERROR][this.keyName] = this.errorMessage = this.getErrorMessage(this.errors, t);
                if (!this.errorMessage) {
                    let /** @type {?} */ errorObject = ObjectMaker.toJson(t, undefined, [this.errors[t][t]]);
                    this.parent[CONTROLS_ERROR][this.keyName] = this.errorMessage = this.getErrorMessage(errorObject, t);
                }
            });
        }
        else {
            this.errorMessage = undefined;
            this.parent[CONTROLS_ERROR][this.keyName] = undefined;
            delete this.parent[CONTROLS_ERROR][this.keyName];
        }
        if (options && !options.updateChanged && this.root[VALUE_CHANGED_SYNC]) {
            this.root[VALUE_CHANGED_SYNC]();
        }
    }
    /**
     * @param {?} errorObject
     * @param {?} keyName
     * @return {?}
     */
    getErrorMessage(errorObject, keyName) {
        if (errorObject[keyName][MESSAGE])
            return errorObject[keyName][MESSAGE];
        return;
    }
}

class EntityService {
    /**
     * @param {?} jsonObject
     * @return {?}
     */
    clone(jsonObject) {
        let /** @type {?} */ jObject = {};
        for (var /** @type {?} */ columnName in jsonObject) {
            if (Array.isArray(jsonObject[columnName])) {
                jObject[columnName] = [];
                for (let /** @type {?} */ row of jsonObject[columnName]) {
                    jObject[columnName].push(this.clone(row));
                }
            }
            else if (typeof jsonObject[columnName] == "object")
                jObject[columnName] = this.clone(jsonObject[columnName]);
            else
                jObject[columnName] = jsonObject[columnName];
        }
        return jObject;
    }
}

class RxFormArray extends FormArray {
    /**
     * @param {?} arrayObject
     * @param {?} controls
     * @param {?=} validatorOrOpts
     * @param {?=} asyncValidator
     */
    constructor(arrayObject, controls, validatorOrOpts, asyncValidator) {
        super(controls, validatorOrOpts, asyncValidator);
        this.arrayObject = arrayObject;
    }
    /**
     * @param {?} control
     * @return {?}
     */
    push(control) {
        let /** @type {?} */ formGroup = this.root;
        if (this.arrayObject)
            if (control.modelInstance)
                this.arrayObject.push(control.modelInstance);
        super.push(control);
        if (formGroup["valueChangedSync"])
            formGroup.valueChangedSync();
    }
    /**
     * @param {?} index
     * @return {?}
     */
    removeAt(index) {
        let /** @type {?} */ formGroup = this.root;
        this.arrayObject.splice(index, 1);
        super.removeAt(index);
        if (formGroup["valueChangedSync"])
            formGroup.valueChangedSync();
    }
}

class RxFormGroup extends FormGroup {
    /**
     * @param {?} model
     * @param {?} entityObject
     * @param {?} controls
     * @param {?=} validatorOrOpts
     * @param {?=} asyncValidator
     */
    constructor(model, entityObject, controls, validatorOrOpts, asyncValidator) {
        super(controls, validatorOrOpts, asyncValidator);
        this.model = model;
        this.entityObject = entityObject;
        this.controlsError = {};
        this.baseObject = Object.assign({}, this.entityObject);
        this.entityService = new EntityService();
    }
    /**
     * @return {?}
     */
    isDirty() {
        let /** @type {?} */ isDirty = false;
        for (let /** @type {?} */ name in this.value) {
            let /** @type {?} */ currentValue = this.controls[name].value;
            if (!(this.controls[name] instanceof FormGroup || this.controls[name] instanceof FormArray)) {
                isDirty = ApplicationUtil.notEqualTo(this.baseObject[name], currentValue);
            }
            else if (this.controls[name] instanceof RxFormGroup)
                isDirty = ((this.controls[name])).isDirty();
            else if (this.controls[name] instanceof FormArray) {
                for (let /** @type {?} */ formGroup of ((this.controls[name])).controls) {
                    isDirty = ((formGroup)).isDirty();
                }
            }
            if (isDirty)
                break;
        }
        return isDirty;
    }
    ;
    /**
     * @return {?}
     */
    resetForm() {
        for (let /** @type {?} */ name in this.controls) {
            if (this.controls[name] instanceof RxFormGroup)
                ((this.controls[name])).resetForm();
            else if (this.controls[name] instanceof FormArray) {
                for (let /** @type {?} */ formGroup of ((this.controls[name])).controls) {
                    ((formGroup)).resetForm();
                }
            }
            else {
                if (RegexValidator.isNotBlank(this.baseObject[name]))
                    this.controls[name].setValue(this.baseObject[name]);
                else
                    this.controls[name].setValue(undefined);
            }
        }
    }
    /**
     * @param {?} onlyMessage
     * @return {?}
     */
    getErrorSummary(onlyMessage) {
        let /** @type {?} */ jObject = {};
        Object.keys(this.controls).forEach(columnName => {
            if (this.controls[columnName] instanceof FormGroup) {
                let /** @type {?} */ error = ((this.controls[columnName])).getErrorSummary(false);
                if (Object.keys(error).length > 0)
                    jObject[columnName] = error;
            }
            else if (this.controls[columnName] instanceof FormArray) {
                let /** @type {?} */ index = 0;
                for (let /** @type {?} */ formGroup of ((this.controls[columnName])).controls) {
                    let /** @type {?} */ error = ((formGroup)).getErrorSummary(false);
                    if (Object.keys(error).length > 0) {
                        error.index = index;
                        if (!jObject[columnName])
                            jObject[columnName] = [];
                        jObject[columnName].push(error);
                    }
                    index++;
                }
            }
            else {
                if (this.controls[columnName].errors) {
                    let /** @type {?} */ error = this.controls[columnName].errors;
                    if (onlyMessage)
                        for (let /** @type {?} */ validationName in error)
                            jObject[columnName] = error[validationName].message;
                    else
                        jObject[columnName] = error;
                }
            }
        });
        return jObject;
    }
    /**
     * @return {?}
     */
    valueChangedSync() {
        Object.keys(this.controls).forEach(columnName => {
            if (!(this.controls[columnName] instanceof FormArray || this.controls[columnName] instanceof RxFormArray) && !(this.controls[columnName] instanceof FormGroup || this.controls[columnName] instanceof RxFormGroup) && !(this.entityObject[columnName] instanceof FormControl || this.entityObject[columnName] instanceof RxFormControl) && this.controls[columnName].value != this.entityObject[columnName]) {
                this.controls[columnName].setValue(this.entityObject[columnName], { updateChanged: true });
            }
            else if ((this.controls[columnName] instanceof FormArray || this.controls[columnName] instanceof RxFormArray)) {
                for (let /** @type {?} */ formGroup of ((this.controls[columnName])).controls) {
                    ((formGroup)).valueChangedSync();
                }
            }
            else if ((this.controls[columnName] instanceof RxFormGroup)) {
                ((this.controls[columnName])).valueChangedSync();
            }
        });
    }
    /**
     * @return {?}
     */
    get modelInstanceValue() {
        return this.entityService.clone(this.entityObject);
    }
    /**
     * @return {?}
     */
    get modelInstance() {
        return this.entityObject;
    }
}

class RxFormBuilder extends BaseFormBuilder {
    constructor() {
        super();
        this.conditionalObjectProps = [];
        this.conditionalValidationInstance = {};
        this.builderConfigurationConditionalObjectProps = [];
        this.formGroupPropOtherValidator = {};
        this.currentFormGroupPropOtherValidator = {};
        this.isNested = false;
        this.isGroupCalled = false;
    }
    /**
     * @param {?} instanceFunc
     * @return {?}
     */
    getInstanceContainer(instanceFunc) {
        return defaultContainer.get(instanceFunc);
    }
    /**
     * @param {?} formGroup
     * @param {?} object
     * @return {?}
     */
    setValue(formGroup, object) {
        for (var /** @type {?} */ col in object) {
            var /** @type {?} */ control = formGroup.get([col]);
            control.setValue(object[col]);
            control.updateValueAndValidity();
        }
    }
    /**
     * @param {?} fomrBuilderConfiguration
     * @return {?}
     */
    extractExpressions(fomrBuilderConfiguration) {
        if (fomrBuilderConfiguration && fomrBuilderConfiguration.dynamicValidation) {
            for (var /** @type {?} */ property in fomrBuilderConfiguration.dynamicValidation) {
                for (var /** @type {?} */ decorator in fomrBuilderConfiguration.dynamicValidation[property]) {
                    if (fomrBuilderConfiguration.dynamicValidation[property][decorator].conditionalExpression) {
                        let /** @type {?} */ columns = Linq.expressionColumns(fomrBuilderConfiguration.dynamicValidation[property][decorator].conditionalExpression);
                        defaultContainer.addChangeValidation(this.conditionalValidationInstance, property, columns);
                    }
                }
            }
        }
        return null;
    }
    /**
     * @param {?} property
     * @param {?} propertyValidators
     * @param {?} propValidationConfig
     * @param {?} instance
     * @param {?} entity
     * @return {?}
     */
    addFormControl(property, propertyValidators, propValidationConfig, instance, entity) {
        let /** @type {?} */ validators = [];
        let /** @type {?} */ columns = [];
        if ((instance.conditionalValidationProps && instance.conditionalValidationProps[property.name]) || (this.conditionalValidationInstance.conditionalValidationProps && this.conditionalValidationInstance.conditionalValidationProps[property.name])) {
            let /** @type {?} */ props = [];
            if ((instance.conditionalValidationProps && instance.conditionalValidationProps[property.name]))
                instance.conditionalValidationProps[property.name].forEach(t => props.push(t));
            if (this.conditionalValidationInstance.conditionalValidationProps && this.conditionalValidationInstance.conditionalValidationProps[property.name])
                this.conditionalValidationInstance.conditionalValidationProps[property.name].forEach(t => props.push(t));
            validators.push(conditionalChangeValidator(props));
        }
        if (this.conditionalObjectProps.length > 0 || this.builderConfigurationConditionalObjectProps.length > 0) {
            let /** @type {?} */ propConditions = [];
            if (this.conditionalObjectProps)
                propConditions = this.conditionalObjectProps.filter(t => t.propName == property.name);
            if (this.builderConfigurationConditionalObjectProps)
                this.builderConfigurationConditionalObjectProps.filter(t => t.propName == property.name).forEach(t => propConditions.push(t));
            propConditions.forEach(t => {
                if (t.referencePropName && columns.indexOf(t.referencePropName) == -1)
                    columns.push(t.referencePropName);
            });
            if (columns.length > 0)
                validators.push(conditionalChangeValidator(columns));
        }
        for (let /** @type {?} */ propertyValidator of propertyValidators) {
            propertyValidator.annotationType == AnnotationTypes.rule ? validators.push(APP_VALIDATORS[propertyValidator.annotationType](propertyValidator.config, entity)) : validators.push(APP_VALIDATORS[propertyValidator.annotationType](propertyValidator.config));
        }
        if (propValidationConfig)
            this.additionalValidation(validators, propValidationConfig);
        if (this.currentFormGroupPropOtherValidator[property.name])
            this.currentFormGroupPropOtherValidator[property.name].forEach(t => { validators.push(t); });
        return validators;
    }
    /**
     * @param {?} validations
     * @param {?} propValidationConfig
     * @return {?}
     */
    additionalValidation(validations, propValidationConfig) {
        for (var /** @type {?} */ col in AnnotationTypes) {
            if (propValidationConfig[AnnotationTypes[col]] && col != "custom") {
                validations.push(APP_VALIDATORS[AnnotationTypes[col]](propValidationConfig[AnnotationTypes[col]]));
            }
            else if (col == AnnotationTypes.custom && propValidationConfig[AnnotationTypes[col]])
                validations.push(propValidationConfig[col]);
        }
    }
    /**
     * @template T
     * @param {?} instanceContainer
     * @param {?} object
     * @return {?}
     */
    checkObjectPropAdditionalValidation(instanceContainer, object) {
        var /** @type {?} */ props = instanceContainer.properties.filter(t => t.propertyType == OBJECT_PROPERTY || t.propertyType == ARRAY_PROPERTY);
        props.forEach(t => {
            let /** @type {?} */ instance = this.getInstanceContainer(t.entity);
            if (instance.conditionalValidationProps) {
                for (var /** @type {?} */ key in instance.conditionalValidationProps) {
                    var /** @type {?} */ prop = instanceContainer.properties.filter(t => t.name == key)[0];
                    if (prop) {
                        if (!instanceContainer.conditionalValidationProps)
                            instanceContainer.conditionalValidationProps = {};
                        if (!instanceContainer.conditionalValidationProps[key])
                            instanceContainer.conditionalValidationProps[key] = [];
                        instance.conditionalValidationProps[key].forEach(x => {
                            if (t.propertyType != ARRAY_PROPERTY)
                                instanceContainer.conditionalValidationProps[key].push([t.name, x].join('.'));
                            else
                                instanceContainer.conditionalValidationProps[key].push([t.name, x].join('[]'));
                        });
                    }
                }
            }
        });
    }
    /**
     * @param {?} model
     * @param {?=} entityObject
     * @param {?=} formBuilderConfiguration
     * @return {?}
     */
    getObject(model, entityObject, formBuilderConfiguration) {
        let /** @type {?} */ json = {};
        if (typeof model == FUNCTION_STRING)
            json.model = model;
        if (typeof model == FUNCTION_STRING && (entityObject instanceof FormBuilderConfiguration)) {
            json.entityObject = this.createClassObject(json.model, entityObject);
        }
        if (entityObject && !(entityObject instanceof FormBuilderConfiguration))
            json.entityObject = entityObject;
        if (entityObject instanceof FormBuilderConfiguration && !formBuilderConfiguration)
            json.formBuilderConfiguration = entityObject;
        else if (!(entityObject instanceof FormBuilderConfiguration) && formBuilderConfiguration) {
            json.formBuilderConfiguration = formBuilderConfiguration;
            json.entityObject = this.createClassObject(json.model, json.formBuilderConfiguration, json.entityObject);
        }
        if (!entityObject) {
            if (typeof model == OBJECT_STRING)
                json.model = model.constructor;
            json.entityObject = this.createClassObject(json.model, json.formBuilderConfiguration, model);
        }
        else if (model && (entityObject instanceof FormBuilderConfiguration) && (typeof model == OBJECT_STRING)) {
            json["model"] = model.constructor;
            json["entityObject"] = this.createClassObject(json.model, json.formBuilderConfiguration, model);
        }
        return json;
    }
    /**
     * @param {?} groupObject
     * @param {?=} validatorConfig
     * @return {?}
     */
    group(groupObject, validatorConfig) {
        let /** @type {?} */ modelInstance = super.createInstance();
        let /** @type {?} */ entityObject = {};
        this.formGroupPropOtherValidator = {};
        this.currentFormGroupPropOtherValidator = this.formGroupPropOtherValidator;
        this.createValidatorFormGroup(groupObject, entityObject, modelInstance, validatorConfig);
        this.currentFormGroupPropOtherValidator = this.formGroupPropOtherValidator;
        this.isGroupCalled = true;
        let /** @type {?} */ formGroup = this.formGroup(modelInstance.constructor, entityObject, validatorConfig);
        this.isGroupCalled = false;
        this.formGroupPropOtherValidator = {};
        this.currentFormGroupPropOtherValidator = this.formGroupPropOtherValidator;
        this.formGroupPropOtherValidator = {};
        return formGroup;
    }
    /**
     * @param {?} propName
     * @param {?} validatorConfig
     * @param {?} modelInstance
     * @return {?}
     */
    applyAllPropValidator(propName, validatorConfig, modelInstance) {
        if (validatorConfig && validatorConfig.applyAllProps) {
            if (!(validatorConfig.excludeProps && validatorConfig.excludeProps.length > 0 && validatorConfig.excludeProps.indexOf(propName) == -1)) {
                validatorConfig.applyAllProps.forEach((t) => {
                    if (t.name == RX_WEB_VALIDATOR) {
                        t(propName, modelInstance);
                    }
                    else {
                        if (!this.currentFormGroupPropOtherValidator[propName])
                            this.currentFormGroupPropOtherValidator[propName] = [];
                        this.currentFormGroupPropOtherValidator[propName].push(t);
                    }
                });
            }
        }
    }
    /**
     * @param {?} propName
     * @param {?} validatorConfig
     * @return {?}
     */
    dynamicValidationPropCheck(propName, validatorConfig) {
        return (validatorConfig == undefined) ? true : (!validatorConfig.dynamicValidationConfigurationPropertyName) ? true : validatorConfig.dynamicValidationConfigurationPropertyName == propName ? false : true;
    }
    /**
     * @param {?} groupObject
     * @param {?} entityObject
     * @param {?} modelInstance
     * @param {?} validatorConfig
     * @return {?}
     */
    createValidatorFormGroup(groupObject, entityObject, modelInstance, validatorConfig) {
        for (var /** @type {?} */ propName in groupObject) {
            var /** @type {?} */ prop = groupObject[propName];
            if (prop instanceof Array && prop.length > 0 && typeof prop[0] != OBJECT_STRING) {
                let /** @type {?} */ propValidators = (prop.length > 1 && prop[1] instanceof Array) ? prop[1] : (prop.length == 2) ? [prop[1]] : [];
                let /** @type {?} */ propertyAdded = false;
                for (var /** @type {?} */ i = 0; i < propValidators.length; i++) {
                    if (propValidators[i].name == RX_WEB_VALIDATOR) {
                        propValidators[i](propName, modelInstance);
                        propertyAdded = true;
                    }
                    else {
                        if (!this.currentFormGroupPropOtherValidator[propName])
                            this.currentFormGroupPropOtherValidator[propName] = [];
                        this.currentFormGroupPropOtherValidator[propName].push(propValidators[i]);
                    }
                }
                if (!propertyAdded)
                    defaultContainer.initPropertyObject(propName, PROPERTY, undefined, typeof modelInstance == OBJECT_STRING ? modelInstance : { constructor: modelInstance });
                this.applyAllPropValidator(propName, validatorConfig, modelInstance);
            }
            else if (typeof prop == STRING || typeof prop == NUMBER || typeof prop == BOOLEAN) {
                defaultContainer.initPropertyObject(propName, PROPERTY, undefined, typeof modelInstance == OBJECT_STRING ? modelInstance : { constructor: modelInstance });
                this.applyAllPropValidator(propName, validatorConfig, modelInstance);
            }
            else if (prop instanceof Array) {
                if (prop instanceof FormArray) {
                    entityObject[propName] = prop;
                }
                else {
                    let /** @type {?} */ propModelInstance = super.createInstance();
                    if (typeof modelInstance == "function")
                        modelInstance.constructor = modelInstance;
                    defaultContainer.initPropertyObject(propName, ARRAY_PROPERTY, propModelInstance.constructor, modelInstance);
                    entityObject[propName] = [];
                    for (let /** @type {?} */ row of prop) {
                        let /** @type {?} */ jObject = {};
                        entityObject[propName].push(jObject);
                        this.createValidatorFormGroup(row, jObject, propModelInstance.constructor, validatorConfig);
                    }
                }
            }
            else if (typeof prop == OBJECT_STRING && !(prop instanceof FormControl || prop instanceof RxFormControl)) {
                let /** @type {?} */ formGroup = (prop instanceof FormArray) ? prop.controls[0] : prop;
                if (!formGroup.model && (prop instanceof FormGroup || prop instanceof RxFormGroup)) {
                    formGroup = this.group(formGroup.controls);
                }
                if (prop instanceof FormGroup || prop instanceof RxFormGroup) {
                    entityObject[propName] = prop;
                    defaultContainer.initPropertyObject(propName, OBJECT_PROPERTY, formGroup.model, modelInstance);
                }
                else if (prop instanceof FormArray) {
                    entityObject[propName] = prop;
                    defaultContainer.initPropertyObject(propName, ARRAY_PROPERTY, formGroup.model, modelInstance);
                }
                else {
                    if (this.dynamicValidationPropCheck(propName, validatorConfig)) {
                        this.formGroupPropOtherValidator[propName] = {};
                        this.currentFormGroupPropOtherValidator = this.formGroupPropOtherValidator[propName];
                        let /** @type {?} */ propModelInstance = super.createInstance();
                        entityObject[propName] = {};
                        entityObject[propName].constructor = propModelInstance.constructor;
                        defaultContainer.initPropertyObject(propName, OBJECT_PROPERTY, entityObject[propName].constructor, modelInstance);
                        let /** @type {?} */ objectValidationConfig = this.getValidatorConfig(validatorConfig, groupObject, propName + ".");
                        this.createValidatorFormGroup(groupObject[propName], entityObject[propName], entityObject[propName].constructor, objectValidationConfig);
                    }
                    else
                        entityObject[propName] = groupObject[propName];
                }
            }
            if (typeof prop == STRING || typeof prop == NUMBER || typeof prop == BOOLEAN) {
                entityObject[propName] = prop;
            }
            else if ((prop && prop.length > 0 && (typeof prop[0] != OBJECT_STRING) && !(prop instanceof FormControl || prop instanceof RxFormControl) && !(prop instanceof FormArray))) {
                entityObject[propName] = prop[0];
            }
            else if (prop instanceof FormArray) {
                entityObject[propName] = prop;
            }
            else if (prop instanceof FormControl || prop instanceof RxFormControl) {
                entityObject[propName] = prop;
                defaultContainer.initPropertyObject(propName, PROPERTY, undefined, modelInstance.constructor ? modelInstance : { constructor: modelInstance });
            }
        }
    }
    /**
     * @param {?} validatorConfig
     * @param {?} entityObject
     * @param {?} rootPropertyName
     * @param {?=} arrayPropertyName
     * @return {?}
     */
    getValidatorConfig(validatorConfig, entityObject, rootPropertyName, arrayPropertyName) {
        let /** @type {?} */ validationProps = {};
        let /** @type {?} */ excludeProps = [];
        let /** @type {?} */ includeProps = [];
        if (validatorConfig) {
            for (var /** @type {?} */ propName in validatorConfig.dynamicValidation) {
                if (propName.indexOf(rootPropertyName) != -1 || (arrayPropertyName && propName.indexOf(arrayPropertyName) != -1)) {
                    let /** @type {?} */ splitProp = propName.split(".")[1];
                    if (splitProp)
                        validationProps[splitProp] = validatorConfig.dynamicValidation[propName];
                }
            }
            if (validatorConfig.excludeProps)
                excludeProps = this.getProps(validatorConfig.excludeProps, rootPropertyName);
            if (validatorConfig.includeProps)
                includeProps = this.getProps(validatorConfig.includeProps, rootPropertyName);
            return { includeProps: includeProps, dynamicValidation: (validatorConfig.dynamicValidationConfigurationPropertyName && entityObject[validatorConfig.dynamicValidationConfigurationPropertyName]) ? entityObject[validatorConfig.dynamicValidationConfigurationPropertyName] : validationProps, excludeProps: excludeProps };
        }
        return {};
    }
    /**
     * @param {?} properties
     * @param {?} rootPropertyName
     * @return {?}
     */
    getProps(properties, rootPropertyName) {
        let /** @type {?} */ props = [];
        for (let /** @type {?} */ prop of properties) {
            if (prop.indexOf(rootPropertyName) != -1) {
                let /** @type {?} */ splitProp = prop.split(".")[1];
                if (splitProp)
                    props.push(splitProp);
            }
        }
        return props;
    }
    /**
     * @template T
     * @param {?} model
     * @param {?=} entityObject
     * @param {?=} formBuilderConfiguration
     * @return {?}
     */
    formGroup(model, entityObject, formBuilderConfiguration) {
        let /** @type {?} */ json = this.getObject(model, entityObject, formBuilderConfiguration);
        model = json.model;
        entityObject = json.entityObject;
        if (entityObject.constructor != model && !this.isGroupCalled) {
            entityObject = json.entityObject = this.updateObject(model, json.entityObject);
        }
        formBuilderConfiguration = json.formBuilderConfiguration;
        if (formBuilderConfiguration)
            this.extractExpressions(formBuilderConfiguration);
        let /** @type {?} */ instanceContainer = this.getInstanceContainer(model);
        this.checkObjectPropAdditionalValidation(instanceContainer, entityObject);
        let /** @type {?} */ formGroupObject = {};
        var /** @type {?} */ additionalValidations = {};
        instanceContainer.properties.forEach(property => {
            let /** @type {?} */ isIncludeProp = true;
            if (formBuilderConfiguration && formBuilderConfiguration.excludeProps && formBuilderConfiguration.excludeProps.length > 0)
                isIncludeProp = formBuilderConfiguration.excludeProps.indexOf(property.name) == -1;
            if (formBuilderConfiguration && formBuilderConfiguration.dynamicValidation)
                additionalValidations = formBuilderConfiguration.dynamicValidation;
            if (formBuilderConfiguration && formBuilderConfiguration.includeProps && formBuilderConfiguration.includeProps.length > 0)
                isIncludeProp = formBuilderConfiguration.includeProps.indexOf(property.name) != -1;
            if (isIncludeProp) {
                switch (property.propertyType) {
                    case PROPERTY:
                        if (!(entityObject[property.name] instanceof FormControl || entityObject[property.name] instanceof RxFormControl)) {
                            var /** @type {?} */ propertyValidators = instanceContainer.propertyAnnotations.filter(t => t.propertyName == property.name);
                            formGroupObject[property.name] = new RxFormControl(entityObject[property.name], this.addFormControl(property, propertyValidators, additionalValidations[property.name], instanceContainer, entityObject), undefined, json.entityObject, Object.assign({}, json.entityObject), property.name);
                            this.isNested = false;
                        }
                        else
                            formGroupObject[property.name] = entityObject[property.name];
                        break;
                    case OBJECT_PROPERTY:
                        if (entityObject[property.name] && entityObject[property.name] instanceof Object && !(entityObject[property.name] instanceof FormGroup || entityObject[property.name] instanceof RxFormGroup)) {
                            this.isNested = true;
                            if (instanceContainer && instanceContainer.conditionalObjectProps)
                                this.conditionalObjectProps = instanceContainer.conditionalObjectProps.filter(t => t.objectPropName == property.name);
                            if (this.conditionalValidationInstance && this.conditionalValidationInstance.conditionalObjectProps)
                                this.builderConfigurationConditionalObjectProps = this.conditionalValidationInstance.conditionalObjectProps.filter(t => t.objectPropName == property.name);
                            if (this.formGroupPropOtherValidator[property.name])
                                this.currentFormGroupPropOtherValidator = this.formGroupPropOtherValidator[property.name];
                            let /** @type {?} */ objectValidationConfig = this.getValidatorConfig(formBuilderConfiguration, entityObject[property.name], `${property.name}.`);
                            formGroupObject[property.name] = this.formGroup(property.entity, entityObject[property.name], objectValidationConfig);
                            this.conditionalObjectProps = [];
                            this.builderConfigurationConditionalObjectProps = [];
                            this.isNested = false;
                        }
                        else if (entityObject[property.name] instanceof FormGroup || entityObject[property.name] instanceof RxFormGroup)
                            formGroupObject[property.name] = entityObject[property.name];
                        break;
                    case ARRAY_PROPERTY:
                        if (entityObject[property.name] && entityObject[property.name] instanceof Array && !(entityObject[property.name] instanceof FormArray)) {
                            this.isNested = true;
                            var /** @type {?} */ formArrayGroup = [];
                            let /** @type {?} */ index = 0;
                            for (let /** @type {?} */ subObject of entityObject[property.name]) {
                                if (instanceContainer && instanceContainer.conditionalObjectProps)
                                    this.conditionalObjectProps = instanceContainer.conditionalObjectProps.filter(t => t.objectPropName == property.name && t.arrayIndex == index);
                                if (this.conditionalValidationInstance && this.conditionalValidationInstance.conditionalObjectProps)
                                    this.builderConfigurationConditionalObjectProps = this.conditionalValidationInstance.conditionalObjectProps.filter(t => t.objectPropName == property.name && t.arrayIndex == index);
                                if (this.formGroupPropOtherValidator[property.name])
                                    this.currentFormGroupPropOtherValidator = this.formGroupPropOtherValidator[property.name];
                                let /** @type {?} */ objectValidationConfig = this.getValidatorConfig(formBuilderConfiguration, subObject, `${property.name}.`, `${property.name}[${index}].`);
                                formArrayGroup.push(this.formGroup(property.entity, subObject, objectValidationConfig));
                                index++;
                                this.conditionalObjectProps = [];
                                this.builderConfigurationConditionalObjectProps = [];
                            }
                            let /** @type {?} */ formBuilder = new FormBuilder();
                            formGroupObject[property.name] = new RxFormArray(entityObject[property.name], formArrayGroup);
                            this.isNested = false;
                        }
                        else if (entityObject[property.name] instanceof FormArray)
                            formGroupObject[property.name] = entityObject[property.name];
                        break;
                }
            }
        });
        if (!this.isNested) {
            this.conditionalValidationInstance = {};
            this.builderConfigurationConditionalObjectProps = [];
        }
        return new RxFormGroup(json.model, json.entityObject, formGroupObject, undefined);
    }
}
RxFormBuilder.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
RxFormBuilder.ctorParameters = () => [];

/**
 * @abstract
 */
class BaseDirective {
}

class RxwebFormDirective extends BaseDirective {
    constructor() {
        super(...arguments);
        this.clearTimeout = 0;
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        if (this.ngForm) {
            this.configureModelValidations();
        }
    }
    /**
     * @return {?}
     */
    configureModelValidations() {
        this.clearTimeout = window.setTimeout(() => {
            window.clearTimeout(this.clearTimeout);
            this.ngForm.form["marked"] = true;
            Object.keys(this.ngForm.form.controls).forEach(key => {
                this.ngForm.form.controls[key].updateValueAndValidity();
            });
            delete this.ngForm.form["marked"];
        }, 500);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
    }
}
RxwebFormDirective.decorators = [
    { type: Directive, args: [{
                selector: '[formGroup],[rxwebForm]',
            },] },
];
/**
 * @nocollapse
 */
RxwebFormDirective.ctorParameters = () => [];
RxwebFormDirective.propDecorators = {
    'ngForm': [{ type: Input, args: ['rxwebForm',] },],
};

class DecimalProvider {
    /**
     * @param {?} decimalPipe
     */
    constructor(decimalPipe) {
        this.decimalPipe = decimalPipe;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    replacer(value) {
        value = value.replace(RegexValidator.commaRegex(), BLANK);
        var /** @type {?} */ splitValue = value.split(".");
        value = (splitValue.length > 1 && splitValue[1] && RegexValidator.isZero(splitValue[1])) ? splitValue[0] : value;
        return value;
    }
    /**
     * @param {?} value
     * @param {?} digitsInfo
     * @return {?}
     */
    transFormDecimal(value, digitsInfo) {
        return this.decimalPipe.transform(value, digitsInfo);
    }
}
DecimalProvider.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DecimalProvider.ctorParameters = () => [
    { type: DecimalPipe, },
];

class HtmlControlTemplateDirective {
    /**
     * @param {?} templateRef
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
    ;
}
HtmlControlTemplateDirective.decorators = [
    { type: Directive, args: [{
                selector: '[htmlControlTemplate]'
            },] },
];
/**
 * @nocollapse
 */
HtmlControlTemplateDirective.ctorParameters = () => [
    { type: TemplateRef, },
];
HtmlControlTemplateDirective.propDecorators = {
    'type': [{ type: Input, args: ['htmlControlTemplate',] },],
};

class RxwebDynamicFormComponent {
    /**
     * @return {?}
     */
    ngAfterContentInit() {
    }
}
RxwebDynamicFormComponent.decorators = [
    { type: Component, args: [{
                template: '',
                selector: 'rxweb-dynamic-form',
                exportAs: 'rxwebForm'
            },] },
];
/**
 * @nocollapse
 */
RxwebDynamicFormComponent.ctorParameters = () => [];
RxwebDynamicFormComponent.propDecorators = {
    'htmlControlTemplates': [{ type: ContentChildren, args: [HtmlControlTemplateDirective,] },],
};

class RxwebControlComponent {
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        if (this.dynamicForm && this.dynamicForm.htmlControlTemplates) {
            let /** @type {?} */ htmlControl = this.dynamicForm.htmlControlTemplates.filter(t => t.type == this.type)[0];
            if (htmlControl)
                this.control = htmlControl;
        }
    }
}
RxwebControlComponent.decorators = [
    { type: Component, args: [{
                template: `<ng-template [controlHost]="{templateRef:control.templateRef, data:data, $implicit: data}">
            </ng-template>`,
                selector: 'rxweb-control'
            },] },
];
/**
 * @nocollapse
 */
RxwebControlComponent.ctorParameters = () => [];
RxwebControlComponent.propDecorators = {
    'type': [{ type: Input },],
    'dynamicForm': [{ type: Input },],
    'data': [{ type: Input },],
};

class ControlHostDirective {
    /**
     * @param {?} viewContainerRef
     */
    constructor(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    set portal(context) {
        if (context.templateRef) {
            if (this.view) {
                this.view.destroy();
                this.view = undefined;
            }
            this.view = this.viewContainerRef.createEmbeddedView(context.templateRef, context);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.view)
            this.view.destroy();
        if (this.viewContainerRef)
            this.viewContainerRef.clear();
    }
}
ControlHostDirective.decorators = [
    { type: Directive, args: [{
                selector: '[controlHost]'
            },] },
];
/**
 * @nocollapse
 */
ControlHostDirective.ctorParameters = () => [
    { type: ViewContainerRef, },
];
ControlHostDirective.propDecorators = {
    'portal': [{ type: Input, args: ['controlHost',] },],
};

/**
 * @abstract
 */
class ControlExpressionProcess {
    constructor() {
        this.controlConfig = {};
        this.isProcessed = false;
    }
    /**
     * @param {?} control
     * @param {?} name
     * @return {?}
     */
    process(control, name) {
        let /** @type {?} */ validationRule = {};
        let /** @type {?} */ controls = control.parent.controls;
        Object.keys(controls).forEach(fieldName => {
            let /** @type {?} */ formControl = controls[fieldName];
            if (formControl.validatorConfig) {
                Object.keys(AnnotationTypes).forEach(validatorName => {
                    if (formControl.validatorConfig[validatorName] && formControl.validatorConfig[validatorName].conditionalExpression) {
                        let /** @type {?} */ columns = Linq.expressionColumns(formControl.validatorConfig[validatorName].conditionalExpression);
                        defaultContainer.addChangeValidation(validationRule, fieldName, columns);
                    }
                    if (formControl.validatorConfig[validatorName] && ((validatorName == AnnotationTypes.compare || validatorName == AnnotationTypes.greaterThan || validatorName == AnnotationTypes.greaterThanEqualTo || validatorName == AnnotationTypes.lessThan || validatorName == AnnotationTypes.lessThanEqualTo || validatorName == AnnotationTypes.different || validatorName == AnnotationTypes.factor) || (validatorName == AnnotationTypes.creditCard && formControl.validatorConfig[validatorName].fieldName))) {
                        defaultContainer.setConditionalValueProp(validationRule, formControl.validatorConfig[validatorName].fieldName, fieldName);
                    }
                });
            }
        });
        this.isProcessed = true;
        if (!this.conditionalValidator && validationRule.conditionalValidationProps && validationRule.conditionalValidationProps[name])
            this.conditionalValidator = conditionalChangeValidator(validationRule.conditionalValidationProps[name]);
    }
    /**
     * @param {?} control
     * @return {?}
     */
    setModelConfig(control) {
        if (this.controlConfig && this.controlConfig.validatorConfig) {
            control["validatorConfig"] = this.controlConfig.validatorConfig;
            this.controlConfig = undefined;
        }
    }
    /**
     * @param {?} control
     * @return {?}
     */
    expressionProcessor(control) {
        this.setModelConfig(control);
        if (this.formControlName) {
            if (!this.isProcessed && control.parent && !control.parent["model"]) {
                this.process(control, this.formControlName);
            }
        }
        else if (!this.isProcessed && this.name && control.parent && control.parent["marked"]) {
            this.process(control, this.name);
        }
    }
}
ControlExpressionProcess.propDecorators = {
    'name': [{ type: Input },],
    'formControlName': [{ type: Input },],
};

class BaseValidator extends ControlExpressionProcess {
    /**
     * @return {?}
     */
    setEventName() {
        var /** @type {?} */ eventName = '';
        switch (this.element.tagName) {
            case INPUT:
            case TEXTAREA:
                eventName = (this.element.type == CHECKBOX || this.element.type == RADIO || this.element.type == FILE) ? CHANGE : INPUT;
                break;
            case SELECT:
                eventName = CHANGE;
                break;
        }
        this.eventName = eventName.toLowerCase();
    }
    /**
     * @param {?} control
     * @return {?}
     */
    validate(control) {
        if (this.conditionalValidator)
            this.conditionalValidator(control);
        else if (!this.isProcessed && control.parent && !control.parent["model"])
            this.expressionProcessor(control);
        return this.validator ? this.validator(control) : null;
    }
}

const COMPOSE = 'compose';
const NGMODEL_BINDING = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => RxFormControlDirective),
    multi: true
};
const ALLOW_VALIDATOR_WITHOUT_CONFIG = ['required', 'alpha', 'alphaNumeric', 'ascii', 'dataUri', 'digit', 'email', 'even', 'hexColor', 'json', 'latitude', 'latLong', 'leapYear', 'longitude', 'lowerCase', 'mac', 'odd', 'port', 'primeNumber', 'time', 'upperCase', 'url'];
class RxFormControlDirective extends BaseValidator {
    /**
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} decimalProvider
     */
    constructor(elementRef, renderer, decimalProvider) {
        super();
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.decimalProvider = decimalProvider;
        this.eventListeners = [];
        this.element = elementRef.nativeElement;
        this.setEventName();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set validationControls(value) {
        this.controls = value;
    }
    /**
     * @return {?}
     */
    get validationControls() {
        return this.controls;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        let /** @type {?} */ validators = [];
        Object.keys(APP_VALIDATORS).forEach(validatorName => {
            if ((this[validatorName]) || (ALLOW_VALIDATOR_WITHOUT_CONFIG.indexOf(validatorName) != -1 && this[validatorName] == BLANK)) {
                validators.push(APP_VALIDATORS[validatorName](this[validatorName]));
                if (this.name && !(this.formControlName && this.formControl))
                    ApplicationUtil.configureControl(this.controlConfig, this[validatorName], validatorName);
            }
        });
        if (validators.length > 0)
            this.validator = APP_VALIDATORS[COMPOSE]({ validators: validators });
        if (this.numeric && this.numeric.isFormat)
            this.bindNumericElementEvent();
    }
    /**
     * @param {?=} config
     * @return {?}
     */
    bindNumericElementEvent(config) {
        if (config)
            this.numeric = config;
        let /** @type {?} */ listener = this.renderer.listen(this.element, BLUR, (event) => {
            if (!(this.formControl && this.formControl.errors && this.formControl.errors.numeric)) {
                let /** @type {?} */ value = this.decimalProvider.transFormDecimal(this.formControl.value, this.numeric.digitsInfo);
                this.setValueOnElement(value);
            }
        });
        this.eventListeners.push(listener);
        listener = this.renderer.listen(this.element, FOCUS, (event) => {
            if (!(this.formControl && this.formControl.errors && this.formControl.errors.numeric) && this.formControl.value != null) {
                let /** @type {?} */ value = this.decimalProvider.replacer(this.formControl.value);
                this.setValueOnElement(value);
            }
        });
        this.eventListeners.push(listener);
    }
    /**
     * @return {?}
     */
    bindValueChangeEvent() {
        if (this.eventName != BLANK) {
            let /** @type {?} */ listener = this.renderer.listen(this.element, this.eventName, () => {
                Object.keys(this.validationControls).forEach(fieldName => {
                    this.validationControls[fieldName].updateValueAndValidity();
                });
            });
            this.eventListeners.push(listener);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setValueOnElement(value) {
        this.renderer.setElementProperty(this.element, ELEMENT_VALUE, value);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.controls = undefined;
        let /** @type {?} */ eventCount = this.eventListeners.length;
        for (var /** @type {?} */ i = 0; i < eventCount; i++) {
            this.eventListeners[0]();
            this.eventListeners.splice(0, 1);
        }
        this.eventListeners = [];
    }
}
RxFormControlDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ngModel],[formControlName],[formControl]',
                providers: [NGMODEL_BINDING],
            },] },
];
/**
 * @nocollapse
 */
RxFormControlDirective.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer, },
    { type: DecimalProvider, },
];
RxFormControlDirective.propDecorators = {
    'allOf': [{ type: Input },],
    'alpha': [{ type: Input },],
    'alphaNumeric': [{ type: Input },],
    'ascii': [{ type: Input },],
    'choice': [{ type: Input },],
    'compare': [{ type: Input },],
    'compose': [{ type: Input },],
    'contains': [{ type: Input },],
    'creditCard': [{ type: Input },],
    'dataUri': [{ type: Input },],
    'different': [{ type: Input },],
    'digit': [{ type: Input },],
    'email': [{ type: Input },],
    'endsWith': [{ type: Input },],
    'even': [{ type: Input },],
    'extension': [{ type: Input },],
    'factor': [{ type: Input },],
    'fileSize': [{ type: Input },],
    'greaterThanEqualTo': [{ type: Input },],
    'greaterThan': [{ type: Input },],
    'hexColor': [{ type: Input },],
    'json': [{ type: Input },],
    'latitude': [{ type: Input },],
    'latLong': [{ type: Input },],
    'leapYear': [{ type: Input },],
    'lessThan': [{ type: Input },],
    'lessThanEqualTo': [{ type: Input },],
    'longitude': [{ type: Input },],
    'lowerCase': [{ type: Input },],
    'mac': [{ type: Input },],
    'maxDate': [{ type: Input },],
    'maxLength': [{ type: Input },],
    'maxNumber': [{ type: Input },],
    'minDate': [{ type: Input },],
    'minLength': [{ type: Input },],
    'minNumber': [{ type: Input },],
    'noneOf': [{ type: Input },],
    'numeric': [{ type: Input },],
    'odd': [{ type: Input },],
    'oneOf': [{ type: Input },],
    'password': [{ type: Input },],
    'pattern': [{ type: Input },],
    'port': [{ type: Input },],
    'primeNumber': [{ type: Input },],
    'required': [{ type: Input },],
    'range': [{ type: Input },],
    'rule': [{ type: Input },],
    'startsWith': [{ type: Input },],
    'time': [{ type: Input },],
    'upperCase': [{ type: Input },],
    'url': [{ type: Input },],
    'formControl': [{ type: Input },],
};

class FileControlDirective {
    constructor() {
        this.onChangeEvent = (value) => { };
        this.onBlurEvent = () => { };
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) { }
    /**
     * @param {?} eventFunction
     * @return {?}
     */
    registerOnChange(eventFunction) {
        this.onChangeEvent = eventFunction;
    }
    /**
     * @param {?} eventFunction
     * @return {?}
     */
    registerOnTouched(eventFunction) {
        this.onBlurEvent = eventFunction;
    }
}
FileControlDirective.decorators = [
    { type: Directive, args: [{
                selector: "input[type=file]",
                host: {
                    "(change)": "onChangeEvent($event.target.files)",
                    "(blur)": "onBlurEvent()"
                },
                providers: []
            },] },
];
/**
 * @nocollapse
 */
FileControlDirective.ctorParameters = () => [];

class RxReactiveFormsModule {
    /**
     * @return {?}
     */
    static forRoot() { return { ngModule: RxReactiveFormsModule, providers: [] }; }
}
RxReactiveFormsModule.decorators = [
    { type: NgModule, args: [{
                declarations: [RxwebFormDirective, RxwebDynamicFormComponent, HtmlControlTemplateDirective, RxwebControlComponent, ControlHostDirective, RxFormControlDirective, FileControlDirective],
                imports: [CommonModule, FormsModule, ReactiveFormsModule],
                providers: [RxFormBuilder, DecimalProvider, DecimalPipe],
                exports: [RxwebFormDirective, RxwebDynamicFormComponent, HtmlControlTemplateDirective, RxwebControlComponent, RxFormControlDirective, FileControlDirective]
            },] },
];
/**
 * @nocollapse
 */
RxReactiveFormsModule.ctorParameters = () => [];

/**
 * @param {?=} config
 * @return {?}
 */
function alpha(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.alpha, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function alphaNumeric(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.alphaNumeric, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function compare(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.compare, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function contains(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.contains, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function creditCard(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.creditCard, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function digit(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.digit, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function email(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.email, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function hexColor(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.hexColor, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function lowerCase(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.lowerCase, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function maxDate(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.maxDate, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function maxLength(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.maxLength, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function minDate(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.minDate, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function maxNumber(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.maxNumber, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function minLength(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.minLength, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function minNumber(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.minNumber, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function password(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.password, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function pattern(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.pattern, config);
    };
}

/**
 * @template T
 * @param {?} entity
 * @return {?}
 */
function propArray(entity) {
    return function (target, propertyKey, parameterIndex) {
        var /** @type {?} */ propertyInfo = {
            name: propertyKey,
            propertyType: ARRAY_PROPERTY,
            entity: entity
        };
        defaultContainer.addProperty(target.constructor, propertyInfo);
    };
}

/**
 * @template T
 * @param {?} entity
 * @return {?}
 */
function propObject(entity) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.initPropertyObject(propertyKey, OBJECT_PROPERTY, entity, target);
    };
}

/**
 * @return {?}
 */
function prop() {
    return function (target, propertyKey, parameterIndex) {
        var /** @type {?} */ propertyInfo = {
            name: propertyKey,
            propertyType: PROPERTY
        };
        defaultContainer.addProperty(target.constructor, propertyInfo);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function range(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.range, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function required(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.required, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function upperCase(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.upperCase, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function time(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.time, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function url(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.url, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function json(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.json, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function greaterThan(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.greaterThan, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function greaterThanEqualTo(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.greaterThanEqualTo, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function lessThanEqualTo(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.lessThanEqualTo, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function lessThan(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.lessThan, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function choice(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.choice, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function different(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.different, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function numeric(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.numeric, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function even(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.even, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function odd(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.odd, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function factor(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.factor, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function leapYear(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.leapYear, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function allOf(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.allOf, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function oneOf(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.oneOf, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function noneOf(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.noneOf, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function mac(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.mac, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function ascii(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.ascii, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function dataUri(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.dataUri, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function port(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.port, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function latLong(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.latLong, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function extension(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.extension, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function fileSize(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.fileSize, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function endsWith(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.endsWith, config);
    };
}

/**
 * @param {?} config
 * @return {?}
 */
function startsWith(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.startsWith, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function primeNumber(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.primeNumber, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function latitude(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.latitude, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function longitude(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.longitude, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function rule(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.rule, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function file(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.file, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function custom(config) {
    return function (target, propertyKey, parameterIndex) {
        defaultContainer.init(target, parameterIndex, propertyKey, AnnotationTypes.custom, config);
    };
}

/**
 * @param {?=} config
 * @return {?}
 */
function alphaValidatorExtension(config) {
    var /** @type {?} */ validator = alphaValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.alpha, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.alpha), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function allOfValidatorExtension(config) {
    var /** @type {?} */ validator = allOfValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.allOf, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.allOf), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function alphaNumericValidatorExtension(config) {
    var /** @type {?} */ validator = alphaNumericValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.alphaNumeric, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.alphaNumeric), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function choiceValidatorExtension(config) {
    var /** @type {?} */ validator = choiceValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.choice, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.choice), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function compareValidatorExtension(config) {
    var /** @type {?} */ validator = compareValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.compare, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.compare), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function containsValidatorExtension(config) {
    var /** @type {?} */ validator = containsValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.contains, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.contains), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function creditCardValidatorExtension(config) {
    var /** @type {?} */ validator = creditCardValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.creditCard, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.creditCard), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function differentValidatorExtension(config) {
    var /** @type {?} */ validator = differentValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.different, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.different), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function digitValidatorExtension(config) {
    var /** @type {?} */ validator = digitValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.digit, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.digit), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function emailValidatorExtension(config) {
    var /** @type {?} */ validator = emailValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.email, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.email), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function evenValidatorExtension(config) {
    var /** @type {?} */ validator = evenValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.even, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.even), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function factorValidatorExtension(config) {
    var /** @type {?} */ validator = factorValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.factor, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.factor), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function greaterThanEqualToValidatorExtension(config) {
    var /** @type {?} */ validator = greaterThanEqualToValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.greaterThanEqualTo, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.greaterThanEqualTo), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function greaterThanValidatorExtension(config) {
    var /** @type {?} */ validator = greaterThanValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.greaterThan, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.greaterThan), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function hexColorValidatorExtension(config) {
    var /** @type {?} */ validator = hexColorValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.hexColor, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.hexColor), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function jsonValidatorExtension(config) {
    var /** @type {?} */ validator = jsonValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.json, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.json), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function leapYearValidatorExtension(config) {
    var /** @type {?} */ validator = leapYearValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.leapYear, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.leapYear), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function lessThanEqualToValidatorExtension(config) {
    var /** @type {?} */ validator = lessThanEqualToValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.lessThanEqualTo, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.lessThanEqualTo), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function lessThanValidatorExtension(config) {
    var /** @type {?} */ validator = lessThanValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.lessThan, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.lessThan), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function lowerCaseValidatorExtension(config) {
    var /** @type {?} */ validator = lowercaseValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.lowerCase, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.lowerCase), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function macValidatorExtension(config) {
    var /** @type {?} */ validator = macValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.mac, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.mac), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function maxDateValidatorExtension(config) {
    var /** @type {?} */ validator = maxDateValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.maxDate, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.maxDate), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function maxLengthValidatorExtension(config) {
    var /** @type {?} */ validator = maxLengthValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.maxLength, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.maxLength), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function maxNumberValidatorExtension(config) {
    var /** @type {?} */ validator = maxNumberValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.maxNumber, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.maxNumber), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function minDateValidatorExtension(config) {
    var /** @type {?} */ validator = minDateValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.minDate, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.minDate), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function minLengthValidatorExtension(config) {
    var /** @type {?} */ validator = minLengthValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.minLength, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.minLength), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function minNumberValidatorExtension(config) {
    var /** @type {?} */ validator = minNumberValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.minNumber, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.minNumber), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function noneOfValidatorExtension(config) {
    var /** @type {?} */ validator = noneOfValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.noneOf, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.noneOf), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function numericValidatorExtension(config) {
    var /** @type {?} */ validator = numericValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.numeric, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.numeric), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function oddValidatorExtension(config) {
    var /** @type {?} */ validator = oddValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.odd, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.odd), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function oneOfValidatorExtension(config) {
    var /** @type {?} */ validator = oneOfValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.oneOf, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.oneOf), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function passwordcValidatorExtension(config) {
    var /** @type {?} */ validator = passwordValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.password, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.password), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function patternValidatorExtension(config) {
    var /** @type {?} */ validator = patternValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.pattern, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.pattern), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function rangeValidatorExtension(config) {
    var /** @type {?} */ validator = rangeValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.range, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.range), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function requiredValidatorExtension(config) {
    var /** @type {?} */ validator = requiredValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.required, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.required), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function timeValidatorExtension(config) {
    var /** @type {?} */ validator = timeValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.time, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.time), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function upperCaseValidatorExtension(config) {
    var /** @type {?} */ validator = uppercaseValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.upperCase, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.upperCase), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function urlValidatorExtension(config) {
    var /** @type {?} */ validator = urlValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.url, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.url), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function asciiValidatorExtension(config) {
    var /** @type {?} */ validator = asciiValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.ascii, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.ascii), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function dataUriValidatorExtension(config) {
    var /** @type {?} */ validator = dataUriValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.dataUri, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.dataUri), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function portValidatorExtension(config) {
    var /** @type {?} */ validator = portValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.port, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.port), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function latLongValidatorExtension(config) {
    var /** @type {?} */ validator = latLongValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.latLong, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.latLong), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?} config
 * @return {?}
 */
function extensionValidatorExtension(config) {
    var /** @type {?} */ validator = extensionValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.extension, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.extension), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?} config
 * @return {?}
 */
function fileSizeValidatorExtension(config) {
    var /** @type {?} */ validator = fileSizeValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.fileSize, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.fileSize), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?} config
 * @return {?}
 */
function endsWithValidatorExtension(config) {
    var /** @type {?} */ validator = endsWithValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.endsWith, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.endsWith), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?} config
 * @return {?}
 */
function startsWithValidatorExtension(config) {
    var /** @type {?} */ validator = startsWithValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.startsWithWith, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.startsWithWith), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function primeNumberValidatorExtension(config) {
    var /** @type {?} */ validator = primeNumberValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.primeNumber, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.primeNumber), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function latitudeValidatorExtension(config) {
    var /** @type {?} */ validator = latitudeValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.latitude, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.latitude), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function longitudeValidatorExtension(config) {
    var /** @type {?} */ validator = longitudeValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.longitude, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.longitude), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function composeValidatorExtension(config) {
    var /** @type {?} */ validator = composeValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.compose, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.compose), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?} config
 * @return {?}
 */
function fileValidatorExtension(config) {
    var /** @type {?} */ validator = fileValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.file, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.file), validator(control);
        return null;
    };
    return rxwebValidator;
}

/**
 * @param {?=} config
 * @return {?}
 */
function customValidatorExtension(config) {
    var /** @type {?} */ validator = customValidator(config);
    var /** @type {?} */ rxwebValidator = (control, target) => {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.custom, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.custom), validator(control);
        return null;
    };
    return rxwebValidator;
}

class RxwebValidators {
}
RxwebValidators.alpha = alphaValidatorExtension;
RxwebValidators.allOf = allOfValidatorExtension;
RxwebValidators.alphaNumeric = alphaNumericValidatorExtension;
RxwebValidators.choice = choiceValidatorExtension;
RxwebValidators.compare = compareValidatorExtension;
RxwebValidators.contains = containsValidatorExtension;
RxwebValidators.creditCard = creditCardValidatorExtension;
RxwebValidators.different = differentValidatorExtension;
RxwebValidators.digit = digitValidatorExtension;
RxwebValidators.email = emailValidatorExtension;
RxwebValidators.even = evenValidatorExtension;
RxwebValidators.factor = factorValidatorExtension;
RxwebValidators.greaterThanEqualTo = greaterThanEqualToValidatorExtension;
RxwebValidators.greaterThan = greaterThanValidatorExtension;
RxwebValidators.hexColor = hexColorValidatorExtension;
RxwebValidators.json = jsonValidatorExtension;
RxwebValidators.leapYear = leapYearValidatorExtension;
RxwebValidators.lessThanEqualTo = lessThanEqualToValidatorExtension;
RxwebValidators.lessThan = lessThanValidatorExtension;
RxwebValidators.lowerCase = lowerCaseValidatorExtension;
RxwebValidators.mac = macValidatorExtension;
RxwebValidators.maxDate = maxDateValidatorExtension;
RxwebValidators.maxLength = maxLengthValidatorExtension;
RxwebValidators.maxNumber = maxNumberValidatorExtension;
RxwebValidators.minDate = minDateValidatorExtension;
RxwebValidators.minLength = minLengthValidatorExtension;
RxwebValidators.minNumber = minNumberValidatorExtension;
RxwebValidators.noneOf = noneOfValidatorExtension;
RxwebValidators.numeric = numericValidatorExtension;
RxwebValidators.odd = oddValidatorExtension;
RxwebValidators.oneOf = oneOfValidatorExtension;
RxwebValidators.password = passwordcValidatorExtension;
RxwebValidators.pattern = patternValidatorExtension;
RxwebValidators.range = rangeValidatorExtension;
RxwebValidators.required = requiredValidatorExtension;
RxwebValidators.time = timeValidatorExtension;
RxwebValidators.upperCase = upperCaseValidatorExtension;
RxwebValidators.url = urlValidatorExtension;
RxwebValidators.ascii = asciiValidatorExtension;
RxwebValidators.dataUri = dataUriValidatorExtension;
RxwebValidators.port = portValidatorExtension;
RxwebValidators.latLong = latLongValidatorExtension;
RxwebValidators.extension = extensionValidatorExtension;
RxwebValidators.fileSize = fileSizeValidatorExtension;
RxwebValidators.endsWith = endsWithValidatorExtension;
RxwebValidators.startsWith = startsWithValidatorExtension;
RxwebValidators.primeNumber = primeNumberValidatorExtension;
RxwebValidators.latitude = latitudeValidatorExtension;
RxwebValidators.longitude = longitudeValidatorExtension;
RxwebValidators.compose = composeValidatorExtension;
RxwebValidators.file = fileValidatorExtension;
RxwebValidators.custom = customValidatorExtension;

/**
 * Generated bundle index. Do not edit.
 */

export { RxReactiveFormsModule, RxFormBuilder, FormBuilderConfiguration, alpha, alphaNumeric, compare, contains, creditCard, digit, email, hexColor, lowerCase, maxDate, maxLength, minDate, maxNumber, minLength, minNumber, password, pattern, propArray, propObject, prop, range, required, upperCase, time, url, json, greaterThan, greaterThanEqualTo, lessThanEqualTo, lessThan, choice, different, numeric, even, odd, factor, leapYear, allOf, oneOf, noneOf, mac, ascii, dataUri, port, latLong, extension, fileSize, endsWith, startsWith, primeNumber, latitude, longitude, rule, file, custom, ReactiveFormConfig, NumericValueType, RxFormControl, RxFormGroup, RxwebValidators, RxwebDynamicFormComponent as ɵc, RxwebControlComponent as ɵe, BaseDirective as ɵb, ControlHostDirective as ɵf, HtmlControlTemplateDirective as ɵd, RxwebFormDirective as ɵa, BaseValidator as ɵh, ControlExpressionProcess as ɵi, FileControlDirective as ɵk, RxFormControlDirective as ɵg, DecimalProvider as ɵj, BaseFormBuilder as ɵl };
//# sourceMappingURL=reactive-form-validators.js.map

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/forms'], factory) :
	(factory((global['reactive-form-validators'] = {}),global.ng.core,global.ng.common,global.ng.forms));
}(this, (function (exports,core,common,forms) { 'use strict';

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Linq = /** @class */ (function () {
    function Linq() {
    }
    /**
     * @param {?} expression
     * @return {?}
     */
    Linq.functionCreator = function (expression) {
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
    };
    /**
     * @param {?} jObject
     * @param {?} expression
     * @param {?} parentObject
     * @return {?}
     */
    Linq.IsPassed = function (jObject, expression, parentObject) {
        var /** @type {?} */ expressionFunction = expression;
        if (parentObject && typeof expression == "string")
            expressionFunction = Linq.functionCreator(expression);
        if (parentObject && expressionFunction)
            return expressionFunction(parentObject, jObject);
        return true;
    };
    /**
     * @param {?} expression
     * @return {?}
     */
    Linq.expressionParser = function (expression) {
        var /** @type {?} */ columns = [];
        var /** @type {?} */ expressionString = expression.toString();
        var /** @type {?} */ expressionArguments = Linq.extractArguments(expressionString.match(/\(([^)]+)\)/g));
        if (expressionArguments.length > 0) {
            var /** @type {?} */ splitTexts = expressionString.replace(/\s/g, '').replace(new RegExp(/{|}/, "g"), "").split(new RegExp(/return|===|!==|==|!=|>=|>|<=|<|&&/));
            splitTexts.forEach(function (t) {
                expressionArguments.forEach(function (x) {
                    t = t.trim();
                    if (t.startsWith(x + '.')) {
                        var /** @type {?} */ splitText = t.split('.');
                        if (splitText.length == 2)
                            columns.push({ propName: splitText[1].trim() });
                        else {
                            var /** @type {?} */ arrayProp = splitText[1].split('[');
                            var /** @type {?} */ jObject = {
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
    };
    /**
     * @param {?} splitTexts
     * @return {?}
     */
    Linq.extractArguments = function (splitTexts) {
        var /** @type {?} */ expressionArguments = [];
        splitTexts[0].split(",").forEach(function (t) { return expressionArguments.push(t.trim().replace("(", "").replace(")", "")); });
        return expressionArguments;
    };
    /**
     * @param {?} expression
     * @return {?}
     */
    Linq.expressionColumns = function (expression) {
        var /** @type {?} */ columns = [];
        var /** @type {?} */ splitExpressions = [];
        if (typeof expression == "string") {
            expression.split("=>")[1].split(" && ").forEach(function (t) {
                t.split(" || ").forEach(function (x) {
                    splitExpressions.push(x.trim().split(' ')[0]);
                });
            });
            splitExpressions.forEach(function (t) {
                var /** @type {?} */ splitText = t.split('.');
                if (splitText.length == 2)
                    columns.push({ propName: splitText[1].trim() });
                else {
                    var /** @type {?} */ arrayProp = splitText[1].split('[');
                    var /** @type {?} */ jObject = {
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
    };
    return Linq;
}());
var AnnotationTypes = {
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
var PROPERTY = "property";
var OBJECT_PROPERTY = "objectProperty";
var ARRAY_PROPERTY = "arrayProperty";
var STRING = "string";
var MESSAGE = "message";
var BLANK = "";
var ELEMENT_VALUE = "value";
var BLUR = "blur";
var FOCUS = "focus";
var CHANGE = "change";
var INPUT = "INPUT";
var SELECT = "SELECT";
var CHECKBOX = "checkbox";
var RADIO = "radio";
var FILE = "file";
var TEXTAREA = "textarea";
var CONTROLS_ERROR = "controlsError";
var VALUE_CHANGED_SYNC = "valueChangedSync";
var FUNCTION_STRING = "function";
var OBJECT_STRING = "object";
var RX_WEB_VALIDATOR = "rxwebValidator";
var NUMBER = "number";
var BOOLEAN = "boolean";
var defaultContainer = new (/** @class */ (function () {
    function class_1() {
        this.instances = [];
        this.modelIncrementCount = 0;
    }
    /**
     * @template T
     * @param {?} instanceFunc
     * @return {?}
     */
    class_1.prototype.get = function (instanceFunc) {
        var /** @type {?} */ instance = this.instances.filter(function (instance) { return instance.instance === instanceFunc; })[0];
        return instance;
    };
    /**
     * @param {?} target
     * @param {?} parameterIndex
     * @param {?} propertyKey
     * @param {?} annotationType
     * @param {?} config
     * @return {?}
     */
    class_1.prototype.init = function (target, parameterIndex, propertyKey, annotationType, config) {
        var /** @type {?} */ decoratorConfiguration = {
            propertyIndex: parameterIndex,
            propertyName: propertyKey,
            annotationType: annotationType,
            config: config
        };
        var /** @type {?} */ isPropertyKey = (propertyKey != undefined);
        this.addAnnotation(!isPropertyKey ? target : target.constructor, decoratorConfiguration);
    };
    /**
     * @param {?} name
     * @param {?} propertyType
     * @param {?} entity
     * @param {?} target
     * @return {?}
     */
    class_1.prototype.initPropertyObject = function (name, propertyType, entity, target) {
        var /** @type {?} */ propertyInfo = {
            name: name,
            propertyType: propertyType,
            entity: entity
        };
        defaultContainer.addProperty(target.constructor, propertyInfo);
    };
    /**
     * @param {?} instanceFunc
     * @return {?}
     */
    class_1.prototype.addInstanceContainer = function (instanceFunc) {
        var /** @type {?} */ instanceContainer = {
            instance: instanceFunc,
            propertyAnnotations: [],
            properties: []
        };
        this.instances.push(instanceContainer);
        return instanceContainer;
    };
    /**
     * @param {?} instanceFunc
     * @param {?} propertyInfo
     * @return {?}
     */
    class_1.prototype.addProperty = function (instanceFunc, propertyInfo) {
        var /** @type {?} */ instance = this.instances.filter(function (instance) { return instance.instance === instanceFunc; })[0];
        if (instance) {
            this.addPropertyInfo(instance, propertyInfo);
        }
        else {
            instance = this.addInstanceContainer(instanceFunc);
            this.addPropertyInfo(instance, propertyInfo);
        }
    };
    /**
     * @param {?} instance
     * @param {?} propertyInfo
     * @return {?}
     */
    class_1.prototype.addPropertyInfo = function (instance, propertyInfo) {
        var /** @type {?} */ property = instance.properties.filter(function (t) { return t.name == propertyInfo.name; })[0];
        if (!property)
            instance.properties.push(propertyInfo);
    };
    /**
     * @param {?} instanceFunc
     * @param {?} decoratorConfiguration
     * @return {?}
     */
    class_1.prototype.addAnnotation = function (instanceFunc, decoratorConfiguration) {
        this.addProperty(instanceFunc, { propertyType: PROPERTY, name: decoratorConfiguration.propertyName });
        var /** @type {?} */ instance = this.instances.filter(function (instance) { return instance.instance === instanceFunc; })[0];
        if (instance)
            instance.propertyAnnotations.push(decoratorConfiguration);
        else {
            instance = this.addInstanceContainer(instanceFunc);
            instance.propertyAnnotations.push(decoratorConfiguration);
        }
        if (decoratorConfiguration.config && decoratorConfiguration.config.conditionalExpression) {
            var /** @type {?} */ columns = Linq.expressionColumns(decoratorConfiguration.config.conditionalExpression);
            this.addChangeValidation(instance, decoratorConfiguration.propertyName, columns);
        }
        if (instance && decoratorConfiguration.config && ((decoratorConfiguration.annotationType == AnnotationTypes.compare || decoratorConfiguration.annotationType == AnnotationTypes.greaterThan || decoratorConfiguration.annotationType == AnnotationTypes.greaterThanEqualTo || decoratorConfiguration.annotationType == AnnotationTypes.lessThan || decoratorConfiguration.annotationType == AnnotationTypes.lessThanEqualTo || decoratorConfiguration.annotationType == AnnotationTypes.different || decoratorConfiguration.annotationType == AnnotationTypes.factor) || (decoratorConfiguration.annotationType == AnnotationTypes.creditCard && decoratorConfiguration.config.fieldName))) {
            this.setConditionalValueProp(instance, decoratorConfiguration.config.fieldName, decoratorConfiguration.propertyName);
        }
    };
    /**
     * @param {?} instance
     * @param {?} propName
     * @param {?} refPropName
     * @return {?}
     */
    class_1.prototype.setConditionalValueProp = function (instance, propName, refPropName) {
        if (!instance.conditionalValidationProps)
            instance.conditionalValidationProps = {};
        if (!instance.conditionalValidationProps[propName])
            instance.conditionalValidationProps[propName] = [];
        if (instance.conditionalValidationProps[propName].indexOf(refPropName) == -1)
            instance.conditionalValidationProps[propName].push(refPropName);
    };
    /**
     * @param {?} instance
     * @param {?} propertyName
     * @param {?} columns
     * @return {?}
     */
    class_1.prototype.addChangeValidation = function (instance, propertyName, columns) {
        if (instance) {
            if (!instance.conditionalValidationProps)
                instance.conditionalValidationProps = {};
            columns.forEach(function (t) {
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
    };
    /**
     * @param {?} instanceFunc
     * @return {?}
     */
    class_1.prototype.clearInstance = function (instanceFunc) {
        var /** @type {?} */ instance = this.instances.filter(function (instance) { return instance.instance === instanceFunc; })[0];
        if (instance) {
            var /** @type {?} */ indexOf = this.instances.indexOf(instance);
            this.instances.splice(indexOf, 1);
        }
    };
    return class_1;
}()))();
var BaseFormBuilder = /** @class */ (function () {
    function BaseFormBuilder() {
    }
    /**
     * @return {?}
     */
    BaseFormBuilder.prototype.createInstance = function () {
        var /** @type {?} */ instance = {};
        defaultContainer.modelIncrementCount = defaultContainer.modelIncrementCount + 1;
        var /** @type {?} */ modelName = "RxWebModel" + defaultContainer.modelIncrementCount;
        instance.constructor = Function("\"use strict\";return(function " + modelName + "(){ })")();
        return instance;
    };
    /**
     * @param {?} model
     * @param {?} formBuilderConfiguration
     * @param {?=} classInstance
     * @return {?}
     */
    BaseFormBuilder.prototype.createClassObject = function (model, formBuilderConfiguration, classInstance) {
        var _this = this;
        var /** @type {?} */ instanceContainer = defaultContainer.get(model);
        var /** @type {?} */ autoInstanceConfig = formBuilderConfiguration ? formBuilderConfiguration.autoInstanceConfig : undefined;
        if (!autoInstanceConfig) {
            return classInstance && typeof classInstance != "function" ? classInstance : this.getInstance(model, []);
        }
        else {
            classInstance = classInstance && typeof classInstance != "function" ? classInstance : this.getInstance(model, autoInstanceConfig.arguments || []);
            if (autoInstanceConfig.objectPropInstanceConfig && autoInstanceConfig.objectPropInstanceConfig.length > 0) {
                autoInstanceConfig.objectPropInstanceConfig.forEach(function (t) {
                    var /** @type {?} */ objectProperty = instanceContainer.properties.filter(function (property) { return property.name == t.propertyName && property.propertyType == OBJECT_PROPERTY; })[0];
                    if (objectProperty)
                        classInstance[t.propertyName] = _this.getInstance(objectProperty.entity, t.arguments || []);
                });
            }
            if (autoInstanceConfig.arrayPropInstanceConfig && autoInstanceConfig.arrayPropInstanceConfig.length > 0) {
                autoInstanceConfig.arrayPropInstanceConfig.forEach(function (t) {
                    var /** @type {?} */ property = instanceContainer.properties.filter(function (property) { return property.name == t.propertyName && property.propertyType == ARRAY_PROPERTY; })[0];
                    if (property) {
                        classInstance[t.propertyName] = [];
                        for (var /** @type {?} */ i = 0; i < t.rowItems; i++) {
                            classInstance[t.propertyName].push(_this.getInstance(property.entity, t.arguments || []));
                        }
                    }
                });
            }
            return classInstance;
        }
    };
    /**
     * @param {?} model
     * @param {?} entityObject
     * @return {?}
     */
    BaseFormBuilder.prototype.updateObject = function (model, entityObject) {
        var _this = this;
        var /** @type {?} */ instanceContainer = defaultContainer.get(model);
        var /** @type {?} */ classInstance = this.getInstance(model, []);
        if (instanceContainer) {
            instanceContainer.properties.forEach(function (t) {
                switch (t.propertyType) {
                    case PROPERTY:
                        classInstance[t.name] = entityObject[t.name];
                        break;
                    case OBJECT_PROPERTY:
                        if (entityObject[t.name])
                            classInstance[t.name] = _this.updateObject(t.entity, entityObject[t.name]);
                        break;
                    case ARRAY_PROPERTY:
                        if (entityObject[t.name] && Array.isArray(entityObject[t.name])) {
                            classInstance[t.name] = [];
                            for (var _i = 0, _a = entityObject[t.name]; _i < _a.length; _i++) {
                                var row = _a[_i];
                                var /** @type {?} */ instanceObject = _this.updateObject(t.entity, row);
                                classInstance[t.name].push(instanceObject);
                            }
                        }
                        break;
                }
            });
        }
        return classInstance;
    };
    /**
     * @param {?} model
     * @param {?} objectArguments
     * @return {?}
     */
    BaseFormBuilder.prototype.getInstance = function (model, objectArguments) {
        var /** @type {?} */ classInstance = Object.create(model.prototype);
        model.apply(classInstance, objectArguments);
        return classInstance;
    };
    return BaseFormBuilder;
}());
var FormBuilderConfiguration = /** @class */ (function () {
    /**
     * @param {?=} formBuilderConfiguration
     */
    function FormBuilderConfiguration(formBuilderConfiguration) {
        if (formBuilderConfiguration)
            for (var column in formBuilderConfiguration)
                this[column] = formBuilderConfiguration[column];
    }
    return FormBuilderConfiguration;
}());
var ReactiveFormConfig = /** @class */ (function () {
    function ReactiveFormConfig() {
    }
    /**
     * @param {?} jObject
     * @return {?}
     */
    ReactiveFormConfig.set = function (jObject) {
        if (jObject)
            ReactiveFormConfig.json = jObject;
    };
    return ReactiveFormConfig;
}());
ReactiveFormConfig.json = {};
var ObjectMaker = /** @class */ (function () {
    function ObjectMaker() {
    }
    /**
     * @param {?} key
     * @param {?} message
     * @param {?} values
     * @return {?}
     */
    ObjectMaker.toJson = function (key, message, values) {
        var /** @type {?} */ messageText = (message) ? message : (ReactiveFormConfig && ReactiveFormConfig.json && ReactiveFormConfig.json.validationMessage && ReactiveFormConfig.json.validationMessage[key]) ? ReactiveFormConfig.json.validationMessage[key] : '';
        values.forEach(function (t, index) {
            messageText = messageText.replace("{{" + index + "}}", t);
        });
        var /** @type {?} */ jObject = {};
        jObject[key] = {
            message: messageText, refValues: values
        };
        return jObject;
    };
    /**
     * @return {?}
     */
    ObjectMaker.null = function () {
        return null;
    };
    return ObjectMaker;
}());
/**
 * @param {?} conditionalValidationProps
 * @return {?}
 */
function conditionalChangeValidator(conditionalValidationProps) {
    var /** @type {?} */ oldValue = undefined;
    var /** @type {?} */ setTimeOut = function (control) {
        var /** @type {?} */ timeOut = window.setTimeout(function (t) {
            window.clearTimeout(timeOut);
            control.updateValueAndValidity();
        }, 100);
    };
    return function (control) {
        var /** @type {?} */ parentFormGroup = control.parent;
        var /** @type {?} */ value = control.value;
        if (parentFormGroup && oldValue != value) {
            oldValue = value;
            conditionalValidationProps.forEach(function (t) {
                if (t.indexOf("[]") != -1) {
                    var /** @type {?} */ splitText = t.split("[]");
                    var /** @type {?} */ formArray = (parentFormGroup.get([splitText[0]]));
                    if (formArray)
                        formArray.controls.forEach(function (formGroup) {
                            var /** @type {?} */ abstractControl = formGroup.get(splitText[1]);
                            if (abstractControl) {
                                setTimeOut(abstractControl);
                            }
                        });
                }
                else {
                    var /** @type {?} */ control = null;
                    t.split('.').forEach(function (name, index) { control = (index == 0) ? parentFormGroup.controls[name] : control.controls[name]; });
                    if (control) {
                        setTimeOut(control);
                    }
                }
            });
        }
        return ObjectMaker.null();
    };
}
var CreditCardRegex = /** @class */ (function () {
    function CreditCardRegex() {
        this.Visa = new RegExp('^(?:4[0-9]{12})(?:[0-9]{3})?$');
        this.AmericanExpress = new RegExp('^(?:3[47][0-9]{13})$');
        this.Maestro = new RegExp('^(?:(?:5[0678]\\d\\d|6304|6390|67\\d\\d)\\d{8,15})$');
        this.JCB = new RegExp('^(?:(?:2131|1800|35\\d{3})\\d{11})$');
        this.Discover = new RegExp('^(?:6(?:011|5[0-9]{2})(?:[0-9]{12}))$');
        this.DinersClub = new RegExp('^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$');
        this.MasterCard = new RegExp('^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$');
    }
    return CreditCardRegex;
}());
var RegExRule = {
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
var ALPHABET = "alphabet";
var DIGIT = "digit";
var CONTAINS = "contains";
var LOWERCASE = "lowerCase";
var UPPERCASE = "upperCase";
var SPECIAL_CHARACTER = "specialCharacter";
var MIN_LENGTH = "minLength";
var MAX_LENGTH = "maxLength";
var RegexValidator = /** @class */ (function () {
    function RegexValidator() {
    }
    /**
     * @param {?} value
     * @param {?} regex
     * @return {?}
     */
    RegexValidator.isExits = function (value, regex) {
        return value.match(regex) != null;
    };
    /**
     * @param {?} value
     * @param {?} regex
     * @return {?}
     */
    RegexValidator.isValid = function (value, regex) {
        return regex.test(value);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    RegexValidator.isNotBlank = function (value) {
        return value != undefined && value != "" && value != null;
    };
    /**
     * @param {?} passwordValidation
     * @param {?} value
     * @return {?}
     */
    RegexValidator.isValidPassword = function (passwordValidation, value) {
        var /** @type {?} */ isValid = false;
        var /** @type {?} */ keyName = "status";
        var /** @type {?} */ objectProperties = Object.getOwnPropertyNames(passwordValidation);
        for (var _i = 0, objectProperties_1 = objectProperties; _i < objectProperties_1.length; _i++) {
            var propertyName = objectProperties_1[_i];
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
    };
    /**
     * @param {?} value
     * @return {?}
     */
    RegexValidator.isZero = function (value) {
        return value == 0;
    };
    /**
     * @return {?}
     */
    RegexValidator.commaRegex = function () {
        return new RegExp(",", "g");
    };
    return RegexValidator;
}());
var NumericValueType = {};
NumericValueType.PositiveNumber = 1;
NumericValueType.NegativeNumber = 2;
NumericValueType.Both = 3;
NumericValueType[NumericValueType.PositiveNumber] = "PositiveNumber";
NumericValueType[NumericValueType.NegativeNumber] = "NegativeNumber";
NumericValueType[NumericValueType.Both] = "Both";
var ApplicationUtil = /** @class */ (function () {
    function ApplicationUtil() {
    }
    /**
     * @param {?} control
     * @return {?}
     */
    ApplicationUtil.getParentObjectValue = function (control) {
        if (control.parent) {
            var /** @type {?} */ parent = this.parentObjectValue(control.parent);
            return parent.value;
        }
        return {};
    };
    /**
     * @param {?} control
     * @return {?}
     */
    ApplicationUtil.getParentControl = function (control) {
        if (control.parent) {
            var /** @type {?} */ parent = this.parentObjectValue(control.parent);
            return parent;
        }
        return control;
    };
    /**
     * @param {?} fieldName
     * @param {?} control
     * @return {?}
     */
    ApplicationUtil.getFormControl = function (fieldName, control) {
        var /** @type {?} */ splitText = fieldName.split('.');
        if (splitText.length > 1 && control.parent) {
            var /** @type {?} */ formControl = this.getParentControl(control);
            splitText.forEach(function (name, index) { formControl = formControl.controls[name]; });
            return formControl;
        }
        return (control.parent) ? control.parent.get([fieldName]) : undefined;
    };
    /**
     * @param {?} control
     * @return {?}
     */
    ApplicationUtil.parentObjectValue = function (control) {
        if (!control.parent)
            return control;
        else
            control = this.parentObjectValue(control.parent);
        return control;
    };
    /**
     * @param {?} config
     * @return {?}
     */
    ApplicationUtil.getConfigObject = function (config) {
        return (config != undefined && config != true) ? config : {};
    };
    /**
     * @param {?} value
     * @return {?}
     */
    ApplicationUtil.isNumeric = function (value) {
        return (value - parseFloat(value) + 1) >= 0;
    };
    /**
     * @param {?} primaryValue
     * @param {?} secondaryValue
     * @return {?}
     */
    ApplicationUtil.notEqualTo = function (primaryValue, secondaryValue) {
        var /** @type {?} */ firstValue = (primaryValue == undefined || primaryValue == null) ? "" : primaryValue;
        var /** @type {?} */ secondValue = (secondaryValue == undefined || secondaryValue == null) ? "" : secondaryValue;
        return (firstValue != secondValue);
    };
    /**
     * @param {?} allowDecimal
     * @param {?} acceptValue
     * @return {?}
     */
    ApplicationUtil.numericValidation = function (allowDecimal, acceptValue) {
        acceptValue = (acceptValue == undefined) ? NumericValueType.PositiveNumber : acceptValue;
        var /** @type {?} */ regex = /^[0-9]+$/;
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
    };
    /**
     * @param {?} control
     * @param {?} config
     * @param {?} type
     * @return {?}
     */
    ApplicationUtil.configureControl = function (control, config, type) {
        if (config) {
            if (!control.validatorConfig) {
                var /** @type {?} */ jObject = {};
                jObject[type] = config;
                Object.assign(control, { validatorConfig: jObject });
            }
            else
                control.validatorConfig[type] = config;
        }
    };
    return ApplicationUtil;
}());
var FormProvider = /** @class */ (function () {
    function FormProvider() {
    }
    /**
     * @param {?} control
     * @param {?} config
     * @return {?}
     */
    FormProvider.ProcessRule = function (control, config) {
        var /** @type {?} */ formGroupValue = ApplicationUtil.getParentObjectValue(control);
        var /** @type {?} */ parentObject = (control.parent) ? control.parent.value : undefined;
        return Linq.IsPassed(formGroupValue, config.conditionalExpression, parentObject);
    };
    return FormProvider;
}());
/**
 * @param {?} config
 * @return {?}
 */
function alphaValidator(config) {
    return function (control) {
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
    return function (control) {
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        var /** @type {?} */ compareControl = ApplicationUtil.getFormControl(config.fieldName, control);
        var /** @type {?} */ controlValue = control.value;
        var /** @type {?} */ compareControlValue = (compareControl) ? compareControl.value : '';
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
    return function (control) {
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
    return function (control) {
        var /** @type {?} */ controlValue = control.value;
        var /** @type {?} */ formGroupValue = ApplicationUtil.getParentObjectValue(control);
        config = ApplicationUtil.getConfigObject(config);
        var /** @type {?} */ parentObject = (control.parent) ? control.parent.value : undefined;
        var /** @type {?} */ refFieldControl = config.fieldName ? ApplicationUtil.getFormControl(config.fieldName, control) : undefined;
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(controlValue)) {
                var /** @type {?} */ isValid = false;
                var /** @type {?} */ cardTypes = config.fieldName && parentObject[config.fieldName] ? [parentObject[config.fieldName]] : config.creditCardTypes;
                for (var _i = 0, cardTypes_1 = cardTypes; _i < cardTypes_1.length; _i++) {
                    var creditCardType = cardTypes_1[_i];
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
    return function (control) {
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
var DecoratorName = /** @class */ (function () {
    function DecoratorName() {
    }
    return DecoratorName;
}());
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
var DateProvider = /** @class */ (function () {
    function DateProvider() {
    }
    /**
     * @return {?}
     */
    DateProvider.prototype.regex = function () {
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
    };
    /**
     * @param {?} value
     * @return {?}
     */
    DateProvider.prototype.getDate = function (value) {
        var /** @type {?} */ year, /** @type {?} */ month, /** @type {?} */ day;
        if (ReactiveFormConfig && ReactiveFormConfig.json && ReactiveFormConfig.json.internationalization && ReactiveFormConfig.json.internationalization.dateFormat && ReactiveFormConfig.json.internationalization.seperator) {
            var /** @type {?} */ seperator = ReactiveFormConfig.json.internationalization.seperator;
            switch (ReactiveFormConfig.json.internationalization.dateFormat) {
                case 'ymd':
                    _a = value.split(seperator).map(function (val) { return +val; }), year = _a[0], month = _a[1], day = _a[2];
                    break;
                case 'dmy':
                    _b = value.split(seperator).map(function (val) { return +val; }), day = _b[0], month = _b[1], year = _b[2];
                    break;
                case 'mdy':
                    _c = value.split(seperator).map(function (val) { return +val; }), month = _c[0], day = _c[1], year = _c[2];
                    break;
            }
        }
        return new Date(year, month - 1, day);
        var _a, _b, _c;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    DateProvider.prototype.isValid = function (value) {
        value = value.replace(ReactiveFormConfig.json.internationalization.seperator, '-').replace(ReactiveFormConfig.json.internationalization.seperator, '-');
        return this.regex().test(value);
    };
    return DateProvider;
}());
/**
 * @param {?} config
 * @return {?}
 */
function emailValidator(config) {
    return function (control) {
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                var /** @type {?} */ hexRegex = RegExRule.strictHexColor;
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
    return function (control) {
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        var /** @type {?} */ dateProvider = new DateProvider();
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (dateProvider.isValid(control.value)) {
                    var /** @type {?} */ maxDate_1 = config.value;
                    var /** @type {?} */ currentValueDate = dateProvider.getDate(control.value);
                    if (!(maxDate_1 >= currentValueDate))
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
    return function (control) {
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
    return function (control) {
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        var /** @type {?} */ dateProvider = new DateProvider();
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                if (dateProvider.isValid(control.value)) {
                    var /** @type {?} */ minDate_1 = config.value;
                    var /** @type {?} */ currentControlValue = dateProvider.getDate(control.value);
                    if (!(currentControlValue >= minDate_1))
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
    return function (control) {
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
    return function (control) {
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        var /** @type {?} */ controlValue = control.value;
        var /** @type {?} */ formGroupValue = ApplicationUtil.getParentObjectValue(control);
        if (RegexValidator.isNotBlank(controlValue)) {
            var /** @type {?} */ validation = RegexValidator.isValidPassword(config.validation, controlValue);
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
    return function (control) {
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
    return function (control) {
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
    return function (control) {
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
    return function (control) {
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
    return function (control) {
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
    return function (control) {
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
    return function (control) {
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        var /** @type {?} */ matchControl = control.root.get([config.fieldName]);
        var /** @type {?} */ matchControlValue = (matchControl) ? matchControl.value : '';
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        var /** @type {?} */ matchControl = control.root.get([config.fieldName]);
        var /** @type {?} */ matchControlValue = (matchControl) ? matchControl.value : '';
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        var /** @type {?} */ matchControl = control.root.get([config.fieldName]);
        var /** @type {?} */ matchControlValue = (matchControl) ? matchControl.value : '';
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        var /** @type {?} */ matchControl = control.root.get([config.fieldName]);
        var /** @type {?} */ matchControlValue = (matchControl) ? matchControl.value : '';
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
    return function (control) {
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        var /** @type {?} */ differentControl = control.root.get([config.fieldName]);
        var /** @type {?} */ differentControlValue = (differentControl) ? differentControl.value : '';
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
    return function (control) {
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
    return function (control) {
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
    return function (control) {
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
        var /** @type {?} */ factors = [];
        var /** @type {?} */ index = 1;
        for (index = 1; index <= Math.floor(Math.sqrt(dividend)); index += 1) {
            if (dividend % index === 0) {
                factors.push(index);
                if (dividend / index !== index)
                    factors.push(dividend / index);
            }
        }
        factors.sort(function (x, y) { return x - y; });
        return factors;
    }
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        var /** @type {?} */ dividendField = (control.parent && config.fieldName) ? control.parent.get([config.fieldName]) : undefined;
        var /** @type {?} */ dividend = (config.fieldName && dividendField) ? dividendField.value : config.dividend;
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
    return function (control) {
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (control.value instanceof Array) {
                var /** @type {?} */ testResult = false;
                var _loop_1 = function (value) {
                    testResult = control.value.some(function (y) { return y == value; });
                    if (!testResult)
                        return "break";
                };
                for (var _i = 0, _a = config.matchValues; _i < _a.length; _i++) {
                    var value = _a[_i];
                    var state_1 = _loop_1(/** @type {?} */ value);
                    if (state_1 === "break")
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (control.value instanceof Array) {
                var /** @type {?} */ testResult = false;
                var _loop_2 = function (value) {
                    testResult = control.value.some(function (y) { return y == value; });
                    if (testResult)
                        return "break";
                };
                for (var _i = 0, _a = config.matchValues; _i < _a.length; _i++) {
                    var value = _a[_i];
                    var state_2 = _loop_2(/** @type {?} */ value);
                    if (state_2 === "break")
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (control.value instanceof Array) {
                var /** @type {?} */ testResult = false;
                var _loop_3 = function (value) {
                    testResult = control.value.some(function (y) { return y == value; });
                    if (testResult)
                        return "break";
                };
                for (var _i = 0, _a = config.matchValues; _i < _a.length; _i++) {
                    var value = _a[_i];
                    var state_3 = _loop_3(/** @type {?} */ value);
                    if (state_3 === "break")
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
    return function (control) {
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
    return function (control) {
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
    return function (control) {
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
    return function (control) {
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
    return function (control) {
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                var /** @type {?} */ files = (control.value);
                var /** @type {?} */ testResult = true;
                var _loop_4 = function (file_1) {
                    var /** @type {?} */ splitText = file_1.name.split(".");
                    var /** @type {?} */ extension_1 = splitText[splitText.length - 1];
                    var /** @type {?} */ result = config.extensions.filter(function (t) { return extension_1.toLowerCase() == t.toLowerCase(); })[0];
                    if (!result) {
                        testResult = false;
                        return "break";
                    }
                };
                for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                    var file_1 = files_1[_i];
                    var state_4 = _loop_4(/** @type {?} */ file_1);
                    if (state_4 === "break")
                        break;
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                var /** @type {?} */ files = (control.value);
                var /** @type {?} */ minFileSize = config.minSize ? config.minSize : 0;
                var /** @type {?} */ testResult = false;
                for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
                    var file_2 = files_2[_i];
                    var /** @type {?} */ fileSize_1 = file_2.size;
                    testResult = (!(fileSize_1 >= minFileSize && fileSize_1 <= config.maxSize));
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
    return function (control) {
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
    return function (control) {
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
        var /** @type {?} */ isPrimeNumber = value != 1;
        for (var /** @type {?} */ i = 2; i < value; i++) {
            if (value % i == 0) {
                isPrimeNumber = false;
                break;
            }
        }
        return isPrimeNumber;
    }
    return function (control) {
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                var /** @type {?} */ splitText = control.value.split(',');
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
    return function (control) {
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (config.validators) {
                var /** @type {?} */ result = undefined;
                for (var _i = 0, _a = config.validators; _i < _a.length; _i++) {
                    var validator = _a[_i];
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            var /** @type {?} */ result = null;
            for (var _i = 0, _a = config.customRules; _i < _a.length; _i++) {
                var rule_1 = _a[_i];
                result = rule_1(entity);
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            if (RegexValidator.isNotBlank(control.value)) {
                var /** @type {?} */ files = (control.value);
                var /** @type {?} */ minFiles = config.minFiles ? config.minFiles : 1;
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
    return function (control) {
        config = ApplicationUtil.getConfigObject(config);
        if (FormProvider.ProcessRule(control, config)) {
            var /** @type {?} */ formGroupValue = ApplicationUtil.getParentObjectValue(control);
            var /** @type {?} */ parentObject = (control.parent) ? control.parent.value : undefined;
            var /** @type {?} */ result = null;
            for (var _i = 0, _a = config.customRules; _i < _a.length; _i++) {
                var rule_2 = _a[_i];
                result = rule_2(formGroupValue, parentObject, config.additionalValue);
                if (result)
                    break;
            }
            if (result)
                return result;
        }
        return ObjectMaker.null();
    };
}
var APP_VALIDATORS = {
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
var RxFormControl = /** @class */ (function (_super) {
    __extends(RxFormControl, _super);
    /**
     * @param {?} formState
     * @param {?} validator
     * @param {?} asyncValidator
     * @param {?} entityObject
     * @param {?} baseObject
     * @param {?} controlName
     */
    function RxFormControl(formState, validator, asyncValidator, entityObject, baseObject, controlName) {
        var _this = _super.call(this, formState, validator, asyncValidator) || this;
        _this.entityObject = entityObject;
        _this.baseObject = baseObject;
        _this.keyName = controlName;
        return _this;
    }
    /**
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    RxFormControl.prototype.setValue = function (value, options) {
        var _this = this;
        if (options && options.dirty)
            this.baseObject[this.keyName] = value;
        this.entityObject[this.keyName] = value;
        _super.prototype.setValue.call(this, value, options);
        if (this.errors) {
            Object.keys(this.errors).forEach(function (t) {
                _this.parent[CONTROLS_ERROR][_this.keyName] = _this.errorMessage = _this.getErrorMessage(_this.errors, t);
                if (!_this.errorMessage) {
                    var /** @type {?} */ errorObject = ObjectMaker.toJson(t, undefined, [_this.errors[t][t]]);
                    _this.parent[CONTROLS_ERROR][_this.keyName] = _this.errorMessage = _this.getErrorMessage(errorObject, t);
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
    };
    /**
     * @param {?} errorObject
     * @param {?} keyName
     * @return {?}
     */
    RxFormControl.prototype.getErrorMessage = function (errorObject, keyName) {
        if (errorObject[keyName][MESSAGE])
            return errorObject[keyName][MESSAGE];
        return;
    };
    return RxFormControl;
}(forms.FormControl));
var EntityService = /** @class */ (function () {
    function EntityService() {
    }
    /**
     * @param {?} jsonObject
     * @return {?}
     */
    EntityService.prototype.clone = function (jsonObject) {
        var /** @type {?} */ jObject = {};
        for (var /** @type {?} */ columnName in jsonObject) {
            if (Array.isArray(jsonObject[columnName])) {
                jObject[columnName] = [];
                for (var _i = 0, _a = jsonObject[columnName]; _i < _a.length; _i++) {
                    var row = _a[_i];
                    jObject[columnName].push(this.clone(row));
                }
            }
            else if (typeof jsonObject[columnName] == "object")
                jObject[columnName] = this.clone(jsonObject[columnName]);
            else
                jObject[columnName] = jsonObject[columnName];
        }
        return jObject;
    };
    return EntityService;
}());
var RxFormArray = /** @class */ (function (_super) {
    __extends(RxFormArray, _super);
    /**
     * @param {?} arrayObject
     * @param {?} controls
     * @param {?=} validatorOrOpts
     * @param {?=} asyncValidator
     */
    function RxFormArray(arrayObject, controls, validatorOrOpts, asyncValidator) {
        var _this = _super.call(this, controls, validatorOrOpts, asyncValidator) || this;
        _this.arrayObject = arrayObject;
        return _this;
    }
    /**
     * @param {?} control
     * @return {?}
     */
    RxFormArray.prototype.push = function (control) {
        var /** @type {?} */ formGroup = this.root;
        if (this.arrayObject)
            if (control.modelInstance)
                this.arrayObject.push(control.modelInstance);
        _super.prototype.push.call(this, control);
        if (formGroup["valueChangedSync"])
            formGroup.valueChangedSync();
    };
    /**
     * @param {?} index
     * @return {?}
     */
    RxFormArray.prototype.removeAt = function (index) {
        var /** @type {?} */ formGroup = this.root;
        this.arrayObject.splice(index, 1);
        _super.prototype.removeAt.call(this, index);
        if (formGroup["valueChangedSync"])
            formGroup.valueChangedSync();
    };
    return RxFormArray;
}(forms.FormArray));
var RxFormGroup = /** @class */ (function (_super) {
    __extends(RxFormGroup, _super);
    /**
     * @param {?} model
     * @param {?} entityObject
     * @param {?} controls
     * @param {?=} validatorOrOpts
     * @param {?=} asyncValidator
     */
    function RxFormGroup(model, entityObject, controls, validatorOrOpts, asyncValidator) {
        var _this = _super.call(this, controls, validatorOrOpts, asyncValidator) || this;
        _this.model = model;
        _this.entityObject = entityObject;
        _this.controlsError = {};
        _this.baseObject = Object.assign({}, _this.entityObject);
        _this.entityService = new EntityService();
        return _this;
    }
    /**
     * @return {?}
     */
    RxFormGroup.prototype.isDirty = function () {
        var /** @type {?} */ isDirty = false;
        for (var /** @type {?} */ name in this.value) {
            var /** @type {?} */ currentValue = this.controls[name].value;
            if (!(this.controls[name] instanceof forms.FormGroup || this.controls[name] instanceof forms.FormArray)) {
                isDirty = ApplicationUtil.notEqualTo(this.baseObject[name], currentValue);
            }
            else if (this.controls[name] instanceof RxFormGroup)
                isDirty = ((this.controls[name])).isDirty();
            else if (this.controls[name] instanceof forms.FormArray) {
                for (var _i = 0, _a = ((this.controls[name])).controls; _i < _a.length; _i++) {
                    var formGroup = _a[_i];
                    isDirty = ((formGroup)).isDirty();
                }
            }
            if (isDirty)
                break;
        }
        return isDirty;
    };
    
    /**
     * @return {?}
     */
    RxFormGroup.prototype.resetForm = function () {
        for (var /** @type {?} */ name in this.controls) {
            if (this.controls[name] instanceof RxFormGroup)
                ((this.controls[name])).resetForm();
            else if (this.controls[name] instanceof forms.FormArray) {
                for (var _i = 0, _a = ((this.controls[name])).controls; _i < _a.length; _i++) {
                    var formGroup = _a[_i];
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
    };
    /**
     * @param {?} onlyMessage
     * @return {?}
     */
    RxFormGroup.prototype.getErrorSummary = function (onlyMessage) {
        var _this = this;
        var /** @type {?} */ jObject = {};
        Object.keys(this.controls).forEach(function (columnName) {
            if (_this.controls[columnName] instanceof forms.FormGroup) {
                var /** @type {?} */ error = ((_this.controls[columnName])).getErrorSummary(false);
                if (Object.keys(error).length > 0)
                    jObject[columnName] = error;
            }
            else if (_this.controls[columnName] instanceof forms.FormArray) {
                var /** @type {?} */ index = 0;
                for (var _i = 0, _a = ((_this.controls[columnName])).controls; _i < _a.length; _i++) {
                    var formGroup = _a[_i];
                    var /** @type {?} */ error = ((formGroup)).getErrorSummary(false);
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
                if (_this.controls[columnName].errors) {
                    var /** @type {?} */ error = _this.controls[columnName].errors;
                    if (onlyMessage)
                        for (var /** @type {?} */ validationName in error)
                            jObject[columnName] = error[validationName].message;
                    else
                        jObject[columnName] = error;
                }
            }
        });
        return jObject;
    };
    /**
     * @return {?}
     */
    RxFormGroup.prototype.valueChangedSync = function () {
        var _this = this;
        Object.keys(this.controls).forEach(function (columnName) {
            if (!(_this.controls[columnName] instanceof forms.FormArray || _this.controls[columnName] instanceof RxFormArray) && !(_this.controls[columnName] instanceof forms.FormGroup || _this.controls[columnName] instanceof RxFormGroup) && !(_this.entityObject[columnName] instanceof forms.FormControl || _this.entityObject[columnName] instanceof RxFormControl) && _this.controls[columnName].value != _this.entityObject[columnName]) {
                _this.controls[columnName].setValue(_this.entityObject[columnName], { updateChanged: true });
            }
            else if ((_this.controls[columnName] instanceof forms.FormArray || _this.controls[columnName] instanceof RxFormArray)) {
                for (var _i = 0, _a = ((_this.controls[columnName])).controls; _i < _a.length; _i++) {
                    var formGroup = _a[_i];
                    ((formGroup)).valueChangedSync();
                }
            }
            else if ((_this.controls[columnName] instanceof RxFormGroup)) {
                ((_this.controls[columnName])).valueChangedSync();
            }
        });
    };
    Object.defineProperty(RxFormGroup.prototype, "modelInstanceValue", {
        /**
         * @return {?}
         */
        get: function () {
            return this.entityService.clone(this.entityObject);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RxFormGroup.prototype, "modelInstance", {
        /**
         * @return {?}
         */
        get: function () {
            return this.entityObject;
        },
        enumerable: true,
        configurable: true
    });
    return RxFormGroup;
}(forms.FormGroup));
var RxFormBuilder = /** @class */ (function (_super) {
    __extends(RxFormBuilder, _super);
    function RxFormBuilder() {
        var _this = _super.call(this) || this;
        _this.conditionalObjectProps = [];
        _this.conditionalValidationInstance = {};
        _this.builderConfigurationConditionalObjectProps = [];
        _this.formGroupPropOtherValidator = {};
        _this.currentFormGroupPropOtherValidator = {};
        _this.isNested = false;
        _this.isGroupCalled = false;
        return _this;
    }
    /**
     * @param {?} instanceFunc
     * @return {?}
     */
    RxFormBuilder.prototype.getInstanceContainer = function (instanceFunc) {
        return defaultContainer.get(instanceFunc);
    };
    /**
     * @param {?} formGroup
     * @param {?} object
     * @return {?}
     */
    RxFormBuilder.prototype.setValue = function (formGroup, object) {
        for (var /** @type {?} */ col in object) {
            var /** @type {?} */ control = formGroup.get([col]);
            control.setValue(object[col]);
            control.updateValueAndValidity();
        }
    };
    /**
     * @param {?} fomrBuilderConfiguration
     * @return {?}
     */
    RxFormBuilder.prototype.extractExpressions = function (fomrBuilderConfiguration) {
        if (fomrBuilderConfiguration && fomrBuilderConfiguration.dynamicValidation) {
            for (var /** @type {?} */ property in fomrBuilderConfiguration.dynamicValidation) {
                for (var /** @type {?} */ decorator in fomrBuilderConfiguration.dynamicValidation[property]) {
                    if (fomrBuilderConfiguration.dynamicValidation[property][decorator].conditionalExpression) {
                        var /** @type {?} */ columns = Linq.expressionColumns(fomrBuilderConfiguration.dynamicValidation[property][decorator].conditionalExpression);
                        defaultContainer.addChangeValidation(this.conditionalValidationInstance, property, columns);
                    }
                }
            }
        }
        return null;
    };
    /**
     * @param {?} property
     * @param {?} propertyValidators
     * @param {?} propValidationConfig
     * @param {?} instance
     * @param {?} entity
     * @return {?}
     */
    RxFormBuilder.prototype.addFormControl = function (property, propertyValidators, propValidationConfig, instance, entity) {
        var /** @type {?} */ validators = [];
        var /** @type {?} */ columns = [];
        if ((instance.conditionalValidationProps && instance.conditionalValidationProps[property.name]) || (this.conditionalValidationInstance.conditionalValidationProps && this.conditionalValidationInstance.conditionalValidationProps[property.name])) {
            var /** @type {?} */ props_1 = [];
            if ((instance.conditionalValidationProps && instance.conditionalValidationProps[property.name]))
                instance.conditionalValidationProps[property.name].forEach(function (t) { return props_1.push(t); });
            if (this.conditionalValidationInstance.conditionalValidationProps && this.conditionalValidationInstance.conditionalValidationProps[property.name])
                this.conditionalValidationInstance.conditionalValidationProps[property.name].forEach(function (t) { return props_1.push(t); });
            validators.push(conditionalChangeValidator(props_1));
        }
        if (this.conditionalObjectProps.length > 0 || this.builderConfigurationConditionalObjectProps.length > 0) {
            var /** @type {?} */ propConditions_1 = [];
            if (this.conditionalObjectProps)
                propConditions_1 = this.conditionalObjectProps.filter(function (t) { return t.propName == property.name; });
            if (this.builderConfigurationConditionalObjectProps)
                this.builderConfigurationConditionalObjectProps.filter(function (t) { return t.propName == property.name; }).forEach(function (t) { return propConditions_1.push(t); });
            propConditions_1.forEach(function (t) {
                if (t.referencePropName && columns.indexOf(t.referencePropName) == -1)
                    columns.push(t.referencePropName);
            });
            if (columns.length > 0)
                validators.push(conditionalChangeValidator(columns));
        }
        for (var _i = 0, propertyValidators_1 = propertyValidators; _i < propertyValidators_1.length; _i++) {
            var propertyValidator = propertyValidators_1[_i];
            propertyValidator.annotationType == AnnotationTypes.rule ? validators.push(APP_VALIDATORS[propertyValidator.annotationType](propertyValidator.config, entity)) : validators.push(APP_VALIDATORS[propertyValidator.annotationType](propertyValidator.config));
        }
        if (propValidationConfig)
            this.additionalValidation(validators, propValidationConfig);
        if (this.currentFormGroupPropOtherValidator[property.name])
            this.currentFormGroupPropOtherValidator[property.name].forEach(function (t) { validators.push(t); });
        return validators;
    };
    /**
     * @param {?} validations
     * @param {?} propValidationConfig
     * @return {?}
     */
    RxFormBuilder.prototype.additionalValidation = function (validations, propValidationConfig) {
        for (var /** @type {?} */ col in AnnotationTypes) {
            if (propValidationConfig[AnnotationTypes[col]] && col != "custom") {
                validations.push(APP_VALIDATORS[AnnotationTypes[col]](propValidationConfig[AnnotationTypes[col]]));
            }
            else if (col == AnnotationTypes.custom && propValidationConfig[AnnotationTypes[col]])
                validations.push(propValidationConfig[col]);
        }
    };
    /**
     * @template T
     * @param {?} instanceContainer
     * @param {?} object
     * @return {?}
     */
    RxFormBuilder.prototype.checkObjectPropAdditionalValidation = function (instanceContainer, object) {
        var _this = this;
        var /** @type {?} */ props = instanceContainer.properties.filter(function (t) { return t.propertyType == OBJECT_PROPERTY || t.propertyType == ARRAY_PROPERTY; });
        props.forEach(function (t) {
            var /** @type {?} */ instance = _this.getInstanceContainer(t.entity);
            if (instance.conditionalValidationProps) {
                for (var /** @type {?} */ key in instance.conditionalValidationProps) {
                    var /** @type {?} */ prop = instanceContainer.properties.filter(function (t) { return t.name == key; })[0];
                    if (prop) {
                        if (!instanceContainer.conditionalValidationProps)
                            instanceContainer.conditionalValidationProps = {};
                        if (!instanceContainer.conditionalValidationProps[key])
                            instanceContainer.conditionalValidationProps[key] = [];
                        instance.conditionalValidationProps[key].forEach(function (x) {
                            if (t.propertyType != ARRAY_PROPERTY)
                                instanceContainer.conditionalValidationProps[key].push([t.name, x].join('.'));
                            else
                                instanceContainer.conditionalValidationProps[key].push([t.name, x].join('[]'));
                        });
                    }
                }
            }
        });
    };
    /**
     * @param {?} model
     * @param {?=} entityObject
     * @param {?=} formBuilderConfiguration
     * @return {?}
     */
    RxFormBuilder.prototype.getObject = function (model, entityObject, formBuilderConfiguration) {
        var /** @type {?} */ json = {};
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
    };
    /**
     * @param {?} groupObject
     * @param {?=} validatorConfig
     * @return {?}
     */
    RxFormBuilder.prototype.group = function (groupObject, validatorConfig) {
        var /** @type {?} */ modelInstance = _super.prototype.createInstance.call(this);
        var /** @type {?} */ entityObject = {};
        this.formGroupPropOtherValidator = {};
        this.currentFormGroupPropOtherValidator = this.formGroupPropOtherValidator;
        this.createValidatorFormGroup(groupObject, entityObject, modelInstance, validatorConfig);
        this.currentFormGroupPropOtherValidator = this.formGroupPropOtherValidator;
        this.isGroupCalled = true;
        var /** @type {?} */ formGroup = this.formGroup(modelInstance.constructor, entityObject, validatorConfig);
        this.isGroupCalled = false;
        this.formGroupPropOtherValidator = {};
        this.currentFormGroupPropOtherValidator = this.formGroupPropOtherValidator;
        this.formGroupPropOtherValidator = {};
        return formGroup;
    };
    /**
     * @param {?} propName
     * @param {?} validatorConfig
     * @param {?} modelInstance
     * @return {?}
     */
    RxFormBuilder.prototype.applyAllPropValidator = function (propName, validatorConfig, modelInstance) {
        var _this = this;
        if (validatorConfig && validatorConfig.applyAllProps) {
            if (!(validatorConfig.excludeProps && validatorConfig.excludeProps.length > 0 && validatorConfig.excludeProps.indexOf(propName) == -1)) {
                validatorConfig.applyAllProps.forEach(function (t) {
                    if (t.name == RX_WEB_VALIDATOR) {
                        t(propName, modelInstance);
                    }
                    else {
                        if (!_this.currentFormGroupPropOtherValidator[propName])
                            _this.currentFormGroupPropOtherValidator[propName] = [];
                        _this.currentFormGroupPropOtherValidator[propName].push(t);
                    }
                });
            }
        }
    };
    /**
     * @param {?} propName
     * @param {?} validatorConfig
     * @return {?}
     */
    RxFormBuilder.prototype.dynamicValidationPropCheck = function (propName, validatorConfig) {
        return (validatorConfig == undefined) ? true : (!validatorConfig.dynamicValidationConfigurationPropertyName) ? true : validatorConfig.dynamicValidationConfigurationPropertyName == propName ? false : true;
    };
    /**
     * @param {?} groupObject
     * @param {?} entityObject
     * @param {?} modelInstance
     * @param {?} validatorConfig
     * @return {?}
     */
    RxFormBuilder.prototype.createValidatorFormGroup = function (groupObject, entityObject, modelInstance, validatorConfig) {
        for (var /** @type {?} */ propName in groupObject) {
            var /** @type {?} */ prop = groupObject[propName];
            if (prop instanceof Array && prop.length > 0 && typeof prop[0] != OBJECT_STRING) {
                var /** @type {?} */ propValidators = (prop.length > 1 && prop[1] instanceof Array) ? prop[1] : (prop.length == 2) ? [prop[1]] : [];
                var /** @type {?} */ propertyAdded = false;
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
                if (prop instanceof forms.FormArray) {
                    entityObject[propName] = prop;
                }
                else {
                    var /** @type {?} */ propModelInstance = _super.prototype.createInstance.call(this);
                    if (typeof modelInstance == "function")
                        modelInstance.constructor = modelInstance;
                    defaultContainer.initPropertyObject(propName, ARRAY_PROPERTY, propModelInstance.constructor, modelInstance);
                    entityObject[propName] = [];
                    for (var _i = 0, prop_1 = prop; _i < prop_1.length; _i++) {
                        var row = prop_1[_i];
                        var /** @type {?} */ jObject = {};
                        entityObject[propName].push(jObject);
                        this.createValidatorFormGroup(row, jObject, propModelInstance.constructor, validatorConfig);
                    }
                }
            }
            else if (typeof prop == OBJECT_STRING && !(prop instanceof forms.FormControl || prop instanceof RxFormControl)) {
                var /** @type {?} */ formGroup = (prop instanceof forms.FormArray) ? prop.controls[0] : prop;
                if (!formGroup.model && (prop instanceof forms.FormGroup || prop instanceof RxFormGroup)) {
                    formGroup = this.group(formGroup.controls);
                }
                if (prop instanceof forms.FormGroup || prop instanceof RxFormGroup) {
                    entityObject[propName] = prop;
                    defaultContainer.initPropertyObject(propName, OBJECT_PROPERTY, formGroup.model, modelInstance);
                }
                else if (prop instanceof forms.FormArray) {
                    entityObject[propName] = prop;
                    defaultContainer.initPropertyObject(propName, ARRAY_PROPERTY, formGroup.model, modelInstance);
                }
                else {
                    if (this.dynamicValidationPropCheck(propName, validatorConfig)) {
                        this.formGroupPropOtherValidator[propName] = {};
                        this.currentFormGroupPropOtherValidator = this.formGroupPropOtherValidator[propName];
                        var /** @type {?} */ propModelInstance = _super.prototype.createInstance.call(this);
                        entityObject[propName] = {};
                        entityObject[propName].constructor = propModelInstance.constructor;
                        defaultContainer.initPropertyObject(propName, OBJECT_PROPERTY, entityObject[propName].constructor, modelInstance);
                        var /** @type {?} */ objectValidationConfig = this.getValidatorConfig(validatorConfig, groupObject, propName + ".");
                        this.createValidatorFormGroup(groupObject[propName], entityObject[propName], entityObject[propName].constructor, objectValidationConfig);
                    }
                    else
                        entityObject[propName] = groupObject[propName];
                }
            }
            if (typeof prop == STRING || typeof prop == NUMBER || typeof prop == BOOLEAN) {
                entityObject[propName] = prop;
            }
            else if ((prop && prop.length > 0 && (typeof prop[0] != OBJECT_STRING) && !(prop instanceof forms.FormControl || prop instanceof RxFormControl) && !(prop instanceof forms.FormArray))) {
                entityObject[propName] = prop[0];
            }
            else if (prop instanceof forms.FormArray) {
                entityObject[propName] = prop;
            }
            else if (prop instanceof forms.FormControl || prop instanceof RxFormControl) {
                entityObject[propName] = prop;
                defaultContainer.initPropertyObject(propName, PROPERTY, undefined, modelInstance.constructor ? modelInstance : { constructor: modelInstance });
            }
        }
    };
    /**
     * @param {?} validatorConfig
     * @param {?} entityObject
     * @param {?} rootPropertyName
     * @param {?=} arrayPropertyName
     * @return {?}
     */
    RxFormBuilder.prototype.getValidatorConfig = function (validatorConfig, entityObject, rootPropertyName, arrayPropertyName) {
        var /** @type {?} */ validationProps = {};
        var /** @type {?} */ excludeProps = [];
        var /** @type {?} */ includeProps = [];
        if (validatorConfig) {
            for (var /** @type {?} */ propName in validatorConfig.dynamicValidation) {
                if (propName.indexOf(rootPropertyName) != -1 || (arrayPropertyName && propName.indexOf(arrayPropertyName) != -1)) {
                    var /** @type {?} */ splitProp = propName.split(".")[1];
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
    };
    /**
     * @param {?} properties
     * @param {?} rootPropertyName
     * @return {?}
     */
    RxFormBuilder.prototype.getProps = function (properties, rootPropertyName) {
        var /** @type {?} */ props = [];
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var prop_2 = properties_1[_i];
            if (prop_2.indexOf(rootPropertyName) != -1) {
                var /** @type {?} */ splitProp = prop_2.split(".")[1];
                if (splitProp)
                    props.push(splitProp);
            }
        }
        return props;
    };
    /**
     * @template T
     * @param {?} model
     * @param {?=} entityObject
     * @param {?=} formBuilderConfiguration
     * @return {?}
     */
    RxFormBuilder.prototype.formGroup = function (model, entityObject, formBuilderConfiguration) {
        var _this = this;
        var /** @type {?} */ json = this.getObject(model, entityObject, formBuilderConfiguration);
        model = json.model;
        entityObject = json.entityObject;
        if (entityObject.constructor != model && !this.isGroupCalled) {
            entityObject = json.entityObject = this.updateObject(model, json.entityObject);
        }
        formBuilderConfiguration = json.formBuilderConfiguration;
        if (formBuilderConfiguration)
            this.extractExpressions(formBuilderConfiguration);
        var /** @type {?} */ instanceContainer = this.getInstanceContainer(model);
        this.checkObjectPropAdditionalValidation(instanceContainer, entityObject);
        var /** @type {?} */ formGroupObject = {};
        var /** @type {?} */ additionalValidations = {};
        instanceContainer.properties.forEach(function (property) {
            var /** @type {?} */ isIncludeProp = true;
            if (formBuilderConfiguration && formBuilderConfiguration.excludeProps && formBuilderConfiguration.excludeProps.length > 0)
                isIncludeProp = formBuilderConfiguration.excludeProps.indexOf(property.name) == -1;
            if (formBuilderConfiguration && formBuilderConfiguration.dynamicValidation)
                additionalValidations = formBuilderConfiguration.dynamicValidation;
            if (formBuilderConfiguration && formBuilderConfiguration.includeProps && formBuilderConfiguration.includeProps.length > 0)
                isIncludeProp = formBuilderConfiguration.includeProps.indexOf(property.name) != -1;
            if (isIncludeProp) {
                switch (property.propertyType) {
                    case PROPERTY:
                        if (!(entityObject[property.name] instanceof forms.FormControl || entityObject[property.name] instanceof RxFormControl)) {
                            var /** @type {?} */ propertyValidators = instanceContainer.propertyAnnotations.filter(function (t) { return t.propertyName == property.name; });
                            formGroupObject[property.name] = new RxFormControl(entityObject[property.name], _this.addFormControl(property, propertyValidators, additionalValidations[property.name], instanceContainer, entityObject), undefined, json.entityObject, Object.assign({}, json.entityObject), property.name);
                            _this.isNested = false;
                        }
                        else
                            formGroupObject[property.name] = entityObject[property.name];
                        break;
                    case OBJECT_PROPERTY:
                        if (entityObject[property.name] && entityObject[property.name] instanceof Object && !(entityObject[property.name] instanceof forms.FormGroup || entityObject[property.name] instanceof RxFormGroup)) {
                            _this.isNested = true;
                            if (instanceContainer && instanceContainer.conditionalObjectProps)
                                _this.conditionalObjectProps = instanceContainer.conditionalObjectProps.filter(function (t) { return t.objectPropName == property.name; });
                            if (_this.conditionalValidationInstance && _this.conditionalValidationInstance.conditionalObjectProps)
                                _this.builderConfigurationConditionalObjectProps = _this.conditionalValidationInstance.conditionalObjectProps.filter(function (t) { return t.objectPropName == property.name; });
                            if (_this.formGroupPropOtherValidator[property.name])
                                _this.currentFormGroupPropOtherValidator = _this.formGroupPropOtherValidator[property.name];
                            var /** @type {?} */ objectValidationConfig = _this.getValidatorConfig(formBuilderConfiguration, entityObject[property.name], property.name + ".");
                            formGroupObject[property.name] = _this.formGroup(property.entity, entityObject[property.name], objectValidationConfig);
                            _this.conditionalObjectProps = [];
                            _this.builderConfigurationConditionalObjectProps = [];
                            _this.isNested = false;
                        }
                        else if (entityObject[property.name] instanceof forms.FormGroup || entityObject[property.name] instanceof RxFormGroup)
                            formGroupObject[property.name] = entityObject[property.name];
                        break;
                    case ARRAY_PROPERTY:
                        if (entityObject[property.name] && entityObject[property.name] instanceof Array && !(entityObject[property.name] instanceof forms.FormArray)) {
                            _this.isNested = true;
                            var /** @type {?} */ formArrayGroup = [];
                            var /** @type {?} */ index_1 = 0;
                            for (var _i = 0, _a = entityObject[property.name]; _i < _a.length; _i++) {
                                var subObject = _a[_i];
                                if (instanceContainer && instanceContainer.conditionalObjectProps)
                                    _this.conditionalObjectProps = instanceContainer.conditionalObjectProps.filter(function (t) { return t.objectPropName == property.name && t.arrayIndex == index_1; });
                                if (_this.conditionalValidationInstance && _this.conditionalValidationInstance.conditionalObjectProps)
                                    _this.builderConfigurationConditionalObjectProps = _this.conditionalValidationInstance.conditionalObjectProps.filter(function (t) { return t.objectPropName == property.name && t.arrayIndex == index_1; });
                                if (_this.formGroupPropOtherValidator[property.name])
                                    _this.currentFormGroupPropOtherValidator = _this.formGroupPropOtherValidator[property.name];
                                var /** @type {?} */ objectValidationConfig = _this.getValidatorConfig(formBuilderConfiguration, subObject, property.name + ".", property.name + "[" + index_1 + "].");
                                formArrayGroup.push(_this.formGroup(property.entity, subObject, objectValidationConfig));
                                index_1++;
                                _this.conditionalObjectProps = [];
                                _this.builderConfigurationConditionalObjectProps = [];
                            }
                            var /** @type {?} */ formBuilder = new forms.FormBuilder();
                            formGroupObject[property.name] = new RxFormArray(entityObject[property.name], formArrayGroup);
                            _this.isNested = false;
                        }
                        else if (entityObject[property.name] instanceof forms.FormArray)
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
    };
    return RxFormBuilder;
}(BaseFormBuilder));
RxFormBuilder.decorators = [
    { type: core.Injectable },
];
/**
 * @nocollapse
 */
RxFormBuilder.ctorParameters = function () { return []; };
/**
 * @abstract
 */
var BaseDirective = /** @class */ (function () {
    function BaseDirective() {
    }
    return BaseDirective;
}());
var RxwebFormDirective = /** @class */ (function (_super) {
    __extends(RxwebFormDirective, _super);
    function RxwebFormDirective() {
        var _this = _super.apply(this, arguments) || this;
        _this.clearTimeout = 0;
        return _this;
    }
    /**
     * @return {?}
     */
    RxwebFormDirective.prototype.ngAfterContentInit = function () {
        if (this.ngForm) {
            this.configureModelValidations();
        }
    };
    /**
     * @return {?}
     */
    RxwebFormDirective.prototype.configureModelValidations = function () {
        var _this = this;
        this.clearTimeout = window.setTimeout(function () {
            window.clearTimeout(_this.clearTimeout);
            _this.ngForm.form["marked"] = true;
            Object.keys(_this.ngForm.form.controls).forEach(function (key) {
                _this.ngForm.form.controls[key].updateValueAndValidity();
            });
            delete _this.ngForm.form["marked"];
        }, 500);
    };
    /**
     * @return {?}
     */
    RxwebFormDirective.prototype.ngOnDestroy = function () {
    };
    return RxwebFormDirective;
}(BaseDirective));
RxwebFormDirective.decorators = [
    { type: core.Directive, args: [{
                selector: '[formGroup],[rxwebForm]',
            },] },
];
/**
 * @nocollapse
 */
RxwebFormDirective.ctorParameters = function () { return []; };
RxwebFormDirective.propDecorators = {
    'ngForm': [{ type: core.Input, args: ['rxwebForm',] },],
};
var DecimalProvider = /** @class */ (function () {
    /**
     * @param {?} decimalPipe
     */
    function DecimalProvider(decimalPipe) {
        this.decimalPipe = decimalPipe;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    DecimalProvider.prototype.replacer = function (value) {
        value = value.replace(RegexValidator.commaRegex(), BLANK);
        var /** @type {?} */ splitValue = value.split(".");
        value = (splitValue.length > 1 && splitValue[1] && RegexValidator.isZero(splitValue[1])) ? splitValue[0] : value;
        return value;
    };
    /**
     * @param {?} value
     * @param {?} digitsInfo
     * @return {?}
     */
    DecimalProvider.prototype.transFormDecimal = function (value, digitsInfo) {
        return this.decimalPipe.transform(value, digitsInfo);
    };
    return DecimalProvider;
}());
DecimalProvider.decorators = [
    { type: core.Injectable },
];
/**
 * @nocollapse
 */
DecimalProvider.ctorParameters = function () { return [
    { type: common.DecimalPipe, },
]; };
var HtmlControlTemplateDirective = /** @class */ (function () {
    /**
     * @param {?} templateRef
     */
    function HtmlControlTemplateDirective(templateRef) {
        this.templateRef = templateRef;
    }
    
    return HtmlControlTemplateDirective;
}());
HtmlControlTemplateDirective.decorators = [
    { type: core.Directive, args: [{
                selector: '[htmlControlTemplate]'
            },] },
];
/**
 * @nocollapse
 */
HtmlControlTemplateDirective.ctorParameters = function () { return [
    { type: core.TemplateRef, },
]; };
HtmlControlTemplateDirective.propDecorators = {
    'type': [{ type: core.Input, args: ['htmlControlTemplate',] },],
};
var RxwebDynamicFormComponent = /** @class */ (function () {
    function RxwebDynamicFormComponent() {
    }
    /**
     * @return {?}
     */
    RxwebDynamicFormComponent.prototype.ngAfterContentInit = function () {
    };
    return RxwebDynamicFormComponent;
}());
RxwebDynamicFormComponent.decorators = [
    { type: core.Component, args: [{
                template: '',
                selector: 'rxweb-dynamic-form',
                exportAs: 'rxwebForm'
            },] },
];
/**
 * @nocollapse
 */
RxwebDynamicFormComponent.ctorParameters = function () { return []; };
RxwebDynamicFormComponent.propDecorators = {
    'htmlControlTemplates': [{ type: core.ContentChildren, args: [HtmlControlTemplateDirective,] },],
};
var RxwebControlComponent = /** @class */ (function () {
    function RxwebControlComponent() {
    }
    /**
     * @return {?}
     */
    RxwebControlComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (this.dynamicForm && this.dynamicForm.htmlControlTemplates) {
            var /** @type {?} */ htmlControl = this.dynamicForm.htmlControlTemplates.filter(function (t) { return t.type == _this.type; })[0];
            if (htmlControl)
                this.control = htmlControl;
        }
    };
    return RxwebControlComponent;
}());
RxwebControlComponent.decorators = [
    { type: core.Component, args: [{
                template: "<ng-template [controlHost]=\"{templateRef:control.templateRef, data:data, $implicit: data}\">\n            </ng-template>",
                selector: 'rxweb-control'
            },] },
];
/**
 * @nocollapse
 */
RxwebControlComponent.ctorParameters = function () { return []; };
RxwebControlComponent.propDecorators = {
    'type': [{ type: core.Input },],
    'dynamicForm': [{ type: core.Input },],
    'data': [{ type: core.Input },],
};
var ControlHostDirective = /** @class */ (function () {
    /**
     * @param {?} viewContainerRef
     */
    function ControlHostDirective(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
    }
    Object.defineProperty(ControlHostDirective.prototype, "portal", {
        /**
         * @param {?} context
         * @return {?}
         */
        set: function (context) {
            if (context.templateRef) {
                if (this.view) {
                    this.view.destroy();
                    this.view = undefined;
                }
                this.view = this.viewContainerRef.createEmbeddedView(context.templateRef, context);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    ControlHostDirective.prototype.ngOnDestroy = function () {
        if (this.view)
            this.view.destroy();
        if (this.viewContainerRef)
            this.viewContainerRef.clear();
    };
    return ControlHostDirective;
}());
ControlHostDirective.decorators = [
    { type: core.Directive, args: [{
                selector: '[controlHost]'
            },] },
];
/**
 * @nocollapse
 */
ControlHostDirective.ctorParameters = function () { return [
    { type: core.ViewContainerRef, },
]; };
ControlHostDirective.propDecorators = {
    'portal': [{ type: core.Input, args: ['controlHost',] },],
};
/**
 * @abstract
 */
var ControlExpressionProcess = /** @class */ (function () {
    function ControlExpressionProcess() {
        this.controlConfig = {};
        this.isProcessed = false;
    }
    /**
     * @param {?} control
     * @param {?} name
     * @return {?}
     */
    ControlExpressionProcess.prototype.process = function (control, name) {
        var /** @type {?} */ validationRule = {};
        var /** @type {?} */ controls = control.parent.controls;
        Object.keys(controls).forEach(function (fieldName) {
            var /** @type {?} */ formControl = controls[fieldName];
            if (formControl.validatorConfig) {
                Object.keys(AnnotationTypes).forEach(function (validatorName) {
                    if (formControl.validatorConfig[validatorName] && formControl.validatorConfig[validatorName].conditionalExpression) {
                        var /** @type {?} */ columns = Linq.expressionColumns(formControl.validatorConfig[validatorName].conditionalExpression);
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
    };
    /**
     * @param {?} control
     * @return {?}
     */
    ControlExpressionProcess.prototype.setModelConfig = function (control) {
        if (this.controlConfig && this.controlConfig.validatorConfig) {
            control["validatorConfig"] = this.controlConfig.validatorConfig;
            this.controlConfig = undefined;
        }
    };
    /**
     * @param {?} control
     * @return {?}
     */
    ControlExpressionProcess.prototype.expressionProcessor = function (control) {
        this.setModelConfig(control);
        if (this.formControlName) {
            if (!this.isProcessed && control.parent && !control.parent["model"]) {
                this.process(control, this.formControlName);
            }
        }
        else if (!this.isProcessed && this.name && control.parent && control.parent["marked"]) {
            this.process(control, this.name);
        }
    };
    return ControlExpressionProcess;
}());
ControlExpressionProcess.propDecorators = {
    'name': [{ type: core.Input },],
    'formControlName': [{ type: core.Input },],
};
var BaseValidator = /** @class */ (function (_super) {
    __extends(BaseValidator, _super);
    function BaseValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    BaseValidator.prototype.setEventName = function () {
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
    };
    /**
     * @param {?} control
     * @return {?}
     */
    BaseValidator.prototype.validate = function (control) {
        if (this.conditionalValidator)
            this.conditionalValidator(control);
        else if (!this.isProcessed && control.parent && !control.parent["model"])
            this.expressionProcessor(control);
        return this.validator ? this.validator(control) : null;
    };
    return BaseValidator;
}(ControlExpressionProcess));
var COMPOSE = 'compose';
var NGMODEL_BINDING = {
    provide: forms.NG_VALIDATORS,
    useExisting: core.forwardRef(function () { return RxFormControlDirective; }),
    multi: true
};
var ALLOW_VALIDATOR_WITHOUT_CONFIG = ['required', 'alpha', 'alphaNumeric', 'ascii', 'dataUri', 'digit', 'email', 'even', 'hexColor', 'json', 'latitude', 'latLong', 'leapYear', 'longitude', 'lowerCase', 'mac', 'odd', 'port', 'primeNumber', 'time', 'upperCase', 'url'];
var RxFormControlDirective = /** @class */ (function (_super) {
    __extends(RxFormControlDirective, _super);
    /**
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} decimalProvider
     */
    function RxFormControlDirective(elementRef, renderer, decimalProvider) {
        var _this = _super.call(this) || this;
        _this.elementRef = elementRef;
        _this.renderer = renderer;
        _this.decimalProvider = decimalProvider;
        _this.eventListeners = [];
        _this.element = elementRef.nativeElement;
        _this.setEventName();
        return _this;
    }
    Object.defineProperty(RxFormControlDirective.prototype, "validationControls", {
        /**
         * @return {?}
         */
        get: function () {
            return this.controls;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.controls = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    RxFormControlDirective.prototype.ngOnInit = function () {
        var _this = this;
        var /** @type {?} */ validators = [];
        Object.keys(APP_VALIDATORS).forEach(function (validatorName) {
            if ((_this[validatorName]) || (ALLOW_VALIDATOR_WITHOUT_CONFIG.indexOf(validatorName) != -1 && _this[validatorName] == BLANK)) {
                validators.push(APP_VALIDATORS[validatorName](_this[validatorName]));
                if (_this.name && !(_this.formControlName && _this.formControl))
                    ApplicationUtil.configureControl(_this.controlConfig, _this[validatorName], validatorName);
            }
        });
        if (validators.length > 0)
            this.validator = APP_VALIDATORS[COMPOSE]({ validators: validators });
        if (this.numeric && this.numeric.isFormat)
            this.bindNumericElementEvent();
    };
    /**
     * @param {?=} config
     * @return {?}
     */
    RxFormControlDirective.prototype.bindNumericElementEvent = function (config) {
        var _this = this;
        if (config)
            this.numeric = config;
        var /** @type {?} */ listener = this.renderer.listen(this.element, BLUR, function (event) {
            if (!(_this.formControl && _this.formControl.errors && _this.formControl.errors.numeric)) {
                var /** @type {?} */ value = _this.decimalProvider.transFormDecimal(_this.formControl.value, _this.numeric.digitsInfo);
                _this.setValueOnElement(value);
            }
        });
        this.eventListeners.push(listener);
        listener = this.renderer.listen(this.element, FOCUS, function (event) {
            if (!(_this.formControl && _this.formControl.errors && _this.formControl.errors.numeric) && _this.formControl.value != null) {
                var /** @type {?} */ value = _this.decimalProvider.replacer(_this.formControl.value);
                _this.setValueOnElement(value);
            }
        });
        this.eventListeners.push(listener);
    };
    /**
     * @return {?}
     */
    RxFormControlDirective.prototype.bindValueChangeEvent = function () {
        var _this = this;
        if (this.eventName != BLANK) {
            var /** @type {?} */ listener = this.renderer.listen(this.element, this.eventName, function () {
                Object.keys(_this.validationControls).forEach(function (fieldName) {
                    _this.validationControls[fieldName].updateValueAndValidity();
                });
            });
            this.eventListeners.push(listener);
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    RxFormControlDirective.prototype.setValueOnElement = function (value) {
        this.renderer.setElementProperty(this.element, ELEMENT_VALUE, value);
    };
    /**
     * @return {?}
     */
    RxFormControlDirective.prototype.ngOnDestroy = function () {
        this.controls = undefined;
        var /** @type {?} */ eventCount = this.eventListeners.length;
        for (var /** @type {?} */ i = 0; i < eventCount; i++) {
            this.eventListeners[0]();
            this.eventListeners.splice(0, 1);
        }
        this.eventListeners = [];
    };
    return RxFormControlDirective;
}(BaseValidator));
RxFormControlDirective.decorators = [
    { type: core.Directive, args: [{
                selector: '[ngModel],[formControlName],[formControl]',
                providers: [NGMODEL_BINDING],
            },] },
];
/**
 * @nocollapse
 */
RxFormControlDirective.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: core.Renderer, },
    { type: DecimalProvider, },
]; };
RxFormControlDirective.propDecorators = {
    'allOf': [{ type: core.Input },],
    'alpha': [{ type: core.Input },],
    'alphaNumeric': [{ type: core.Input },],
    'ascii': [{ type: core.Input },],
    'choice': [{ type: core.Input },],
    'compare': [{ type: core.Input },],
    'compose': [{ type: core.Input },],
    'contains': [{ type: core.Input },],
    'creditCard': [{ type: core.Input },],
    'dataUri': [{ type: core.Input },],
    'different': [{ type: core.Input },],
    'digit': [{ type: core.Input },],
    'email': [{ type: core.Input },],
    'endsWith': [{ type: core.Input },],
    'even': [{ type: core.Input },],
    'extension': [{ type: core.Input },],
    'factor': [{ type: core.Input },],
    'fileSize': [{ type: core.Input },],
    'greaterThanEqualTo': [{ type: core.Input },],
    'greaterThan': [{ type: core.Input },],
    'hexColor': [{ type: core.Input },],
    'json': [{ type: core.Input },],
    'latitude': [{ type: core.Input },],
    'latLong': [{ type: core.Input },],
    'leapYear': [{ type: core.Input },],
    'lessThan': [{ type: core.Input },],
    'lessThanEqualTo': [{ type: core.Input },],
    'longitude': [{ type: core.Input },],
    'lowerCase': [{ type: core.Input },],
    'mac': [{ type: core.Input },],
    'maxDate': [{ type: core.Input },],
    'maxLength': [{ type: core.Input },],
    'maxNumber': [{ type: core.Input },],
    'minDate': [{ type: core.Input },],
    'minLength': [{ type: core.Input },],
    'minNumber': [{ type: core.Input },],
    'noneOf': [{ type: core.Input },],
    'numeric': [{ type: core.Input },],
    'odd': [{ type: core.Input },],
    'oneOf': [{ type: core.Input },],
    'password': [{ type: core.Input },],
    'pattern': [{ type: core.Input },],
    'port': [{ type: core.Input },],
    'primeNumber': [{ type: core.Input },],
    'required': [{ type: core.Input },],
    'range': [{ type: core.Input },],
    'rule': [{ type: core.Input },],
    'startsWith': [{ type: core.Input },],
    'time': [{ type: core.Input },],
    'upperCase': [{ type: core.Input },],
    'url': [{ type: core.Input },],
    'formControl': [{ type: core.Input },],
};
var FileControlDirective = /** @class */ (function () {
    function FileControlDirective() {
        this.onChangeEvent = function (value) { };
        this.onBlurEvent = function () { };
    }
    /**
     * @param {?} value
     * @return {?}
     */
    FileControlDirective.prototype.writeValue = function (value) { };
    /**
     * @param {?} eventFunction
     * @return {?}
     */
    FileControlDirective.prototype.registerOnChange = function (eventFunction) {
        this.onChangeEvent = eventFunction;
    };
    /**
     * @param {?} eventFunction
     * @return {?}
     */
    FileControlDirective.prototype.registerOnTouched = function (eventFunction) {
        this.onBlurEvent = eventFunction;
    };
    return FileControlDirective;
}());
FileControlDirective.decorators = [
    { type: core.Directive, args: [{
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
FileControlDirective.ctorParameters = function () { return []; };
var RxReactiveFormsModule = /** @class */ (function () {
    function RxReactiveFormsModule() {
    }
    /**
     * @return {?}
     */
    RxReactiveFormsModule.forRoot = function () { return { ngModule: RxReactiveFormsModule, providers: [] }; };
    return RxReactiveFormsModule;
}());
RxReactiveFormsModule.decorators = [
    { type: core.NgModule, args: [{
                declarations: [RxwebFormDirective, RxwebDynamicFormComponent, HtmlControlTemplateDirective, RxwebControlComponent, ControlHostDirective, RxFormControlDirective, FileControlDirective],
                imports: [common.CommonModule, forms.FormsModule, forms.ReactiveFormsModule],
                providers: [RxFormBuilder, DecimalProvider, common.DecimalPipe],
                exports: [RxwebFormDirective, RxwebDynamicFormComponent, HtmlControlTemplateDirective, RxwebControlComponent, RxFormControlDirective, FileControlDirective]
            },] },
];
/**
 * @nocollapse
 */
RxReactiveFormsModule.ctorParameters = function () { return []; };
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
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
    var /** @type {?} */ rxwebValidator = function (control, target) {
        if (typeof control == STRING)
            defaultContainer.init(target, 0, control, AnnotationTypes.custom, config);
        else
            return ApplicationUtil.configureControl(control, config, AnnotationTypes.custom), validator(control);
        return null;
    };
    return rxwebValidator;
}
var RxwebValidators = /** @class */ (function () {
    function RxwebValidators() {
    }
    return RxwebValidators;
}());
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

exports.RxReactiveFormsModule = RxReactiveFormsModule;
exports.RxFormBuilder = RxFormBuilder;
exports.FormBuilderConfiguration = FormBuilderConfiguration;
exports.alpha = alpha;
exports.alphaNumeric = alphaNumeric;
exports.compare = compare;
exports.contains = contains;
exports.creditCard = creditCard;
exports.digit = digit;
exports.email = email;
exports.hexColor = hexColor;
exports.lowerCase = lowerCase;
exports.maxDate = maxDate;
exports.maxLength = maxLength;
exports.minDate = minDate;
exports.maxNumber = maxNumber;
exports.minLength = minLength;
exports.minNumber = minNumber;
exports.password = password;
exports.pattern = pattern;
exports.propArray = propArray;
exports.propObject = propObject;
exports.prop = prop;
exports.range = range;
exports.required = required;
exports.upperCase = upperCase;
exports.time = time;
exports.url = url;
exports.json = json;
exports.greaterThan = greaterThan;
exports.greaterThanEqualTo = greaterThanEqualTo;
exports.lessThanEqualTo = lessThanEqualTo;
exports.lessThan = lessThan;
exports.choice = choice;
exports.different = different;
exports.numeric = numeric;
exports.even = even;
exports.odd = odd;
exports.factor = factor;
exports.leapYear = leapYear;
exports.allOf = allOf;
exports.oneOf = oneOf;
exports.noneOf = noneOf;
exports.mac = mac;
exports.ascii = ascii;
exports.dataUri = dataUri;
exports.port = port;
exports.latLong = latLong;
exports.extension = extension;
exports.fileSize = fileSize;
exports.endsWith = endsWith;
exports.startsWith = startsWith;
exports.primeNumber = primeNumber;
exports.latitude = latitude;
exports.longitude = longitude;
exports.rule = rule;
exports.file = file;
exports.custom = custom;
exports.ReactiveFormConfig = ReactiveFormConfig;
exports.NumericValueType = NumericValueType;
exports.RxFormControl = RxFormControl;
exports.RxFormGroup = RxFormGroup;
exports.RxwebValidators = RxwebValidators;
exports.ɵc = RxwebDynamicFormComponent;
exports.ɵe = RxwebControlComponent;
exports.ɵb = BaseDirective;
exports.ɵf = ControlHostDirective;
exports.ɵd = HtmlControlTemplateDirective;
exports.ɵa = RxwebFormDirective;
exports.ɵh = BaseValidator;
exports.ɵi = ControlExpressionProcess;
exports.ɵk = FileControlDirective;
exports.ɵg = RxFormControlDirective;
exports.ɵj = DecimalProvider;
exports.ɵl = BaseFormBuilder;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=reactive-form-validators.umd.js.map

export declare class Linq {
    static functionCreator(expression: any): any;
    static IsPassed(jObject: {
        [key: string]: any;
    }, expression: any, parentObject: {
        [key: string]: any;
    }): boolean;
    private static expressionParser(expression);
    private static extractArguments(splitTexts);
    static expressionColumns(expression: any): any[];
}

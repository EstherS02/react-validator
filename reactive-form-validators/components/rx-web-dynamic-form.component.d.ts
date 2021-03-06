import { AfterContentInit, QueryList } from "@angular/core";
import { HtmlControlTemplateDirective } from '../directives/html-control-template.directive';
export declare class RxwebDynamicFormComponent implements AfterContentInit {
    htmlControlTemplates: QueryList<HtmlControlTemplateDirective>;
    ngAfterContentInit(): void;
}

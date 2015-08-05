/// <reference path="bower_components/ho-components/dist/components.d.ts" />
/// <reference path="bower_components/ho-promise/dist/promise.d.ts" />
/// <reference path="bower_components/ho-flux/dist/flux.d.ts" />
declare class Bind extends ho.components.WatchAttribute {
    init(): void;
    protected bindInput(): void;
    protected bindSelect(): void;
    protected bindTextarea(): void;
    protected bindOther(): void;
}
declare class BindBi extends Bind {
    protected bindInput(): void;
    protected bindSelect(): void;
    protected bindTextarea(): void;
    protected bindOther(): void;
    update(): void;
}
declare class Stored extends ho.components.Component {
    stores: Array<string>;
    init(): ho.promise.Promise<any, any>;
}
declare module ho.ui.components {
    import Component = ho.components.Component;
    import Promise = ho.promise.Promise;
    class View extends Component {
        html: string;
        properties: {
            name: string;
            required: boolean;
        }[];
        init(): void;
        viewname: any;
        protected state_changed(data: ho.flux.IRouterData): void;
        protected getHtml(html: string): Promise<string, string>;
        protected loadDynamicRequirements(html: string): Promise<any, any>;
        protected loadDynamicComponents(html: string): Promise<string, string>;
        protected loadDynamicAttributes(html: string): Promise<string, string>;
    }
}

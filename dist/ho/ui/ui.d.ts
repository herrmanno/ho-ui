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
declare class FluxComponent extends ho.components.Component {
    stores: Array<string>;
    actions: Array<string>;
    init(): ho.promise.Promise<any, any>;
    protected initSotres(): ho.promise.Promise<any, any>;
    protected initActions(): ho.promise.Promise<any, any>;
}
declare class View extends ho.components.Component {
    html: string;
    properties: {
        name: string;
        required: boolean;
    }[];
    init(): void;
    viewname: any;
    protected state_changed(data: ho.flux.IRouterData): void;
    protected getHtml(html: string): ho.promise.Promise<string, string>;
    protected loadDynamicRequirements(html: string): ho.promise.Promise<any, any>;
    protected loadDynamicComponents(html: string): ho.promise.Promise<string, string>;
    protected loadDynamicAttributes(html: string): ho.promise.Promise<string, string>;
}
declare module ho.ui {
    function run(options?: IOptions): ho.promise.Promise<any, any>;
    interface IOptions {
        root: string | typeof ho.components.Component;
        router: string | typeof ho.flux.Router;
        map: string | boolean;
        dir: boolean;
        min: boolean;
        process: () => ho.promise.Promise<any, any>;
    }
}

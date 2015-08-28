declare class Bind extends ho.components.WatchAttribute {
    init(): void;
    protected bindInput(): void;
    protected bindSelect(): void;
    protected bindTextarea(): void;
    protected bindOther(): void;
}
declare class RouterActions extends ho.flux.actions.Action {
    go(state: string, data?: any): void;
    go(data: IRouteData): void;
}
declare class Disable extends ho.components.WatchAttribute {
    update(): void;
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
    init(): Promise<any, any>;
    protected initStores(): ho.promise.Promise<any, any>;
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
    protected renderComponent(component: string): void;
    protected renderHTML(html: string): void;
    protected getState(data: IRouterData): IViewState;
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
import Promise = ho.promise.Promise;
interface IState {
    name: string;
    url: string;
    redirect?: string;
    before?: (data: IRouteData) => Promise<any, any>;
    view?: Array<IViewState>;
}
interface IViewState {
    name: string;
    html?: string;
    component?: string;
}
interface IStates {
    states: Array<IState>;
}
/** Data that a Router#go takes */
interface IRouteData {
    state: string;
    args: any;
    extern: boolean;
}
/** Data that Router#changes emit to its listeners */
interface IRouterData {
    state: IState;
    args: any;
    extern: boolean;
}
declare class Router extends ho.flux.Store<IRouterData> {
    protected mapping: Array<IState>;
    actions: string[];
    constructor();
    init(): ho.promise.Promise<any, any>;
    protected onStateChangeRequested(data: IRouteData): void;
    protected onHashChange(): void;
    private setUrl(url);
    private getStateFromName(name);
    private regexFromUrl(url);
    private argsFromUrl(pattern, url);
    private stateFromUrl(url);
    private urlFromState(url, args);
    private equals(o1, o2);
}

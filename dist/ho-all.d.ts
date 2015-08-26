declare module ho.promise {
    class Promise<T, E> {
        constructor(func?: (resolve: (arg: T) => void, reject: (arg: E) => void) => any);
        private data;
        private onResolve;
        private onReject;
        resolved: boolean;
        rejected: boolean;
        done: boolean;
        private ret;
        private set(data?);
        resolve(data?: T): void;
        private _resolve();
        reject(data?: E): void;
        private _reject();
        then(res: (arg1: T) => any, rej?: (arg1: E) => any): Promise<any, any>;
        catch(cb: (arg1: E) => any): void;
        static all(arr: Array<Promise<any, any>>): Promise<any, any>;
        static chain(arr: Array<Promise<any, any>>): Promise<any, any>;
        static create(obj: any): Promise<any, any>;
    }
}

declare module ho.classloader {
    let mapping: {
        [key: string]: string;
    };
    class ClassLoader {
        private conf;
        private cache;
        constructor(c?: ILoaderConfig);
        config(c: ILoaderConfig): void;
        load(arg: ILoadArguments): any;
        protected load_script(arg: ILoadArguments): PromiseOfClasses;
        protected load_function(arg: ILoadArguments): PromiseOfClasses;
        protected load_eval(arg: ILoadArguments): PromiseOfClasses;
        protected getParentName(url: string): ho.promise.Promise<string, any>;
        protected parseParentFromSource(src: string): string;
        resolveUrl(name: string): string;
        protected exists(name: string): boolean;
    }
}
declare module ho.classloader {
    interface ILoadArguments {
        name?: string;
        url?: string;
        parent?: boolean;
        expose?: boolean;
        super?: Array<string>;
    }
    class LoadArguments implements ILoadArguments {
        name: string;
        url: string;
        parent: boolean;
        expose: boolean;
        super: Array<string>;
        constructor(arg: ILoadArguments, resolveUrl: (name: string) => string);
    }
}
declare module ho.classloader {
    enum WarnLevel {
        INFO = 0,
        ERROR = 1,
    }
    interface ILoaderConfig {
        loadType?: LoadType;
        urlTemplate?: string;
        useDir?: boolean;
        useMin?: boolean;
        cache?: boolean;
        warnLevel?: WarnLevel;
    }
    class LoaderConfig implements ILoaderConfig {
        loadType: LoadType;
        urlTemplate: string;
        useDir: boolean;
        useMin: boolean;
        cache: boolean;
        warnLevel: WarnLevel;
        constructor(c?: ILoaderConfig);
    }
}
declare module ho.classloader {
    enum LoadType {
        SCRIPT = 0,
        FUNCTION = 1,
        EVAL = 2,
    }
}
declare module ho.classloader {
    function config(c: ILoaderConfig): void;
    function load(arg: ILoadArguments): PromiseOfClasses;
}
declare module ho.classloader {
    type clazz = Function;
    type PromiseOfClasses = ho.promise.Promise<clazz[], any>;
}
declare module ho.classloader.util {
    function expose(name: string, obj: any, error?: boolean): void;
}
declare module ho.classloader.util {
    function get(path: string, obj?: any): any;
}
declare module ho.classloader.xhr {
    function get(url: string): ho.promise.Promise<string, string>;
}

interface Window {
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    oRequestAnimationFrame: (callback: FrameRequestCallback) => number;
}
declare module ho.watch {
    type Handler = (obj: any, name: string, oldV: any, newV: any, timestamp?: number) => any;
    function watch(obj: any, name: string, handler: Handler): void;
}

/// <reference path="bower_components/ho-promise/dist/promise.d.ts" />
/// <reference path="bower_components/ho-classloader/dist/classloader.d.ts" />
/// <reference path="bower_components/ho-watch/dist/watch.d.ts" />
declare module ho.components {
    /**
        Baseclass for Attributes.
        Used Attributes needs to be specified by Component#attributes property to get loaded properly.
    */
    class Attribute {
        protected element: HTMLElement;
        protected component: Component;
        protected value: string;
        constructor(element: HTMLElement, value?: string);
        protected init(): void;
        name: string;
        update(): void;
        static getName(clazz: typeof Attribute | Attribute): string;
    }
    class WatchAttribute extends Attribute {
        protected r: RegExp;
        constructor(element: HTMLElement, value?: string);
        protected watch(path: string): void;
        protected eval(path: string): any;
    }
}
declare module ho.components {
    import Promise = ho.promise.Promise;
    interface ComponentElement extends HTMLElement {
        component?: Component;
    }
    interface IProprety {
        name: string;
        required?: boolean;
        default?: any;
    }
    /**
        Baseclass for Components
        important: do initialization work in Component#init
    */
    class Component {
        element: ComponentElement;
        original_innerHTML: string;
        html: string;
        style: string;
        properties: Array<string | IProprety>;
        attributes: Array<string>;
        requires: Array<string>;
        children: {
            [key: string]: any;
        };
        constructor(element: HTMLElement);
        name: string;
        getName(): string;
        getParent(): Component;
        _init(): Promise<any, any>;
        /**
            Method that get called after initialization of a new instance.
            Do init-work here.
            May return a Promise.
        */
        init(): any;
        update(): void;
        render(): void;
        private initStyle();
        /**
        *  Assure that this instance has an valid html attribute and if not load and set it.
        */
        private initHTML();
        private initProperties();
        private initChildren();
        private initAttributes();
        private loadRequirements();
        static getComponent(element: ComponentElement): Component;
        static getName(clazz: typeof Component): string;
        static getName(clazz: Component): string;
    }
}
declare module ho.components {
    function run(): ho.promise.Promise<any, any>;
    function register(c: typeof Component | typeof Attribute): void;
}
declare module ho.components.htmlprovider {
    import Promise = ho.promise.Promise;
    class HtmlProvider {
        private cache;
        resolve(name: string): string;
        getHTML(name: string): Promise<string, string>;
    }
    let instance: HtmlProvider;
}
declare module ho.components.registry {
    import Promise = ho.promise.Promise;
    let mapping: {
        [key: string]: string;
    };
    let useDir: boolean;
    class Registry {
        private components;
        private attributes;
        private componentLoader;
        private attributeLoader;
        register(ca: typeof Component | typeof Attribute): void;
        run(): Promise<any, any>;
        initComponent(component: typeof Component, element?: HTMLElement | Document): Promise<any, any>;
        initElement(element: HTMLElement): Promise<any, any>;
        hasComponent(name: string): boolean;
        hasAttribute(name: string): boolean;
        getAttribute(name: string): typeof Attribute;
        loadComponent(name: string): Promise<typeof Component, string>;
        loadAttribute(name: string): Promise<typeof Attribute, string>;
    }
    let instance: Registry;
}
declare module ho.components.renderer {
    class Renderer {
        private r;
        private voids;
        private cache;
        render(component: Component): void;
        private parse(html, root?);
        private renderRepeat(root, models);
        private domToString(root, indent);
        private repl(str, models);
        private evaluate(models, path);
        private evaluateValue(models, path);
        private evaluateValueAndModel(models, path);
        private evaluateExpression(models, path);
        private evaluateFunction(models, path);
        private copyNode(node);
        private isVoid(name);
    }
    let instance: Renderer;
}
declare module ho.components.styler {
    interface IStyler {
        applyStyle(component: Component, css?: string): void;
    }
    let instance: IStyler;
}
declare module ho.components.temp {
    function set(d: any): number;
    function get(i: number): any;
    function call(i: number, ...args: any[]): void;
}

/// <reference path="bower_components/ho-promise/dist/promise.d.ts" />
/// <reference path="bower_components/ho-classloader/dist/classloader.d.ts" />
declare module ho.flux {
    class CallbackHolder {
        protected prefix: string;
        protected lastID: number;
        protected callbacks: {
            [key: string]: Function;
        };
        register(callback: Function, self?: any): string;
        unregister(id: any): void;
    }
}
declare module ho.flux {
    interface IAction {
        type: string;
        data?: any;
    }
    class Dispatcher extends CallbackHolder {
        private isPending;
        private isHandled;
        private isDispatching;
        private pendingPayload;
        waitFor(...ids: Array<number>): void;
        dispatch(action: IAction): void;
        private invokeCallback(id);
        private startDispatching(payload);
        private stopDispatching();
    }
}
declare module ho.flux {
    import Promise = ho.promise.Promise;
    let DISPATCHER: Dispatcher;
    let STORES: registry.Registry;
    let ACTIONS: actions.Registry;
    let dir: boolean;
    function run(router?: any): Promise<any, any>;
}
declare module ho.flux {
    import Promise = ho.promise.Promise;
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
    class Router extends Store<IRouterData> {
        private mapping;
        init(): Promise<any, any>;
        go(state: string, data?: any): void;
        go(data: IRouteData): void;
        private initStates();
        private getStateFromName(name);
        protected onStateChangeRequested(data: IRouteData): void;
        private onHashChange();
        private setUrl(url);
        private regexFromUrl(url);
        private argsFromUrl(pattern, url);
        private stateFromUrl(url);
        private urlFromState(url, args);
        private equals(o1, o2);
    }
}
declare module ho.flux {
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
        html: string;
    }
    interface IStates {
        states: Array<IState>;
    }
}
declare module ho.flux {
    class Store<T> extends CallbackHolder {
        static handlerMap: any;
        static on: (type: any) => (target: any, key: any, desc: any) => any;
        protected data: T;
        private id;
        private handlers;
        protected actions: string[];
        constructor();
        init(): ho.promise.Promise<any, any>;
        name: string;
        register(callback: (data: T) => void, self?: any): string;
        protected on(type: string, func: Function): void;
        protected handle(action: IAction): void;
        protected changed(): void;
    }
}
declare module ho.flux.actions {
    class Action {
        name: string;
    }
}
declare module ho.flux.actions {
    import Promise = ho.promise.Promise;
    let mapping: {
        [key: string]: string;
    };
    let useDir: boolean;
    class Registry {
        private actions;
        private actionLoader;
        register(action: Action): Action;
        get(actionClass: string): Store<any>;
        get<T extends Action>(actionClass: {
            new (): T;
        }): T;
        loadAction(name: string): Promise<Action, string>;
    }
}
declare module ho.flux.registry {
    import Promise = ho.promise.Promise;
    let mapping: {
        [key: string]: string;
    };
    let useDir: boolean;
    class Registry {
        private stores;
        private storeLoader;
        register(store: Store<any>): Store<any>;
        get(storeClass: string): Store<any>;
        get<T extends Store<any>>(storeClass: {
            new (): T;
        }): T;
        loadStore(name: string, init?: boolean): Promise<Store<any>, string>;
    }
}
declare module ho.flux.stateprovider {
    import Promise = ho.promise.Promise;
    interface IStateProvider {
        useMin: boolean;
        resolve(): string;
        getStates(name?: string): Promise<IStates, string>;
    }
    let instance: IStateProvider;
}

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
declare class Disable extends ho.components.WatchAttribute {
    update(): void;
}
declare class FluxComponent extends ho.components.Component {
    stores: Array<string>;
    actions: Array<string>;
    init(): ho.promise.Promise<any, any>;
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

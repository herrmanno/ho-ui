/// <reference path="../../../bower_components/ho-promise/dist/d.ts/promise.d.ts" />
/// <reference path="../../../bower_components/ho-components/dist/d.ts/components.d.ts" />
/// <reference path="../../../bower_components/ho-flux/dist/d.ts/flux.d.ts" />
/// <reference path="../../../bower_components/ho-flux/dist/d.ts/store.d.ts" />
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
        protected loadDynamicRequirements(html: string): Promise<string, string>;
    }
}

module ho.ui {

	export function run(options:IOptions=new Options()): ho.promise.Promise<any, any> {
		options = new Options(options);

		let p = options.process()
		.then(ho.components.run.bind(ho.components, undefined))
		.then(()=> {
			return ho.flux.STORES.get(ho.flux.Router).init();
		})
		//.then(ho.flux.run.bind(ho.flux, undefined));

		return p;
	}

	let components = [
		"FluxComponent",
		"View",
	];

	let attributes = [
		"Bind",
		"BindBi",
		"Disable"
	];

	let stores = [
		"Router"
	];

	let actions = [
		"RouterActions"
	];

	export interface IOptions {
		root: string | typeof ho.components.Component; //Root component to register;
		router: string | typeof ho.flux.Router; //alternative router class
		map: string | boolean; // if set, map all ho.ui components in the componentprovider to the given url
		dir: boolean; // set usedir in ho.components
		min: boolean;
		process: ()=>ho.promise.Promise<any, any>;
	}

	class Options implements IOptions {
		root: string | typeof ho.components.Component = "App"
		router: string | typeof ho.flux.Router = ho.flux.Router;
		map: string | boolean = true;
		mapDefault = "bower_components/ho-ui/dist/";
		dir = true;
		min = false;

		constructor(opt: IOptions = <IOptions>{}) {
			for(var key in opt) {
				this[key] = opt[key];
			}
		}

		process(): ho.promise.Promise<any, any>{
			return ho.promise.Promise.create(this.processDir())
			.then(this.processMin.bind(this))
			.then(this.processMap.bind(this))
			.then(this.processRouter.bind(this))
			.then(this.processRoot.bind(this))
		}

		protected processRoot() {
			let self = this;
			return new ho.promise.Promise((resolve, reject) => {
				if(typeof self.root === 'string') {
					ho.components.registry.instance.loadComponent(<string>self.root)
					.then(resolve)
					.catch(reject);

				} else {
					ho.components.registry.instance.register(<typeof ho.components.Component>self.root)
					resolve(null);
				}
			});
		}

		protected processRouter(): ho.promise.Promise<any, any> {
			let self = this;
			return new ho.promise.Promise((resolve, reject) => {
				if(typeof self.router === 'string') {
					ho.flux.STORES.loadStore(<string>self.router, false)
					.then(r => resolve(r))
					.catch(reject);

				} else {
					resolve(new (<typeof ho.flux.Router>self.router)());
				}
			})
			.then((r: ho.flux.Router) => {
				ho.flux.Router = <typeof ho.flux.Router>r.constructor;
				ho.flux.STORES.register(r);
			});

		}

		protected processMap(): void {
			if(typeof this.map === 'boolean') {
				if(!this.map)
					return;
				else
					this.map = this.mapDefault;
			}

			components.forEach(c => {
				ho.classloader.mapping[c] = this.map + 'components/' + c + '/' + c + '.js';
			});

			attributes.forEach(a => {
				ho.classloader.mapping[a] = this.map + 'attributes/' + a + '/' + a + '.js';
			});

			stores.forEach(s => {
				ho.classloader.mapping[s] = this.map + 'stores/' + s + '/' + s + '.js';
			});

			actions.forEach(a => {
				ho.classloader.mapping[a] = this.map + 'actions/' + a + '/' + a + '.js';
			});
		}

		protected processDir(): void {
			ho.components.registry.useDir = this.dir;
			ho.flux.registry.useDir = this.dir;
			ho.flux.actions.useDir = this.dir;
		}

		protected processMin(): void {
			/*
			ho.components.componentprovider.instance.useMin = this.min;
			ho.components.attributeprovider.instance.useMin = this.min;
			ho.flux.storeprovider.instance.useMin = this.min;
			*/
		}
	}

}

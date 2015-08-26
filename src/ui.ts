module ho.ui {

	export function run(options:IOptions=new Options()): ho.promise.Promise<any, any> {
		options = new Options(options);

		let p = options.process()
		.then(ho.components.run)
		.then(ho.flux.run);

		return p;
	}

	let components = [
		"FluxComponent",
		"View",
	];

	let attributes = [
		"Bind",
		"BindBi",
	];

	let stores = [

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
			return new ho.promise.Promise((resolve, reject) => {
				if(typeof this.root === 'string') {
					ho.components.registry.instance.loadComponent(<string>this.root)
					.then(resolve)
					.catch(reject);

				} else {
					ho.components.registry.instance.register(<typeof ho.components.Component>this.root)
					resolve(null);
				}
			});
		}

		protected processRouter(): ho.promise.Promise<any, any> {
			return new ho.promise.Promise((resolve, reject) => {
				if(typeof this.router === 'string') {
					ho.flux.STORES.loadStore(<string>this.router, false)
					.then(r => resolve(r))
					.catch(reject);

				} else {
					resolve(new (<typeof ho.flux.Router>this.router)());
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
				//ho.components.registry.mapping[c] = this.map + 'components/' + c + '/' + c + '.js';
				ho.classloader.mapping[c] = this.map + 'components/' + c + '/' + c + '.js';
			});

			attributes.forEach(a => {
				//ho.components.registry.mapping[a] = this.map + 'attributes/' + a + '/' + a + '.js';
				ho.classloader.mapping[a] = this.map + 'attributes/' + a + '/' + a + '.js';
			});

			stores.forEach(s => {
				//ho.flux.registry.mapping[s] = this.map + 'stores/' + s + '/' + s + '.js';
				ho.classloader.mapping[s] = this.map + 'stores/' + s + '/' + s + '.js';
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

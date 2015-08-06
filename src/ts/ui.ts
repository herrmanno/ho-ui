module ho.ui {

	export function run(options:IOptions=new Options()): ho.promise.Promise<any, any> {
		let p = options.process()
		.then(ho.components.run)
		.then(ho.flux.run);

		return p;
	}

	let components = [
		"Stored",
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
		process: ()=>ho.promise.Promise<any, any>;
	}

	class Options implements IOptions {
		root: string | typeof ho.components.Component = "App"
		router: string | typeof ho.flux.Router = ho.flux.Router;
		map: string | boolean = true;
		mapDefault = "bower_components/ho-ui/dist/";
		dir = true;

		process(): ho.promise.Promise<any, any>{
			return ho.promise.Promise.create(this.processDir())
			.then(this.processMap.bind(this))
			.then(this.processRouter.bind(this))
			.then(this.processRoot.bind(this))
		}

		protected processRoot() {
			return new ho.promise.Promise((resolve, reject) => {
				if(typeof this.root === 'string') {
					ho.components.registry.instance.loadComponent(<string>this.root)
					.then(c => {
						ho.components.registry.instance.register(c);
					})
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
					ho.flux.STORES.loadStore(<string>this.router)
					.then(resolve)
					.catch(reject);

				} else {
					resolve(new (<typeof ho.flux.Router>this.router)());
				}
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
				ho.components.componentprovider.mapping[c] = this.map + 'components/' + c + '/' + c + '.js';
			});

			attributes.forEach(a => {
				ho.components.attributeprovider.mapping[a] = this.map + 'attributes/' + a + '/' + a + '.js';
			});

			stores.forEach(s => {
				ho.flux.storeprovider.mapping[s] = this.map + 'stores/' + s + '/' + s + '.js';
			});
		}

		protected processDir(): void {
			ho.components.dir = this.dir;
		}
	}

}

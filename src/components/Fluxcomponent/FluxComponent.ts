class FluxComponent extends ho.components.Component {
	public stores: Array<string> = [];
	public actions: Array<string> = [];

	init() {
		let p_super = ho.promise.Promise.create(super.init());

		let p_stores = this.initStores();

		let p_actions = this.initActions();

		let promises = [].concat(p_super, p_stores, p_actions);

		return ho.promise.Promise.all(promises);
	}

	protected initStores(): ho.promise.Promise<any, any> {
		let self = this;
		let promises = this.stores.map(sName => {
			return ho.flux.STORES.loadStore(sName)
			.then(s => {
				self.stores[sName] = s;
			})
		})

		return ho.promise.Promise.all(promises);
	}

	protected initActions(): ho.promise.Promise<any, any> {
		let self = this;
		let promises = this.actions.map(aName => {
			return ho.flux.ACTIONS.loadAction(aName)
			.then(a => {
				self.actions[aName] = a;
			})
		})

		return ho.promise.Promise.all(promises);
	}
}

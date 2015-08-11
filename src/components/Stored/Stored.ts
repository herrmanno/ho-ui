class Stored extends ho.components.Component {
	public stores: Array<string> = [];

	init() {
		let promises = this.stores.map(s => {
			return ho.flux.STORES.loadStore(s);
		});
		return ho.promise.Promise.all(promises);
	}
}

class Disable extends ho.components.WatchAttribute {

	update() {
		let disabled = this.eval(this.value);
		(<any>this.element).disabled = disabled;
	}
}

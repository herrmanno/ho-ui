/// <reference path="../../../../bower_components/ho-components/dist/components.d.ts"/>

class Bind extends ho.components.WatchAttribute {

	init() {
		switch(this.element.tagName.toUpperCase()) {
			case 'INPUT':
				this.bindInput();
				break;
			case 'SELECT':
				this.bindSelect();
				break;
			case 'TEXTAREA':
				this.bindTextarea();
				break;
			default:
				this.bindOther();
		}
	}

	protected bindInput() {
		this.element.onkeyup = e => {
			this.eval(`${this.value} = '${(<HTMLInputElement>this.element).value}'`);
		}
	}

	protected bindSelect() {
		this.element.onchange = e => {
			this.eval(`${this.value} = '${(<HTMLSelectElement>this.element).value}'`);
		}
	}

	protected bindTextarea() {
		this.element.onkeyup = e => {
			this.eval(`${this.value} = '${(<HTMLTextAreaElement>this.element).value}'`);
		}
	}

	protected bindOther() {
		throw `Bind: unsupported element ${this.element.tagName}`;
	}

}

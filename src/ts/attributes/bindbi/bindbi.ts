/// <reference path="../bind/bind.ts"/>

class BindBi extends Bind {


	protected bindInput() {
		super.bindInput();
		this.bindOther();
	}

	protected bindSelect() {
		super.bindSelect();
		this.bindOther();
	}

	protected bindTextarea() {
		super.bindTextarea();
		this.bindOther();
	}

	protected bindOther() {
		this.watch(this.value);
	}

	public update() {
		let val = this.eval(this.value);
		
		if(this.element.hasAttribute('value'))
			(<any>this.element).value = val;
		else
			this.element.innerHTML = val;
	}

}

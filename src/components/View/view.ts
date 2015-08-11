/// <reference path="../../../../bower_components/ho-promise/dist/promise.d.ts"/>
/// <reference path="../../../../bower_components/ho-components/dist/components.d.ts"/>
/// <reference path="../../../../bower_components/ho-flux/dist/flux.d.ts"/>

class View extends ho.components.Component {

	html = "";

	properties = [
		{ name: 'viewname', required: true }
	];

	init() {
		ho.flux.STORES.get(ho.flux.Router).register(this.state_changed, this);
	}

	get viewname() {
		return this.properties['viewname'];
	}

	protected state_changed(data: ho.flux.IRouterData): void {
	    let html: string = null;
		try {
			html = data.state.view.filter((v) => {
	      		return v.name === this.viewname;
		    })[0].html;
		} catch(e) {
			html = null;
		}

	    this.getHtml(html)
  		.then(function(h) {
	      	html = h;
	      	return this.loadDynamicRequirements(html);
	    }.bind(this))
      	.then(function() {
	      	this.html = false;
	      	this.element.innerHTML = html;
	      	this.render();
	    }.bind(this));
	}

		protected getHtml(html: string): ho.promise.Promise<string, string> {
		if (typeof html === 'undefined')
	      	return ho.promise.Promise.create(null);
	    else if (html.slice(-5) !== '.html')
	      	return ho.promise.Promise.create(html);
	    else return new ho.promise.Promise((resolve, reject) => {

	      	let xmlhttp = new XMLHttpRequest();
	      	xmlhttp.onreadystatechange = function() {
	        	if (xmlhttp.readyState == 4) {
		          	var resp = xmlhttp.responseText;
		          	if (xmlhttp.status == 200) {
		            	resolve(resp);
		          	} else {
		            	reject(resp);
		          	}
	        	}
	      	};

	      	xmlhttp.open('GET', html, true);
	      	xmlhttp.send();

		});
	}

	protected loadDynamicRequirements(html: string): ho.promise.Promise<any, any> {
		return ho.promise.Promise.all([this.loadDynamicComponents(html), this.loadDynamicAttributes(html)]);
	}

	protected loadDynamicComponents(html: string): ho.promise.Promise<string, string> {
	    let requirements = html.match(/<!--\s*requires?="(.+)"/);
	    if (requirements !== null)
	      	requirements = requirements[1].split(",").map((r) => { return r.trim() });
	    else
	      	requirements = [];

	    let Registry = ho.components.registry.instance;

	    let promises = requirements
      	.filter((req) => {
	      	return !Registry.hasComponent(req);
	    })
	    .map((req) => {
	    	return Registry.loadComponent(req);
	    });

	    return ho.promise.Promise.all(promises);
	}

	protected loadDynamicAttributes(html: string): ho.promise.Promise<string, string> {
	    let attributes = html.match(/<!--\s*attributes?="(.+)"/);
	    if (attributes !== null)
	      	attributes = attributes[1].split(",").map((a) => { return a.trim() });
	    else
	      	attributes = [];

	    let Registry = ho.components.registry.instance;

	    let promises = attributes
      	.filter((attr) => {
	      	return !Registry.hasAttribute(attr);
	    })
	    .map((attr) => {
	    	return Registry.loadAttribute(attr);
	    });

	    return ho.promise.Promise.all(promises);
	}
}

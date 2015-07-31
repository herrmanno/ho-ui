/// <reference path="../../../bower_components/ho-promise/dist/d.ts/promise.d.ts"/>
/// <reference path="../../../bower_components/ho-components/dist/d.ts/components.d.ts"/>
/// <reference path="../../../bower_components/ho-flux/dist/d.ts/flux.d.ts"/>
/// <reference path="../../../bower_components/ho-flux/dist/d.ts/store.d.ts"/>

module ho.ui.components {

	import Component = ho.components.Component
	import Flux = ho.flux;
	import Promise = ho.promise.Promise;

	export class View extends Component {

		html = "";

		properties = [
			{ name: 'viewname', required: true }
		];

		init() {
			Flux.STORES.get(Flux.Router).register(this.state_changed, this);
		}

		get viewname() {
			return this.properties['viewname'];
		}

  		protected state_changed(data: ho.flux.IRouterData): void {
		    let html = data.state.view.filter((v) => {
	      		return v.name === this.viewname;
		    })[0].html;

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

  		protected getHtml(html: string): Promise<string, string> {
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

		protected loadDynamicRequirements(html: string): Promise<string, string> {
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

		    return Promise.all(promises);
		}
	}
}


import Promise = ho.promise.Promise;

interface IState {
	name: string;
	url: string;
	redirect?: string;
	before?: (data: IRouteData)=>Promise<any, any>;
	view?: Array<IViewState>;
}

interface IViewState {
    name: string;
	html?: string;
	component?: string;
}

interface IStates {
    states: Array<IState>;
}


/** Data that a Router#go takes */
interface IRouteData {
    state: string;
	args: any;
	extern: boolean;
}

/** Data that Router#changes emit to its listeners */
interface IRouterData {
    state: IState;
	args: any;
	extern: boolean;
}

class Router extends ho.flux.Store<IRouterData> {

	protected mapping:Array<IState> = null;
	actions = ['RouterActions'];

	constructor() {
		super();
		window.onhashchange = this.onHashChange.bind(this);
	}

	public init(): ho.promise.Promise<any, any> {
		let self = this;

		return super.init()
		.then(() => {
			self.onHashChange();
		});
	}

	//@ho.flux.Store.on('STATE') ERRROR: Method gets bound with 'this=Router' but mapping gets defined in subclass
	protected onStateChangeRequested(data: IRouteData): void {
		//get requested state
		let state = this.getStateFromName(data.state);
		let url = this.urlFromState(state.url, data.args);

		//current state and args equals requested state and args -> return
		if(
			this.data &&
			this.data.state &&
			this.data.state.name === data.state &&
			this.equals(this.data.args, data.args) &&
			url === window.location.hash.substr(1)
		) {
			return;
		}



		//requested state has an redirect property -> call redirect state
		if(!!state.redirect) {
			state = this.getStateFromName(state.redirect);
		}


		let prom = typeof state.before === 'function' ? state.before(data) : Promise.create(undefined);
		prom
		.then(function() {

			//does the state change request comes from extern e.g. url change in browser window ?
			let extern = !! data.extern;

			this.data = {
				state: state,
				args: data.args,
				extern: extern,
			};

			//------- set url for browser
			var url = this.urlFromState(state.url, data.args);
			this.setUrl(url);

			this.changed();

		}.bind(this),
		function(data) {
			this.onStateChangeRequested(data);
		}.bind(this));

	}

	protected onHashChange(): void {
		let s = this.stateFromUrl(window.location.hash.substr(1));

		let data = {
			state: s.state,
			args: s.args,
			extern: true
		};

		ho.flux.ACTIONS.get(RouterActions).go(data);

	}

	private setUrl(url: string): void {
		if(window.location.hash.substr(1) === url)
			return;

		let l = window.onhashchange;
		window.onhashchange = null;
		window.location.hash = url;
		window.onhashchange = l;
	}

	private getStateFromName(name: string): IState {
		return this.mapping.filter((s)=>{
			return s.name === name
		})[0];
	}

	private regexFromUrl(url: string): string {
		var regex = /:([\w]+)/;
		while(url.match(regex)) {
			url = url.replace(regex, "([^\/]+)");
		}
		return url+'$';
	}

	private argsFromUrl(pattern: string, url: string): any {
		let r = this.regexFromUrl(pattern);
		let names = pattern.match(r).slice(1);
		let values = url.match(r).slice(1);

		let args = {};
		names.forEach(function(name, i) {
			args[name.substr(1)] = values[i];
		});

		return args;
	}

	private stateFromUrl(url: string): IRouteData {
		var s = void 0;
		this.mapping.forEach((state: IState) => {
			if(s)
				return;

			var r = this.regexFromUrl(state.url);
			if(url.match(r)) {
				var args = this.argsFromUrl(state.url, url);
				s = {
					"state": state.name,
					"args": args,
					"extern": false
				};
			}
		});

		if(!s)
			throw "No State found for url "+url;

		return s;
	}

	private urlFromState(url: string, args: any): string {
		let regex = /:([\w]+)/;
		while(url.match(regex)) {
			url = url.replace(regex, function(m) {
				return args[m.substr(1)];
			});
		}
		return url;
	}

	private equals(o1: any, o2: any) : boolean {
		return JSON.stringify(o1) === JSON.stringify(o2);
	}

}

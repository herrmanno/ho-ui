class RouterActions extends ho.flux.actions.Action {

	public go(state: string, data?: any): void
	public go(data: IRouteData): void
	public go(data: IRouteData | string, args?: any): void {

		let _data: IRouteData = {
			state: undefined,
			args: undefined,
			extern: false
		};

		if(typeof data === 'string') {
			_data.state = data;
			_data.args = args;
		} else {
			_data.state = data.state;
			_data.args = data.args;
			_data.extern = typeof data.extern === 'boolean' ? data.extern : false;
		}

		ho.flux.DISPATCHER.dispatch({
			type: 'STATE',
			data: _data
		});
	}
}

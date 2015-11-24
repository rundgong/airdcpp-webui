import React from 'react';

import TableActions from 'actions/TableActions';

const FilterBox = React.createClass({
	propTypes: {
		viewUrl: React.PropTypes.string.isRequired,
	},

	getInitialState: function () {
		return { value: '' };
	},

	componentWillMount: function () {
		this._timer = null;
	},

	componentWillUnmount: function () {
		clearTimeout(this._timer);
	},

	handleChange: function (event) {
		this.setState({ value: event.target.value });

		clearTimeout(this._timer);

		this._timer = setTimeout(() => {
			this._timer = null;
			TableActions.filter(this.props.viewUrl, this.state.value);
		}, 200);
	},

	render: function () {
		return (
			<div className="ui input filter" onChange={this.handleChange} value={this.state.value}>
				<input placeholder="Filter..." type="text"/>
			</div>
		);
	}
});

export default FilterBox;
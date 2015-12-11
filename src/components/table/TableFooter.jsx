import React from 'react';

import TextFilter from './TextFilter';


const CountInfo = ({ store }) => {
	let ret = store.totalCount;
	if (store.totalCount !== store.rowCount) {
		ret = store.rowCount + '/' + store.totalCount;
	}

	return (
		<div className="count-info">
			<i className="filter icon"/>
			{ ret }
		</div>
	);
};

const TableFooter = ({ store, customFilter, footerData }) => {
	let clonedFilter = null;
	if (customFilter) {
		clonedFilter = React.cloneElement(customFilter, { 
			viewUrl: store.viewUrl, 
		});
	}

	return (
		<div className="table-footer">
			{ footerData }
			<div className="filter item">
				<TextFilter 
					viewUrl={ store.viewUrl }
				/>
				{ clonedFilter }
				<CountInfo store={ store }/>
			</div>
		</div>
	);
};

TableFooter.propTypes = {
	customFilter: React.PropTypes.node,
	footerData: React.PropTypes.node,
	store: React.PropTypes.object.isRequired,
};

export default TableFooter;
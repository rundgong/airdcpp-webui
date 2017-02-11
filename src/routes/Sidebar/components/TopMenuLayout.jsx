import React from 'react';
import BrowserUtils from 'utils/BrowserUtils';

import ActionButton from 'components/ActionButton';
import Dropdown from 'components/semantic/Dropdown';
import MenuIcon from 'components/menu/MenuIcon';


const SessionDropdown = ({ sessionMenuItems, newButton, unreadInfoStore, closeAction, listActionMenuGetter }) => {
	// Don't add nesting for items to preserve Semantic UI's CSS
	// There should always be something to show if we are rendering the menu
	const hideStyle = { display: 'none' };

	const sessionMenuStyle = sessionMenuItems.length === 0 ? hideStyle : null;

	const listActionMenu = listActionMenuGetter();
	return (
		<Dropdown triggerIcon={ <MenuIcon urgencies={ unreadInfoStore ? unreadInfoStore.getTotalUrgencies() : null } />}>
		 	<div className="header" style={ newButton ? null : hideStyle }>
		 		New
		 	</div>
		 	{ newButton }
			<div className="ui divider" style={ newButton ? sessionMenuStyle : hideStyle }/>
			<div className="header" style={ sessionMenuStyle }>
				Current sessions
			</div>
			{ sessionMenuItems }
			{ listActionMenu ? <div className="ui divider"/> : null }
			{ listActionMenu }
		</Dropdown>
	);
};

const CloseButton = ({ closeAction, activeItem }) => {
	if (!activeItem || BrowserUtils.useMobileLayout()) {
		return null;
	}

	return (
		<ActionButton 
			className="basic small item close-button"
			action={ closeAction } 
			itemData={ activeItem }
			icon="grey remove"
		/>
	);
};

const SessionItemHeader = ({ itemHeaderIcon, itemHeaderTitle, activeItem, actionMenu }) => (
	<div className="session-header">
		{ itemHeaderIcon }
		{ itemHeaderTitle }
	</div>
);

const TopMenuLayout = ({ children, ...props }) => (
	<div className="session-container vertical">
		<div className="ui main menu menu-bar">
			<div className="content-left">
				<SessionDropdown { ...props }/>
				<SessionItemHeader { ...props }/>
			</div>
			<CloseButton { ...props }/>
		</div>

		<div className="session-layout">
			{ children }
		</div>
	</div>
);

TopMenuLayout.propTypes = {
	itemHeaderTitle: React.PropTypes.node.isRequired,
	itemHeaderIcon: React.PropTypes.node.isRequired,
	activeItem: React.PropTypes.object,
	newButton: React.PropTypes.node,
	sessionMenuItems: React.PropTypes.array.isRequired,
	closeAction: React.PropTypes.func.isRequired,
	listActionMenuGetter: React.PropTypes.func.isRequired,
};

export default TopMenuLayout;

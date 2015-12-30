'use strict';
import React from 'react';

import Checkbox from 'components/semantic/Checkbox';
import History from 'utils/History';
import ValueFormat from 'utils/ValueFormat';

import ChatLayout from 'routes/Sidebar/components/chat/ChatLayout';

import HubMessageStore from 'stores/HubMessageStore';
import HubActions from 'actions/HubActions';

import AccessConstants from 'constants/AccessConstants';
import ChatSessionDecorator from 'decorators/ChatSessionDecorator';
import { RedirectPrompt, PasswordPrompt, HubActionPrompt } from './HubPrompt';

import '../style.css';


const GridItem = ({ label, text }) => (
	<div className="grid-item">
		<div className="item-inner">
			{ text }
		</div>
	</div>
);

const getStorageKey = (props) => {
	return 'view_userlist_' + props.item.id;
};

const checkList = (props) => {
	const showList = sessionStorage.getItem(getStorageKey(props));
	if (showList) {
		History.pushSidebar(props.location, '/hubs/session/' + props.item.id + '/users');
	}
};

const HubSession = React.createClass({
	componentWillMount() {
		checkList(this.props);
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.item.id !== this.props.item.id) {
			checkList(nextProps);
		}
	},


	handleSend(message) {
		HubActions.sendMessage(this.props.item.id, message);
	},

	getMessage() {
		const { item } = this.props;
		const connectState = item.connect_state.id;

		if (connectState === 'password') {
			return (
				<HubActionPrompt 
					title="Password required"
					icon="lock"
					content={ <PasswordPrompt hub={ item }/> }
				/>
			);
		}

		if (connectState === 'redirect') {
			return (
				<HubActionPrompt 
					title="Redirect requested"
					icon="forward mail"
					content={ <RedirectPrompt hub={ item }/> }
				/>
			);
		}

		return null;
	},

	onClickUsers() {
		let newUrl = '/hubs/session/' + this.props.item.id;
		if (!this.props.children) {
			newUrl += '/users';
		}

		sessionStorage.setItem(getStorageKey(this.props), !this.props.children);
		History.pushSidebar(this.props.location, newUrl);
	},

	render() {
		const { item } = this.props;
		const users = item.identity.user_count;
		const shared = item.identity.share_size;

		return (
			<div className="hub chat session">
				{ this.getMessage() }
				{ this.props.children ? React.cloneElement(this.props.children, { item }) : (
					<ChatLayout
						messages={this.props.messages}
						handleSend={this.handleSend}
						location={this.props.location}
						chatAccess={ AccessConstants.HUBS_SEND }
					/>
				) }
				<div className="ui footer divider"/>
				<div className="session-footer">
					<div className="info-grid ui">
						<GridItem text={ users + ' users'}/>
						{ window.innerWidth > 700 ? <GridItem text={ ValueFormat.formatSize(shared) + ' (' + ValueFormat.formatSize(shared / users) + '/user)' }/> : null }
						<div className="userlist-button">
							<Checkbox
								className=""
								type="toggle"
								caption="User list"
								onChange={ this.onClickUsers }
								checked={ this.props.children ? true : false }
							/>
						</div>
					</div>
				</div>
			</div>
		);
	},
});

export default ChatSessionDecorator(HubSession, HubMessageStore, HubActions);
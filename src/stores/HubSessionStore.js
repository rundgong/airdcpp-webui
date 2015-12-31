import Reflux from 'reflux';

import HubActions from 'actions/HubActions';
import HubConstants from 'constants/HubConstants';

import { HubMessageUrgencies } from 'constants/UrgencyConstants';

import SocketSubscriptionDecorator from 'decorators/SocketSubscriptionDecorator';
import SessionStoreDecorator from 'decorators/store/SessionStoreDecorator';

import AccessConstants from 'constants/AccessConstants';


const HubSessionStore = Reflux.createStore({
	getInitialState: function () {
		return this.getSessions();
	},

	hasConnectedHubs() {
		return this.getSessions().find(session => session.connect_state.id === 'connected');
	},

	onSocketConnected(addSocketListener) {
		addSocketListener(HubConstants.HUB_MODULE_URL, HubConstants.SESSION_CREATED, this._onSessionCreated);
		addSocketListener(HubConstants.HUB_MODULE_URL, HubConstants.SESSION_REMOVED, this._onSessionRemoved);
		addSocketListener(HubConstants.HUB_MODULE_URL, HubConstants.SESSION_UPDATED, this._onSessionUpdated);
	},
});


export default SessionStoreDecorator(SocketSubscriptionDecorator(HubSessionStore, AccessConstants.HUBS_VIEW), HubActions, HubMessageUrgencies)
;

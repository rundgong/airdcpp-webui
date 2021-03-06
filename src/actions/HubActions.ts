'use strict';
//@ts-ignore
import Reflux from 'reflux';
import HubConstants from 'constants/HubConstants';
import SocketService from 'services/SocketService';

import History from 'utils/History';
import NotificationActions from 'actions/NotificationActions';

import ChatActionDecorator from './decorators/ChatActionDecorator';
import SessionActionDecorator from './decorators/SessionActionDecorator';

import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';
import { Location } from 'history';


const showFav = (hub: API.Hub) => !hub.favorite_hub;


const HubActionConfig: UI.ActionConfigList<API.Hub> = [
  { 'createSession': { 
    asyncResult: true,
    access: API.AccessEnum.HUBS_EDIT, 
  } },
  { 'redirect': { 
    asyncResult: true,
    access: API.AccessEnum.HUBS_EDIT,
  } },
  { 'password': { 
    asyncResult: true,
    access: API.AccessEnum.HUBS_EDIT,
  } },
  { 'reconnect': { 
    asyncResult: true,
    displayName: 'Reconnect',
    access: API.AccessEnum.HUBS_EDIT, 
    icon: IconConstants.REFRESH,
  } },
  { 'favorite': { 
    asyncResult: true,
    access: API.AccessEnum.HUBS_EDIT, 
    displayName: 'Add to favorites', 
    icon: IconConstants.FAVORITE,
    filter: showFav,
  } },
];

const HubActions = Reflux.createActions(HubActionConfig);

HubActions.password.listen(function (
  this: UI.AsyncActionType<API.Hub>, 
  hub: API.Hub, 
  password: string
) {
  let that = this;
  SocketService.post(`${HubConstants.SESSIONS_URL}/${hub.id}/password`, { password: password })
    .then(that.completed.bind(that, hub))
    .catch(that.failed.bind(that, hub));
});

HubActions.redirect.listen(function (this: UI.AsyncActionType<API.Hub>, hub: API.Hub) {
  let that = this;
  SocketService.post(`${HubConstants.SESSIONS_URL}/${hub.id}/redirect`)
    .then(that.completed.bind(that, hub))
    .catch(that.failed.bind(that, hub));
});

HubActions.favorite.listen(function (this: UI.AsyncActionType<API.Hub>, hub: API.Hub) {
  let that = this;
  SocketService.post(`${HubConstants.SESSIONS_URL}/${hub.id}/favorite`)
    .then(that.completed.bind(that, hub))
    .catch(that.failed.bind(that, hub));
});

HubActions.favorite.completed.listen(function (hub: API.Hub) {
  NotificationActions.success({ 
    title: hub.identity.name,
    message: 'The hub has been added in favorites',
  });		
});

HubActions.favorite.failed.listen(function (hub: API.Hub, error: ErrorResponse) {
  NotificationActions.error({ 
    title: hub.identity.name,
    message: error.message,
  });		
});

HubActions.reconnect.listen(function (this: UI.AsyncActionType<API.Hub>, hub: API.Hub) {
  let that = this;
  SocketService.post(`${HubConstants.SESSIONS_URL}/${hub.id}/reconnect`)
    .then(that.completed)
    .catch(this.failed);
});

HubActions.createSession.listen(function (
  this: UI.AsyncActionType<API.Hub>,
  location: Location, 
  hubUrl: string, 
  sessionStore: any
) {
  const session = sessionStore.getSessionByUrl(hubUrl);
  if (session) {
    this.completed(location, session);
    return;
  }

  let that = this;
  SocketService.post(HubConstants.SESSIONS_URL, {
    hub_url: hubUrl,
  })
    .then(that.completed.bind(that, location))
    .catch(that.failed);
});

HubActions.createSession.completed.listen(function (location: Location, session: API.Hub) {
  History.push({
    pathname: `/hubs/session/${session.id}`, 
    state: {
      pending: true
    },
  });
});

HubActions.createSession.failed.listen(function (error: ErrorResponse) {
  NotificationActions.apiError('Failed to create hub session', error);
});

export default SessionActionDecorator(
  ChatActionDecorator(
    HubActions, 
    HubConstants.SESSIONS_URL, 
    API.AccessEnum.HUBS_EDIT
  ), 
  HubConstants.SESSIONS_URL, 
  API.AccessEnum.HUBS_EDIT
);

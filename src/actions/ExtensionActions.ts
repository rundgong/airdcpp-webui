'use strict';
//@ts-ignore
import Reflux from 'reflux';

import SocketService from 'services/SocketService';

import ExtensionConstants from 'constants/ExtensionConstants';
import NotificationActions from 'actions/NotificationActions';

import History from 'utils/History';
import IconConstants from 'constants/IconConstants';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { ErrorResponse } from 'airdcpp-apisocket';
import { Location } from 'history';


interface NpmPackage {
  name: string;
}

const isManaged = (extension: API.Extension) => extension.managed;
const hasSettings = (extension: API.Extension) => extension.has_settings;


const ExtensionActionConfig: UI.ActionConfigList<API.Extension> = [
  { 'installNpm': { 
    displayName: 'Install',
    icon: IconConstants.CREATE,
    access: API.AccessEnum.ADMIN,
  } },
  { 'updateNpm': { 
    displayName: 'Update',
    icon: IconConstants.REFRESH,
    access: API.AccessEnum.ADMIN,
  } },
  { 'installUrl': {
    asyncResult: true,
    displayName: 'Install from URL',
    icon: IconConstants.CREATE,
    access: API.AccessEnum.ADMIN,
    input: {
      approveCaption: 'Install',
      title: 'Install extension from URL',
      content: 'Enter download URL',
      inputProps: {
        placeholder: 'Enter URL',
        type: 'url',
        required: true,
      }
    }
  } },
  { 'remove': { 
    asyncResult: true,
    displayName: 'Uninstall',
    icon: IconConstants.REMOVE,
    filter: isManaged,
    access: API.AccessEnum.ADMIN,
    confirmation: extension => ({
      // tslint:disable-next-line:max-line-length
      content: `Are you sure that you want to remove the extension ${extension.name}? This will also remove possible extension-specific settings.`,
      approveCaption: 'Remove extension',
      rejectCaption: `Don't remove`,
    })
  } },
  { 'start': { 
    asyncResult: true,
    displayName: 'Start',
    icon: IconConstants.PLAY,
    filter: isManaged,
    access: API.AccessEnum.ADMIN,
  } },
  { 'stop': { 
    asyncResult: true,
    displayName: 'Stop',
    icon: IconConstants.STOP,
    filter: isManaged,
    access: API.AccessEnum.ADMIN,
  } },
  { 'configure': { 
    children: [ 'saved' ],
    displayName: 'Configure',
    icon: IconConstants.EDIT,
    filter: hasSettings,
    access: API.AccessEnum.SETTINGS_EDIT,
  } },
];

const ExtensionActions = Reflux.createActions(ExtensionActionConfig);

ExtensionActions.configure.listen(function (extension: API.Extension, location: Location) {
  History.push(`${location.pathname}/extensions/${extension.id}`);
});

ExtensionActions.start.listen(function (
  this: UI.AsyncActionType<API.Extension>, 
  extension: API.Extension
  ) {
  const that = this;
  return SocketService.post(`${ExtensionConstants.EXTENSIONS_URL}/${extension.name}/start`)
    .then(ExtensionActions.start.completed.bind(that, extension))
    .catch(ExtensionActions.start.failed.bind(that, extension));
});

ExtensionActions.stop.listen(function (
  this: UI.AsyncActionType<API.Extension>, 
  extension: API.Extension
) {
  const that = this;
  return SocketService.post(`${ExtensionConstants.EXTENSIONS_URL}/${extension.name}/stop`)
    .then(ExtensionActions.stop.completed.bind(that, extension))
    .catch(ExtensionActions.stop.failed.bind(that, extension));
});

ExtensionActions.start.failed.listen(function (extension: API.Extension, error: ErrorResponse) {
  NotificationActions.info({ 
    title: 'Failed to start the extension ' + extension.name,
    message: error.message,
  });
});

ExtensionActions.stop.failed.listen(function (extension: API.Extension, error: ErrorResponse) {
  NotificationActions.info({ 
    title: 'Failed to stop the extension ' + extension.name,
    message: error.message,
  });
});

ExtensionActions.installNpm.listen(function (npmPackage: NpmPackage, location: Location) {
  $.getJSON(ExtensionConstants.NPM_PACKAGE_URL + npmPackage.name + '/latest', data => {
    const { tarball, shasum } = data.dist;
    ExtensionActions.installUrl(undefined, location, tarball, npmPackage.name, shasum);
  })
    .fail(ExtensionActions.installNpm.failed);
});

ExtensionActions.updateNpm.listen(function (npmPackage: NpmPackage, location: Location) {
  $.getJSON(ExtensionConstants.NPM_PACKAGE_URL + npmPackage.name + '/latest', data => {
    const { tarball, shasum } = data.dist;
    ExtensionActions.installUrl(undefined, location, tarball, shasum);
  })
    .fail(ExtensionActions.installNpm.failed);
});

ExtensionActions.installUrl.listen(function (
  data: any, location: Location, url: string, installId: string, shasum: string
) {
  return SocketService.post(ExtensionConstants.DOWNLOAD_URL, {
    install_id: installId ? installId : url,
    url,
    shasum
  })
    .then(ExtensionActions.installUrl.completed)
    .catch(ExtensionActions.installUrl.failed);
});


ExtensionActions.installUrl.failed.listen(function (error: ErrorResponse) {
  NotificationActions.apiError('Extension installation failed', error);
});

ExtensionActions.remove.listen(function (
  this: UI.AsyncActionType<API.Extension>, 
  extension: API.Extension
) {
  const that = this;
  return SocketService.delete(ExtensionConstants.EXTENSIONS_URL + '/' + extension.name)
    .then(ExtensionActions.remove.completed.bind(that, extension))
    .catch(ExtensionActions.remove.failed.bind(that, extension));
});

ExtensionActions.remove.failed.listen(function (extension: API.Extension, error: ErrorResponse) {
  NotificationActions.info({ 
    title: 'Failed to remove the extension ' + extension.name,
    message: error.message,
  });
});

export default ExtensionActions;

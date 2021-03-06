import React from 'react';

import HubSearchInput from 'components/autosuggest/HubSearchInput';
import RecentLayout from 'routes/Sidebar/components/RecentLayout';

import Message from 'components/semantic/Message';
import { Link } from 'react-router-dom';

import HubActions from 'actions/HubActions';
import HubSessionStore from 'stores/HubSessionStore';

import { HistoryEntryEnum } from 'constants/HistoryConstants';
import { Location } from 'history';

import * as API from 'types/api';


interface HubNewProps {
  location: Location;
}

class HubNew extends React.Component<HubNewProps> {
  handleConnect = (hubUrl: string) => {
    HubActions.createSession(this.props.location, hubUrl, HubSessionStore);
  }

  hasSession = (entry: API.HistoryItem) => {
    return HubSessionStore.getSessionByUrl(entry.hub_url);
  }

  recentHubRender = (entry: API.HistoryItem) => {
    return (
      <a onClick={ _ => this.handleConnect(entry.hub_url) }>
        { entry.name }
      </a> 
    );
  }

  render() {
    return (
      <div className="session new">
        <HubSearchInput 
          submitHandler={ this.handleConnect }
        />
        <Message
          description={(
            <span>
              Tip: visit the <Link to="/favorite-hubs">Favorite hubs</Link> page to connect using custom settings
            </span>
          )}
        />
        <RecentLayout
          entryType={ HistoryEntryEnum.HUB }
          hasSession={ this.hasSession }
          entryTitleRenderer={ this.recentHubRender }
          entryIcon="sitemap"
        />
      </div>
    );
  }
}

export default HubNew;

import React, { useState, memo } from 'react';

import SiteHeader from 'components/main/SiteHeader';
import MainNavigation from 'components/main/navigation/MainNavigationMobile';

import { configRoutes, mainRoutes, secondaryRoutes, parseRoutes } from 'routes/Routes';

import 'mobile.css';
import { MainMenuIcon } from './navigation/MainMenuIcon';
import { MainLayoutProps } from './AuthenticatedApp';


const MainLayoutMobile: React.FC<MainLayoutProps> = memo(props => {
  const [ menuVisible, setMenuVisible ] = useState(false);

  const onClickMenu = () => setMenuVisible(!menuVisible);

  const { className, location } = props;
  return (
    <div className={ className } id="mobile-layout">
      { menuVisible && (
        <MainNavigation
          location={ location }
          onClose={ onClickMenu }
        />
      ) }
      <div className="pusher" id="mobile-layout-inner">
        <SiteHeader>
          <MainMenuIcon
            onClickMenu={ onClickMenu }
            routes={ secondaryRoutes }
          />
        </SiteHeader>
        <div className="site-content">
          { parseRoutes([ ...mainRoutes, ...secondaryRoutes, ...configRoutes ]) }
        </div>
      </div>
    </div>
  );
});

export default MainLayoutMobile;
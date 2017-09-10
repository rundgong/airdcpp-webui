import PropTypes from 'prop-types';
import React from 'react';

import Dropdown from 'components/semantic/Dropdown';
import { MenuItemLink } from 'components/semantic/MenuItem';

import WidgetActions from 'actions/WidgetActions';
import WidgetStore from 'stores/WidgetStore';


const getWidgetItem = (widgetInfo, location) => {
  return (
    <MenuItemLink 
      key={ widgetInfo.typeId }
      onClick={ () => WidgetActions.create(widgetInfo, location) }
      icon={ widgetInfo.icon }
    >
      { widgetInfo.name }
    </MenuItemLink>
  );
};

const WidgetDropdown = ({ widgets, onClickItem, componentId, ...widgetProps }, { routerLocation }) => (
  <Dropdown 
    caption="Add widget..."
    className="create-widget"
    button={ true }
    contextElement={ '.' + componentId }
    { ...widgetProps }
  >
    { WidgetStore.widgets
      .filter(widgetInfo => !widgetInfo.alwaysShow)
      .map(widgetInfo => getWidgetItem(widgetInfo, routerLocation)) }
  </Dropdown>
);

WidgetDropdown.contextTypes = {
  routerLocation: PropTypes.object.isRequired,
};

export default WidgetDropdown;
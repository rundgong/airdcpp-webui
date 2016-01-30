import React from 'react';

import TransferActions from 'actions/TransferActions';

import { TableActionMenu, TableUserMenu } from 'components/menu/DropdownMenu';
import IconConstants from 'constants/IconConstants';


const UserCaption = ({ cellData, rowData, location }) => (
	<div className="transfer-user">
		<i className={ (rowData.download ? IconConstants.DOWNLOAD : IconConstants.UPLOAD) + ' large icon' }/>
		{ cellData.nicks }
	</div>
);

const UserCell = ({ cellData, rowData, location, ...props }) => (
	<TableUserMenu 
		user={ cellData }
		location={ location }
		userIcon={ null }
		ids={ [ 'browse', 'message' ] }
		text={ <UserCaption rowData={ rowData } cellData={ cellData }/> }
	>
		<TableActionMenu 
			itemData={ rowData }
			actions={ TransferActions } 
			//ids={ [ 'force', 'disconnect' ] }
		/>
	</TableUserMenu>
);

export default UserCell;
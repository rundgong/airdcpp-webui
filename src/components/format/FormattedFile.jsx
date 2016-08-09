import React from 'react';

import FileIcon from 'components/icon/FileIcon';


const FormattedFile = ({ onClick, typeInfo, caption }) => {
	if (onClick) {
		caption = (
			<a onClick={ onClick }>
				{ caption }
			</a>
		);
	}

	return (
		<div className="file-name">
			<FileIcon typeInfo={ typeInfo }/>
			{ caption }
		</div>
	);
};

FormattedFile.propTypes = {
	onClick: React.PropTypes.func,

	typeInfo: React.PropTypes.object.isRequired,

	caption: React.PropTypes.node.isRequired,
};

export default FormattedFile;
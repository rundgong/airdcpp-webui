import React from 'react';
import Modal from 'components/semantic/Modal';

import FileIcon from 'components/icon/FileIcon';

import DownloadDialog from 'components/download/DownloadDialog';
import SearchActions from 'actions/SearchActions';

import ResultInfoGrid from './ResultInfoGrid';
import UserResultTable from './UserResultTable';

import ModalRouteDecorator from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';


class ResultDialog extends React.Component {
  static displayName = 'ResultDialog';

  render() {
    const { parentResult } = this.props;
    return (
      <Modal 
        className="result" 
        title={ parentResult.name }
        closable={ true } 
        icon={ <FileIcon typeInfo={ parentResult.type }/> } 
        fullHeight={ true }
        {...this.props}
      >
        <DownloadDialog downloadHandler={ SearchActions.download }/>
        <ResultInfoGrid parentResult={ parentResult }/>
        <UserResultTable parentResult={ parentResult }/>
      </Modal>
    );
  }
}

export default ModalRouteDecorator(ResultDialog, OverlayConstants.SEARCH_RESULT_MODAL, 'result');
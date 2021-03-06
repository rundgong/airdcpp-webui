'use strict';
import React from 'react';
import { FileSessionContentProps } from 'routes/Sidebar/routes/Files/components/FileSession';


const ImageFile: React.FC<FileSessionContentProps> = ({ item, url }) => {
  return (
    <img src={ url }/>
  );
};

export default ImageFile;
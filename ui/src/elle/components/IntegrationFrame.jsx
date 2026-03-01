import { useContext, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { queryStore } from '../store/QueryStore';
import { useGetSelectedTexts } from '../hooks/service/TextService';
import RootContext from '../context/RootContext';

const IntegrationFrame = ({ integrationName }) => {
  const { integrationPaths } = useContext(RootContext);
  const path = integrationPaths[integrationName];
  const [height, setHeight] = useState('');
  const iframeRef = useRef();
  const [storeData, setStoreData] = useState('');
  const { getSelectedTexts } = useGetSelectedTexts(setStoreData);

  useEffect(() => {
    iframeRef.current.contentWindow.postMessage(storeData, path);
  }, [storeData, height, path]);

  useEffect(() => {
    getSelectedTexts();
  }, [getSelectedTexts]);

  queryStore.subscribe(() => {
    getSelectedTexts();
  });

  window.addEventListener('message', function (event) {
    if (path.includes(event.origin)) {
      setHeight((event.data + 100) + 'px');
    }
  });

  return (
    <Box className="embed-responsive embed-responsive-21by9 overflow-hidden" height={height}>
      <iframe ref={iframeRef} src={path} title={integrationName} />
    </Box>
  );
};

export default IntegrationFrame;

import { useContext, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { queryStore } from '../store/QueryStore';
import { useGetSelectedTexts } from '../hooks/service/TextService';
import RootContext from '../context/RootContext';

export default function ClusterFinder() {
  const { clusterFinderIntegrationPath } = useContext(RootContext);
  const [height, setHeight] = useState('');
  const iframeRef = useRef();
  const [storeData, setStoreData] = useState('');
  const { getSelectedTexts } = useGetSelectedTexts(setStoreData);

  useEffect(() => {
    iframeRef.current.contentWindow.postMessage(storeData, clusterFinderIntegrationPath);
  }, [storeData, height, clusterFinderIntegrationPath]);

  useEffect(() => {
    getSelectedTexts();
  }, [getSelectedTexts]);

  queryStore.subscribe(() => {
    getSelectedTexts();
  });

  window.addEventListener('message', function (event) {
    if (clusterFinderIntegrationPath.includes(event.origin)) {
      setHeight((event.data + 100) + 'px');
    }
  });

  return (
    <Box style={{ width: window.innerWidth / 1.8 }}>
      <Box className="embed-responsive embed-responsive-21by9 overflow-hidden" height={height}>
        <iframe
          ref={iframeRef}
          src={clusterFinderIntegrationPath}
          title="clusterfinder"
        />
      </Box>
    </Box>
  );
};

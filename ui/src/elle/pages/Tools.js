import { useEffect, useState } from 'react';
import { Alert, Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import QueryModal from '../components/modal/text-selection/QueryModal';
import { useTranslation } from 'react-i18next';
import './styles/Tools.css';
import { queryStore } from '../store/QueryStore';
import WordlistIcon from '../resources/images/tools/sonaloend.png';
import WordContextIcon from '../resources/images/tools/sona_kontekstis.png';
import CollocatesIcon from '../resources/images/tools/naabersonad.png';
import WordAnalyserIcon from '../resources/images/tools/sonaanalyys.png';
import ClusterfinderIcon from '../resources/images/tools/mustrileidja.png';
import ResponsiveDrawer from '../components/ResponsiveDrawer';
import OwnTextsModal from '../components/modal/text-selection/OwnTextsModal';
import SelectedTextsModal from '../components/modal/text-selection/SelectedTextsModal';
import { RouteFullPathConstants, ToolsDrawerList } from '../const/RouteConstants';

const ToolIconCard = ({ image, text }) => {
  const { t } = useTranslation();
  return (
    <Box
      className="tool-card-container"
      sx={{ boxShadow: 3 }}
    >
      <Box className="tool-card-icon">
        <img
          className="tool-icon-img"
          src={image}
          alt="Tool logo"
        />
      </Box>
      <Box className="tool-card-text">
        {t(text)}
      </Box>
    </Box>
  );
};

const TabOutlet = ({ textsSelected, image, text, outletPath }) => {
  const { t } = useTranslation();
  const current = useLocation();

  return current.pathname === outletPath
    ? (
      <div
        style={{ display: textsSelected ? 'none' : 'block' }}
        className="tool-intro-container"
      >
        <ToolIconCard
          image={image}
          text={text}
        />
        <Alert severity="warning">
          {t('tools_warning_text')}
        </Alert>
      </div>
    ) : null;
};

export default function Tools() {
  const current = useLocation();
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  const [isOwnTextsOpen, setIsOwnTextsOpen] = useState(false);
  const [textsSelected, setTextsSelected] = useState(false);
  const [isSelectedTextsOpen, setIsSelectedTextsOpen] = useState(false);

  useEffect(() => {
    const storeState = queryStore.getState();
    setTextsSelected(storeState.corpusTextIds !== null || storeState.ownTexts !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (current?.state?.pageNo === 'queryOpen') {
      setIsQueryOpen(true);
    }
  }, [current?.state?.pageNo]);

  queryStore.subscribe(() => {
    const storeState = queryStore.getState();
    setTextsSelected(storeState.corpusTextIds !== null || storeState.ownTexts !== null);
  });

  const handleCustomActionClick = (item) => {
    if (item.text === 'query_choose_texts') {
      setIsQueryOpen(true);
    }
    if (item.text === 'query_own_texts') {
      setIsOwnTextsOpen(true);
    }
    if (item.text === 'query_results_saved_for_analysis') {
      setIsSelectedTextsOpen(true);
    }
  };

  return (
    <>
      <QueryModal
        isQueryOpen={isQueryOpen}
        setIsQueryOpen={setIsQueryOpen}
      />
      <OwnTextsModal
        isOpen={isOwnTextsOpen}
        setIsOpen={setIsOwnTextsOpen}
      />
      <SelectedTextsModal
        isOpen={isSelectedTextsOpen}
        setIsOpen={setIsSelectedTextsOpen}
      />

      <ResponsiveDrawer
        lists={ToolsDrawerList}
        onCustomActionClick={handleCustomActionClick}
        disableOutletRender
      >
        <Box className="tool-page-wrapper">
          <Box className="tool-page-inner-wrapper">
            <div style={{ display: textsSelected ? 'block' : 'none' }}>
              <Outlet />
            </div>
            <TabOutlet
              textsSelected={textsSelected}
              image={WordlistIcon}
              text={'tools_accordion_wordlist_explainer'}
              outletPath={RouteFullPathConstants.TOOLS_WORDLIST}
            />
            <TabOutlet
              textsSelected={textsSelected}
              image={WordContextIcon}
              text={'tools_accordion_word_in_context_explainer'}
              outletPath={RouteFullPathConstants.TOOLS_WORDCONTEXT}
            />
            <TabOutlet
              textsSelected={textsSelected}
              image={CollocatesIcon}
              text={'tools_accordion_neighbouring_words_explainer'}
              outletPath={RouteFullPathConstants.TOOLS_COLLOCATES}
            />
            <TabOutlet
              textsSelected={textsSelected}
              image={WordAnalyserIcon}
              text={'tools_accordion_word_analysis_explainer'}
              outletPath={RouteFullPathConstants.TOOLS_WORDANALYSER}
            />
            <TabOutlet
              textsSelected={textsSelected}
              image={ClusterfinderIcon}
              text={'tools_accordion_clusters_explainer'}
              outletPath={RouteFullPathConstants.TOOLS_CLUSTERFINDER}
            />
          </Box>
        </Box>
      </ResponsiveDrawer>
    </>
  );
}

import { useState } from 'react';
import '../styles/InfoElement.css';
import { Box, Tab } from '@mui/material';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { Languages } from '../../translations/i18n';
import { ELLE_PATH } from '../../const/PathConstants';
import {
  CLUSTER_CATCHER_VIDEO_ID_EN,
  CLUSTER_CATCHER_VIDEO_ID_ET,
  NEIGHBOURING_WORDS_VIDEO_ID_EN,
  NEIGHBOURING_WORDS_VIDEO_ID_ET,
  TEXT_QUERY_VIDEO_ID_EN,
  TEXT_QUERY_VIDEO_ID_ET,
  WORD_ANALYSER_VIDEO_ID_EN,
  WORD_ANALYSER_VIDEO_ID_ET,
  WORD_CONTEXT_VIDEO_ID_EN,
  WORD_CONTEXT_VIDEO_ID_ET,
  WORDLIST_VIDEO_ID_EN,
  WORDLIST_VIDEO_ID_ET,
  WRITING_EVALUATOR_VIDEO_ID_EN,
  WRITING_EVALUATOR_VIDEO_ID_ET
} from '../../const/VideoIdConstants';
import GenericTabs from '../GenericTabs';

export default function InfoElement() {

  const { t } = useTranslation();
  const [writingEvaluatorVideoId, setWritingEvaluatorVideoId] = useState(i18n.language === Languages.ESTONIAN ? WRITING_EVALUATOR_VIDEO_ID_ET : WRITING_EVALUATOR_VIDEO_ID_EN);
  const [textQueryVideoId, setTextQueryVideoId] = useState(i18n.language === Languages.ESTONIAN ? TEXT_QUERY_VIDEO_ID_ET : TEXT_QUERY_VIDEO_ID_EN);
  const [wordlistVideoId, setWordlistVideoId] = useState(i18n.language === Languages.ESTONIAN ? WORDLIST_VIDEO_ID_ET : WORDLIST_VIDEO_ID_EN);
  const [wordContextVideoId, setWordContextVideoId] = useState(i18n.language === Languages.ESTONIAN ? WORD_CONTEXT_VIDEO_ID_ET : WORD_CONTEXT_VIDEO_ID_EN);
  const [neighbouringWordsVideoId, setNeighbouringWordsVideoId] = useState(i18n.language === Languages.ESTONIAN ? NEIGHBOURING_WORDS_VIDEO_ID_ET : NEIGHBOURING_WORDS_VIDEO_ID_EN);
  const [clusterCatcherVideoId, setClusterCatcherVideoId] = useState(i18n.language === Languages.ESTONIAN ? CLUSTER_CATCHER_VIDEO_ID_ET : CLUSTER_CATCHER_VIDEO_ID_EN);
  const [wordAnalyserVideoId, setWordAnalyserVideoId] = useState(i18n.language === Languages.ESTONIAN ? WORD_ANALYSER_VIDEO_ID_ET : WORD_ANALYSER_VIDEO_ID_EN);
  const [value, setValue] = useState(0);

  i18n.on('languageChanged', () => {
    if (i18n.language === Languages.ESTONIAN) {
      setWritingEvaluatorVideoId(WRITING_EVALUATOR_VIDEO_ID_ET);
      setTextQueryVideoId(TEXT_QUERY_VIDEO_ID_ET);
      setWordlistVideoId(WORDLIST_VIDEO_ID_ET);
      setWordContextVideoId(WORD_CONTEXT_VIDEO_ID_ET);
      setNeighbouringWordsVideoId(NEIGHBOURING_WORDS_VIDEO_ID_ET);
      setClusterCatcherVideoId(CLUSTER_CATCHER_VIDEO_ID_ET);
      setWordAnalyserVideoId(WORD_ANALYSER_VIDEO_ID_ET);
    } else {
      setWritingEvaluatorVideoId(WRITING_EVALUATOR_VIDEO_ID_EN);
      setTextQueryVideoId(TEXT_QUERY_VIDEO_ID_EN);
      setWordlistVideoId(WORDLIST_VIDEO_ID_EN);
      setWordContextVideoId(WORD_CONTEXT_VIDEO_ID_EN);
      setNeighbouringWordsVideoId(NEIGHBOURING_WORDS_VIDEO_ID_EN);
      setClusterCatcherVideoId(CLUSTER_CATCHER_VIDEO_ID_EN);
      setWordAnalyserVideoId(WORD_ANALYSER_VIDEO_ID_EN);
    }
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="global-page-content-container info-element-container-outer">
      <Box className="global-page-content-container-inner info-element-container-inner">
        <GenericTabs
          className="info-element-tabs"
          value={value}
          handleChange={handleChange}
          mobileViewMaxWidth="1225px"
          secondaryVariant="fullWidth"
        >
          <Tab label={t('common_corrector')} />
          <Tab label={t('common_query')} />
          <Tab label={t('common_wordlist')} />
          <Tab label={t('common_word_in_context')} />
          <Tab label={t('common_neighbouring_words')} />
          <Tab label={t('common_clusters')} />
          {/* TODO: ELLE-330 | Remove after migration */}
          <Tab label={t('common_clusters_old')} />
          <Tab label={t('common_word_analyser')} />
        </GenericTabs>
        <TabPanel value={value} index={0} videoId={writingEvaluatorVideoId}
                  title="homepage_box_writing_evaluator_title"
                  content="homepage_box_writing_evaluator_content" />
        <TabPanel value={value} index={1} videoId={textQueryVideoId}
                  title="homepage_box_text_query_title"
                  content="homepage_box_text_query_content" />
        <TabPanel value={value} index={2} videoId={wordlistVideoId}
                  title="homepage_box_wordlist_title"
                  content="homepage_box_wordlist_content" />
        <TabPanel value={value} index={3} videoId={wordContextVideoId}
                  title="common_word_in_context"
                  content="homepage_box_word_context_content" />
        <TabPanel value={value} index={4} videoId={neighbouringWordsVideoId}
                  title="homepage_box_neighbouring_words_title"
                  content="homepage_box_neighbouring_words_content" />
        <TabPanel value={value} index={5} videoId={clusterCatcherVideoId}
                  title="homepage_box_cluster_catcher_title"
                  content="homepage_box_cluster_catcher_content" />
        <TabPanel value={value} index={6} videoId={wordAnalyserVideoId}
                  title="homepage_box_word_analyser_title"
                  content="homepage_box_word_analyser_content" />
      </Box>
    </Box>
  );
};

function TabPanel(props) {
  const { value, index, videoId, title, content, ...other } = props;
  const { t } = useTranslation();
  const src = `https://www.youtube.com/embed/${videoId}?origin=${ELLE_PATH}`;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="info-element-tab-panel">
          <div className="info-element-text-container">
            <p style={{ fontSize: '20px' }}>
              <b>{t(title)}</b> {t(content)}
            </p>
          </div>

          <div className="video-container">
            <div className="video-wrapper">
              <iframe
                title={videoId}
                src={src}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </Box>
      )}
    </div>
  );
}

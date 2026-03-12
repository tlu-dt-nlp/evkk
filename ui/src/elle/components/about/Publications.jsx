import { Box, Typography } from '@mui/material';
import SingleLinkedResourceList from './SingleLinkedResourceList';
import { conferences_workshops, publications, theses } from '../../const/PublicationsAndGrantsConstants';
import { useTranslation } from 'react-i18next';
import '../styles/Publications.css';
import { HashFragmentRouteConstants } from '../../const/RouteConstants';

export default function Publications() {
  const { t } = useTranslation();

  return (
    <Box className="publications-container">
      <Box>
        <Typography
          id={HashFragmentRouteConstants.PUBLICATIONS_GRADUATION_PAPERS}
          variant="h4"
        >
          {t('common_graduation_papers')}
        </Typography>
      </Box>
      <SingleLinkedResourceList list={theses} />

      <Box>
        <Typography
          id={HashFragmentRouteConstants.PUBLICATIONS_CONFERENCES_AND_WORKSHOPS}
          variant="h4"
        >
          {t('common_conferences_and_workshops')}
        </Typography>
      </Box>
      <SingleLinkedResourceList list={conferences_workshops} />

      <Box>
        <Typography
          id={HashFragmentRouteConstants.PUBLICATIONS_ARTICLES}
          variant="h4"
        >
          {t('common_articles')}
        </Typography>
      </Box>
      <SingleLinkedResourceList list={publications} />
    </Box>
  );
}

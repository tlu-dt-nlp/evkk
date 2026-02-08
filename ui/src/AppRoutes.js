import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MasinoppeEnnustus, MinitornPikkus } from './views/tools';
import { Container } from '@mui/material';
import Home from './elle/pages/Home';
import Links from './elle/pages/Links';
import FilledContacts from './elle/components/about/FilledContacts';
import Grants from './elle/components/about/Grants';
import ClusterFinder from './elle/tools/ClusterFinder';
import WordAnalyserParent from './elle/tools/wordanalyser/WordAnalyserParent';
import BreadcrumbLinks from './elle/components/BreadcrumbLinks';
import AboutUsText from './elle/components/about/AboutUsText';
import Publications from './elle/components/about/Publications';
import Adding from './elle/pages/Adding.component';
import Wordlist from './elle/tools/wordlist/Wordlist';
import WordContext from './elle/tools/wordcontext/WordContext';
import Collocates from './elle/tools/collocates/Collocates';
import Tools from './elle/pages/Tools';
import Correction from './elle/tools/correction/Correction';
import Login from './elle/pages/Login';
import Admin from './elle/pages/Admin';
import RequireAuth from './elle/components/security/RequireAuth';
import { aboutUsDrawerList, UserRoles } from './elle/const/Constants';
import { useTranslation } from 'react-i18next';
import ResponsiveDrawer from './elle/components/ResponsiveDrawer';
import CorrectionV2 from './elle/tools/correctionV2/CorrectionV2';

export default function AppRoutes() {
  const { t } = useTranslation();

  const render404 = () => (
    <div className={'text-center pb-4'}>
      <p className={'lead'}>{t('error_404_page_not_found')}</p>
    </div>
  );

  return (
    <Container
      disableGutters
      maxWidth={false}
      className="global-page-container"
    >
      <BreadcrumbLinks />
      <Routes>
        <Route exact
               path="/"
               element={<Home />} />
        <Route path={RouteConstants.ABOUT}
               element={<ResponsiveDrawer lists={aboutUsDrawerList} />}>
          <Route index
                 element={<Navigate to={RouteConstants.US}
                                    replace />} />
          <Route path={RouteConstants.US}
                 element={<AboutUsText />} />
          <Route path={RouteConstants.PEOPLE}
                 element={<FilledContacts />} />
          <Route path={RouteConstants.GRANTS}
                 element={<Grants />} />
          <Route path={RouteConstants.PUBLICATIONS}
                 element={<Publications />} />
        </Route>
        <Route path={RouteConstants.ADDING}
               element={<Adding />} />
        <Route path={RouteConstants.CORRECTOR}
               element={<CorrectionV2 />} />
        <Route path={RouteConstants.CORRECTOR_TEST}
               element={<Correction />} />
        <Route path={RouteConstants.TOOLS}
               element={<Tools />}>
          <Route index
                 element={<Navigate to={RouteConstants.WORDLIST}
                                    replace />} />
          <Route path={RouteConstants.WORDLIST}
                 element={<Wordlist />} />
          <Route path={RouteConstants.WORDCONTEXT}
                 element={<WordContext />} />
          <Route path={RouteConstants.COLLOCATES}
                 element={<Collocates />} />
          <Route path={RouteConstants.CLUSTERFINDER}
                 element={<ClusterFinder />} />
          <Route path={RouteConstants.WORDANALYSER}
                 element={<WordAnalyserParent />} />
          <Route path="minitorn-pikkus"
                 element={<MinitornPikkus />} />
          <Route path="masinoppe-ennustus"
                 element={<MasinoppeEnnustus />} />
        </Route>
        <Route path={RouteConstants.LINKS}
               element={<Links />} />
        <Route path={RouteConstants.LOGIN}
               element={<Login />} />
        <Route element={<RequireAuth role={UserRoles.ADMIN} />}>
          <Route path={RouteConstants.ADMIN}
                 element={<Admin />} />
        </Route>
        <Route path="*"
               element={render404()} />
      </Routes>
    </Container>
  );
}

export const RouteConstants = {
  ABOUT: 'about',
  ADDING: 'adding',
  ADMIN: 'admin',
  CLUSTERFINDER: 'clusterfinder',
  COLLOCATES: 'collocates',
  CORRECTOR: 'corrector',
  CORRECTOR_TEST: 'corrector-test',
  GRANTS: 'grants',
  LINKS: 'links',
  LOGIN: 'login',
  PEOPLE: 'people',
  PUBLICATIONS: 'publications',
  TOOLS: 'tools',
  US: 'us',
  WORDANALYSER: 'wordanalyser',
  WORDCONTEXT: 'wordcontext',
  WORDLIST: 'wordlist'
};

export const RouteFullPathConstants = {
  WORDANALYSER: `/${RouteConstants.TOOLS}/${RouteConstants.WORDANALYSER}`,
  COLLOCATES: `/${RouteConstants.TOOLS}/${RouteConstants.COLLOCATES}`,
  WORDCONTEXT: `/${RouteConstants.TOOLS}/${RouteConstants.WORDCONTEXT}`,
  WORDLIST: `/${RouteConstants.TOOLS}/${RouteConstants.WORDLIST}`,
  CLUSTERFINDER: `/${RouteConstants.TOOLS}/${RouteConstants.CLUSTERFINDER}`
};

export const HashFragmentRouteConstants = {
  LINKS_FOR_TEACHERS: 'for-teachers',
  LINKS_AUDIOVISUAL_MEDIA: 'audiovisual-media',
  LINKS_RADIO_AUDIO_PODCASTS: 'radio-audio-podcasts',
  LINKS_SERIES_FILMS_VIDEOS: 'series-films-videos',
  LINKS_ESTONIAN_TEXTS: 'estonian-texts',
  LINKS_LITERATURE: 'literature',
  LINKS_MEDIA_TEXTS: 'media-texts',
  LINKS_ACADEMIC_TEXTS: 'academic-texts',
  LINKS_ESTONIAN_LANGUAGE_CORPORA: 'estonian-language-corpora',
  LINKS_LEARNING_ENVIRONMENTS_AND_COURSES: 'learning-environments-and-courses',
  LINKS_LANGUAGE_LEARNING_ENVIRONMENTS: 'language-learning-environments',
  LINKS_LANGUAGE_COURSES: 'language-courses',
  LINKS_LEARNING_RESOURCES: 'learning-resources',
  LINKS_LANGUAGE_LEARNING_GAMES: 'language-learning-games',
  LINKS_LANGUAGE_LEARNING_MATERIALS_AND_EXERCISES: 'language-learning-materials-and-exercises',
  LINKS_DICTIONARIES: 'dictionaries',
  LINKS_TRANSLATION_TOOLS: 'translation-tools',
  LINKS_INTRODUCTION: 'introduction',
  PUBLICATIONS_ARTICLES: 'articles',
  PUBLICATIONS_CONFERENCES_AND_WORKSHOPS: 'conferences-and-workshops',
  PUBLICATIONS_GRADUATION_PAPERS: 'graduation-papers'
};

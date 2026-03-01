import { Navigate } from 'react-router-dom';
import { MasinoppeEnnustus, MinitornPikkus } from './views/tools';
import Home from './elle/pages/Home';
import Links from './elle/pages/Links';
import FilledContacts from './elle/components/about/FilledContacts';
import Grants from './elle/components/about/Grants';
import ClusterFinder from './elle/tools/ClusterFinder';
import WordAnalyserParent from './elle/tools/wordanalyser/WordAnalyserParent';
import AboutUsText from './elle/components/about/AboutUsText';
import Publications from './elle/components/about/Publications';
import Adding from './elle/pages/Adding.component';
import Wordlist from './elle/tools/wordlist/Wordlist';
import WordContext from './elle/tools/wordcontext/WordContext';
import Collocates from './elle/tools/Collocates';
import Tools from './elle/pages/Tools';
import Correction from './elle/tools/correction/Correction';
import Login from './elle/pages/Login';
import Admin from './elle/pages/Admin';
import RequireAuth from './elle/components/security/RequireAuth';
import { UserRoles } from './elle/const/Constants';
import ResponsiveDrawer from './elle/components/ResponsiveDrawer';
import { AboutUsDrawerList, RouteConstants, RouteFullPathConstants } from './elle/const/RouteConstants';
import AppLayout from './elle/app/AppLayout';
import NotFound from './elle/components/error/NotFound';
import { AppShell } from './elle/app/AppShell';

export const routes = [
  {
    path: '/',
    element: <AppShell />,
    handle: { crumb: () => ({ to: '/', translateKey: null }) },
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Home />
          },
          {
            path: RouteConstants.ABOUT,
            element: <ResponsiveDrawer lists={AboutUsDrawerList} />,
            handle: { crumb: () => ({ to: RouteConstants.ABOUT, translateKey: 'common_about' }) },
            children: [
              {
                index: true,
                element: <Navigate to={RouteConstants.US} replace />
              },
              {
                path: RouteConstants.US,
                element: <AboutUsText />,
                handle: { crumb: () => ({ to: RouteFullPathConstants.ABOUT_US, translateKey: 'common_us' }) }
              },
              {
                path: RouteConstants.PEOPLE,
                element: <FilledContacts />,
                handle: { crumb: () => ({ to: RouteFullPathConstants.ABOUT_PEOPLE, translateKey: 'common_people' }) }
              },
              {
                path: RouteConstants.GRANTS,
                element: <Grants />,
                handle: { crumb: () => ({ to: RouteFullPathConstants.ABOUT_GRANTS, translateKey: 'common_grants' }) }
              },
              {
                path: RouteConstants.PUBLICATIONS,
                element: <Publications />,
                handle: {
                  crumb: () => ({
                    to: RouteFullPathConstants.ABOUT_PUBLICATIONS,
                    translateKey: 'common_publications'
                  })
                }
              }
            ]
          },
          {
            path: RouteConstants.ADDING,
            element: <Adding />,
            handle: { crumb: () => ({ to: RouteConstants.ADDING, translateKey: 'common_publish_your_text' }) }
          },
          {
            path: RouteConstants.CORRECTOR,
            element: <Correction />,
            handle: { crumb: () => ({ to: RouteConstants.CORRECTOR, translateKey: 'common_corrector' }) }
          },
          {
            path: RouteConstants.CORRECTOR_TEST,
            element: <Correction />,
            handle: {
              crumb: () => ({
                to: RouteConstants.CORRECTOR_TEST,
                translateKey: 'common_corrector_test_version'
              })
            }
          },
          {
            path: RouteConstants.TOOLS,
            element: <Tools />,
            handle: { crumb: () => ({ to: RouteConstants.TOOLS, translateKey: 'common_tools' }) },
            children: [
              {
                index: true,
                element: <Navigate to={RouteConstants.WORDLIST} replace />
              },
              {
                path: RouteConstants.WORDLIST,
                element: <Wordlist />,
                handle: {
                  crumb: () => ({
                    to: RouteFullPathConstants.TOOLS_WORDLIST,
                    translateKey: 'common_wordlist'
                  })
                }
              },
              {
                path: RouteConstants.WORDCONTEXT,
                element: <WordContext />,
                handle: {
                  crumb: () => ({
                    to: RouteFullPathConstants.TOOLS_WORDCONTEXT,
                    translateKey: 'common_word_in_context'
                  })
                }
              },
              {
                path: RouteConstants.COLLOCATES,
                element: <Collocates />,
                handle: {
                  crumb: () => ({
                    to: RouteFullPathConstants.TOOLS_COLLOCATES,
                    translateKey: 'common_neighbouring_words'
                  })
                }
              },
              {
                path: RouteConstants.CLUSTERFINDER,
                element: <ClusterFinder />,
                handle: {
                  crumb: () => ({
                    to: RouteFullPathConstants.TOOLS_CLUSTERFINDER,
                    translateKey: 'common_clusters'
                  })
                }
              },
              {
                path: RouteConstants.WORDANALYSER,
                element: <WordAnalyserParent />,
                handle: {
                  crumb: () => ({
                    to: RouteFullPathConstants.TOOLS_WORDANALYSER,
                    translateKey: 'common_word_analyser'
                  })
                }
              },
              {
                path: 'minitorn-pikkus',
                element: <MinitornPikkus />
              },
              {
                path: 'masinoppe-ennustus',
                element: <MasinoppeEnnustus />
              }
            ]
          },
          {
            path: RouteConstants.LINKS,
            element: <Links />,
            handle: { crumb: () => ({ to: RouteConstants.LINKS, translateKey: 'common_links' }) }
          },
          {
            path: RouteConstants.LOGIN,
            element: <Login />,
            handle: { crumb: () => ({ to: RouteConstants.LOGIN, translateKey: 'common_login_for_admins' }) }
          },
          {
            element: <RequireAuth role={UserRoles.ADMIN} />,
            children: [
              {
                path: RouteConstants.ADMIN,
                element: <Admin />,
                handle: { crumb: () => ({ to: RouteConstants.ADMIN, translateKey: 'common_admin_panel' }) }
              }
            ]
          },
          {
            path: '*',
            element: <NotFound />,
            handle: { crumb: () => ({ to: null, translateKey: 'error_page_not_found' }) }
          }
        ]
      }
    ]
  }
];

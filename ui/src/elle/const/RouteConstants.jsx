import {
  AccountBalance,
  AccountBox,
  Article,
  Backup,
  Book,
  CoPresent,
  Devices,
  Dvr,
  Gamepad,
  HistoryEdu,
  Info,
  Keyboard,
  LibraryBooks,
  Lightbulb,
  ListAlt,
  ManageSearch,
  MenuBook,
  Movie,
  Newspaper,
  PermDeviceInformation,
  PermMedia,
  Radio,
  ReadMore,
  School,
  Science,
  Source,
  Spellcheck,
  Translate
} from '@mui/icons-material';
import WordlistIcon from '../resources/images/tools/sonaloend.png';
import WordContextIcon from '../resources/images/tools/sona_kontekstis.png';
import CollocatesIcon from '../resources/images/tools/naabersonad.png';
import WordAnalyserIcon from '../resources/images/tools/sonaanalyys.png';
import ClusterfinderIcon from '../resources/images/tools/mustrileidja.png';
import { UserRoles } from './Constants';
import { CC_BY_4_0_LICENSE_PATH, EVKK_GITHUB_PATH, EVKK_VERS1_PATH, MIT_LICENSE_PATH } from './PathConstants';

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
  ABOUT_GRANTS: `/${RouteConstants.ABOUT}/${RouteConstants.GRANTS}`,
  ABOUT_PEOPLE: `/${RouteConstants.ABOUT}/${RouteConstants.PEOPLE}`,
  ABOUT_PUBLICATIONS: `/${RouteConstants.ABOUT}/${RouteConstants.PUBLICATIONS}`,
  ABOUT_US: `/${RouteConstants.ABOUT}/${RouteConstants.US}`,
  TOOLS_CLUSTERFINDER: `/${RouteConstants.TOOLS}/${RouteConstants.CLUSTERFINDER}`,
  TOOLS_COLLOCATES: `/${RouteConstants.TOOLS}/${RouteConstants.COLLOCATES}`,
  TOOLS_WORDANALYSER: `/${RouteConstants.TOOLS}/${RouteConstants.WORDANALYSER}`,
  TOOLS_WORDCONTEXT: `/${RouteConstants.TOOLS}/${RouteConstants.WORDCONTEXT}`,
  TOOLS_WORDLIST: `/${RouteConstants.TOOLS}/${RouteConstants.WORDLIST}`
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

export const ToolsDrawerList = [
  {
    key: 'tool-management',
    items: [
      {
        text: 'query_choose_texts',
        icon: <ManageSearch />,
        customAction: true
      },
      {
        text: 'own_texts',
        icon: <ReadMore />,
        customAction: true
      },
      {
        text: 'texts_saved_for_analysis',
        icon: <ListAlt />,
        customAction: true
      },
      {
        text: 'common_donate_text',
        icon: <Backup />,
        navigateTo: `../${RouteConstants.ADDING}`
      }
    ]
  },
  {
    key: 'tools',
    items: [
      {
        text: 'common_wordlist',
        icon: <img src={WordlistIcon} className="tool-drawer-icon" alt="wordlist" />,
        navigateTo: RouteConstants.WORDLIST
      },
      {
        text: 'common_word_in_context',
        icon: <img src={WordContextIcon} className="tool-drawer-icon" alt="wordcontext" />,
        navigateTo: RouteConstants.WORDCONTEXT
      },
      {
        text: 'common_neighbouring_words',
        icon: <img src={CollocatesIcon} className="tool-drawer-icon" alt="collocates" />,
        navigateTo: RouteConstants.COLLOCATES
      },
      {
        text: 'common_word_analyser',
        icon: <img src={WordAnalyserIcon} className="tool-drawer-icon" alt="wordanalyser" />,
        navigateTo: RouteConstants.WORDANALYSER
      },
      {
        text: 'common_clusters',
        icon: <img src={ClusterfinderIcon} className="tool-drawer-icon" alt="clusterfinder" />,
        navigateTo: RouteConstants.CLUSTERFINDER
      }
    ]
  }
];

export const AboutUsDrawerList = [
  {
    key: 'about',
    items: [
      {
        text: 'common_us',
        icon: <Info />,
        navigateTo: RouteConstants.US
      },
      {
        text: 'common_people',
        icon: <AccountBox />,
        navigateTo: RouteConstants.PEOPLE
      },
      {
        text: 'common_grants',
        icon: <AccountBalance />,
        navigateTo: RouteConstants.GRANTS
      },
      {
        text: 'common_publications',
        icon: <HistoryEdu />,
        navigateTo: RouteConstants.PUBLICATIONS,
        children: [
          {
            text: 'common_graduation_papers',
            icon: <School />,
            navigateTo: `${RouteConstants.PUBLICATIONS}#${HashFragmentRouteConstants.PUBLICATIONS_GRADUATION_PAPERS}`
          },
          {
            text: 'common_conferences_and_workshops',
            icon: <CoPresent />,
            navigateTo: `${RouteConstants.PUBLICATIONS}#${HashFragmentRouteConstants.PUBLICATIONS_CONFERENCES_AND_WORKSHOPS}`
          },
          {
            text: 'common_articles',
            icon: <Article />,
            navigateTo: `${RouteConstants.PUBLICATIONS}#${HashFragmentRouteConstants.PUBLICATIONS_ARTICLES}`
          }
        ]
      }
    ]
  }
];

export const LinksDrawerList = [
  {
    key: 'links',
    items: [
      {
        text: 'common_introduction',
        icon: <PermDeviceInformation />,
        navigateTo: `#${HashFragmentRouteConstants.LINKS_INTRODUCTION}`
      },
      {
        text: 'common_dictionaries',
        icon: <MenuBook />,
        navigateTo: `#${HashFragmentRouteConstants.LINKS_DICTIONARIES}`
      },
      {
        text: 'common_translation_tools',
        icon: <Translate />,
        navigateTo: `#${HashFragmentRouteConstants.LINKS_TRANSLATION_TOOLS}`
      },
      {
        text: 'common_estonian_texts',
        icon: <LibraryBooks />,
        navigateTo: `#${HashFragmentRouteConstants.LINKS_ESTONIAN_TEXTS}`,
        children: [
          {
            text: 'links_media_texts',
            icon: <Newspaper />,
            navigateTo: `#${HashFragmentRouteConstants.LINKS_MEDIA_TEXTS}`
          },
          {
            text: 'links_literature',
            icon: <Book />,
            navigateTo: `#${HashFragmentRouteConstants.LINKS_LITERATURE}`
          },
          {
            text: 'links_academic_texts',
            icon: <Science />,
            navigateTo: `#${HashFragmentRouteConstants.LINKS_ACADEMIC_TEXTS}`
          }
        ]
      },
      {
        text: 'common_audiovisual_media',
        icon: <PermMedia />,
        navigateTo: `#${HashFragmentRouteConstants.LINKS_AUDIOVISUAL_MEDIA}`,
        children: [
          {
            text: 'links_series_films_videos',
            icon: <Movie />,
            navigateTo: `#${HashFragmentRouteConstants.LINKS_SERIES_FILMS_VIDEOS}`
          },
          {
            text: 'links_radio_audio_podcasts',
            icon: <Radio />,
            navigateTo: `#${HashFragmentRouteConstants.LINKS_RADIO_AUDIO_PODCASTS}`
          }
        ]
      },
      {
        text: 'common_learning_resources',
        icon: <Spellcheck />,
        navigateTo: `#${HashFragmentRouteConstants.LINKS_LEARNING_RESOURCES}`,
        children: [
          {
            text: 'links_language_learning_materials_and_exercises',
            icon: <Dvr />,
            navigateTo: `#${HashFragmentRouteConstants.LINKS_LANGUAGE_LEARNING_MATERIALS_AND_EXERCISES}`
          },
          {
            text: 'links_language_learning_games',
            icon: <Gamepad />,
            navigateTo: `#${HashFragmentRouteConstants.LINKS_LANGUAGE_LEARNING_GAMES}`
          }
        ]
      },
      {
        text: 'common_learning_environments_and_courses',
        icon: <Devices />,
        navigateTo: `#${HashFragmentRouteConstants.LINKS_LEARNING_ENVIRONMENTS_AND_COURSES}`,
        children: [
          {
            text: 'links_language_learning_environments',
            icon: <Keyboard />,
            navigateTo: `#${HashFragmentRouteConstants.LINKS_LANGUAGE_LEARNING_ENVIRONMENTS}`
          },
          {
            text: 'links_language_courses',
            icon: <School />,
            navigateTo: `#${HashFragmentRouteConstants.LINKS_LANGUAGE_COURSES}`
          }
        ]
      },
      {
        text: 'common_for_teachers',
        icon: <Lightbulb />,
        navigateTo: `#${HashFragmentRouteConstants.LINKS_FOR_TEACHERS}`
      },
      {
        text: 'common_estonian_language_corpora',
        icon: <Source />,
        navigateTo: `#${HashFragmentRouteConstants.LINKS_ESTONIAN_LANGUAGE_CORPORA}`
      }
    ]
  }
];

export const DonationSideButtonEnabledPaths = {
  home: '/',
  corrector: `/${RouteConstants.CORRECTOR}`,
  correctorTest: `/${RouteConstants.CORRECTOR_TEST}`
};

export const NavbarPages = [
  { id: 1, title: 'common_corrector', target: RouteConstants.CORRECTOR },
  { id: 2, title: 'common_tools', target: RouteConstants.TOOLS },
  { id: 3, title: 'common_links', target: RouteConstants.LINKS },
  { id: 4, title: 'common_about', target: RouteConstants.ABOUT },
  { id: 5, title: 'common_admin_panel', target: '/admin', role: UserRoles.ADMIN }
];

export const FooterReferencesValues = [
  {
    title: 'footer_references_evkk',
    target: EVKK_VERS1_PATH,
    newTab: true
  },
  {
    title: 'footer_references_elle_github',
    target: EVKK_GITHUB_PATH,
    newTab: true
  },
  {
    title: 'footer_references_elle_license',
    target: MIT_LICENSE_PATH,
    newTab: true
  },
  {
    title: 'footer_references_evkk_license',
    target: CC_BY_4_0_LICENSE_PATH,
    newTab: true
  },
  {
    title: 'common_donate_text',
    target: RouteConstants.ADDING
  }
];

export const FooterToolsValues = [
  {
    title: 'common_query',
    target: RouteConstants.TOOLS,
    state: { pageNo: 'queryOpen' }
  },
  {
    title: 'common_wordlist',
    target: RouteFullPathConstants.TOOLS_WORDLIST
  },
  {
    title: 'common_word_in_context',
    target: RouteFullPathConstants.TOOLS_WORDCONTEXT
  },
  {
    title: 'common_neighbouring_words',
    target: RouteFullPathConstants.TOOLS_COLLOCATES
  },
  {
    title: 'common_word_analyser',
    target: RouteFullPathConstants.TOOLS_WORDANALYSER
  },
  {
    title: 'common_clusters',
    target: RouteFullPathConstants.TOOLS_CLUSTERFINDER
  },
  {
    title: 'common_corrector',
    target: RouteConstants.CORRECTOR
  }
];

export const FooterLinksValues = [
  {
    title: 'common_introduction',
    target: HashFragmentRouteConstants.LINKS_INTRODUCTION,
    prefix: RouteConstants.LINKS,
    connector: '#'
  },
  {
    title: 'common_dictionaries',
    target: HashFragmentRouteConstants.LINKS_DICTIONARIES,
    prefix: RouteConstants.LINKS,
    connector: '#'
  },
  {
    title: 'common_translation_tools',
    target: HashFragmentRouteConstants.LINKS_TRANSLATION_TOOLS,
    prefix: RouteConstants.LINKS,
    connector: '#'
  },
  {
    title: 'common_estonian_texts',
    target: HashFragmentRouteConstants.LINKS_ESTONIAN_TEXTS,
    prefix: RouteConstants.LINKS,
    connector: '#'
  },
  {
    title: 'common_audiovisual_media',
    target: HashFragmentRouteConstants.LINKS_AUDIOVISUAL_MEDIA,
    prefix: RouteConstants.LINKS,
    connector: '#'
  },
  {
    title: 'common_learning_resources',
    target: HashFragmentRouteConstants.LINKS_LEARNING_RESOURCES,
    prefix: RouteConstants.LINKS,
    connector: '#'
  },
  {
    title: 'common_learning_environments_and_courses',
    target: HashFragmentRouteConstants.LINKS_LEARNING_ENVIRONMENTS_AND_COURSES,
    prefix: RouteConstants.LINKS,
    connector: '#'
  },
  {
    title: 'common_for_teachers',
    target: HashFragmentRouteConstants.LINKS_FOR_TEACHERS,
    prefix: RouteConstants.LINKS,
    connector: '#'
  },
  {
    title: 'common_estonian_language_corpora',
    target: HashFragmentRouteConstants.LINKS_ESTONIAN_LANGUAGE_CORPORA,
    prefix: RouteConstants.LINKS,
    connector: '#'
  }
];

export const FooterAboutValues = [
  {
    title: 'common_us',
    target: RouteFullPathConstants.ABOUT_US
  },
  {
    title: 'common_people',
    target: RouteFullPathConstants.ABOUT_PEOPLE
  },
  {
    title: 'common_grants',
    target: RouteFullPathConstants.ABOUT_GRANTS
  },
  {
    title: 'common_publications',
    target: RouteFullPathConstants.ABOUT_PUBLICATIONS
  }
];

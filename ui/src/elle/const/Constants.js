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
import { HashFragmentRouteConstants, RouteConstants } from '../../AppRoutes';
import WordlistIcon from '../resources/images/tools/sonaloend.png';
import WordContextIcon from '../resources/images/tools/sona_kontekstis.png';
import CollocatesIcon from '../resources/images/tools/naabersonad.png';
import WordAnalyserIcon from '../resources/images/tools/sonaanalyys.png';
import ClusterfinderIcon from '../resources/images/tools/mustrileidja.png';

export const WORDANALYSER_MAX_WORD_COUNT_FOR_WORDINFO = 1000;

export const replaceCombined = /<\/?span[^>]*>|<\/?div[^>]*>/g;
export const replaceSpaceTags = /&nbsp; ?/g;
export const replaceQuotes = /&quot;/g;
export const replaceDots = /\.{2,}/g;
export const replaceSpaces = /\s\s+/g;

export const breadcrumbNameMap = {
  '/corrector': 'common_corrector',
  '/tools': 'common_tools',
  '/links': 'common_links',
  '/about': 'common_about',
  '/about/us': 'common_us',
  '/about/people': 'common_people',
  '/about/grants': 'common_grants',
  '/about/publications': 'common_publications',
  '/adding': 'common_publish_your_text',
  '/login': 'common_login_for_admins',
  '/tools/clusterfinder': 'common_clusters',
  '/tools/wordanalyser': 'common_word_analyser',
  '/tools/wordlist': 'common_wordlist',
  '/tools/wordcontext': 'common_word_in_context',
  '/tools/collocates': 'common_neighbouring_words',
  '/admin': 'common_admin_panel',
  '/corrector-test': 'common_corrector'
};

export const UserRoles = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export const addedYearOptions = [
  '2000–2005',
  '2006–2010',
  '2011–2015',
  '2016–2020',
  '2021...'
];

export const charactersOptions = [
  'query_text_data_char_up_to_500',
  '501–1000',
  '1001–1500',
  '1501–2500',
  '2501–5000',
  'query_text_data_char_over_5000'
];

export const wordsOptions = [
  'query_text_data_words_up_to_100',
  '101–200',
  '201–300',
  '301–400',
  '401–600',
  '601–800',
  'query_text_data_words_over_800'
];

export const sentencesOptions = [
  'query_text_data_sentences_up_to_10',
  '11–20',
  '21–30',
  '31–60',
  '61–100',
  'query_text_data_sentences_over_100'
];

export const textLevelOptions = [
  'A',
  'B',
  'C',
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'C2'
];

export const corpuses = {
  'cFqPphvYi': 'query_subcoprus_L2_olympiade',
  'clWmOIrLa': 'query_subcorpus_L2_proficiency_examinations',
  'cFOoRQekA': 'query_subcorpus_L2_estonian',
  'cYDRkpymb': 'query_subcorpus_L1_estonian',
  'cgSRJPKTr': 'query_subcorpus_L1_russian',
  'cZjHWUPtD': 'query_subcorpus_L3_russian',
  'cwUSEqQLt': 'query_subcorpus_academic_estonian'
};

export const textTypeList = {
  'k2eesti_riiklik_eksamitoo': 'common_text_data_type_L2_proficiency_examination',
  'k2eesti_ol_loovkirjutis': 'common_text_data_type_L2_olympiade_creative_writing',
  'k2eesti_kiri_isiklik': 'query_text_data_type_L2_letter_informal_full',
  'k2eesti_kiri_poolametlik': 'query_text_data_type_L2_letter_semi_formal_full',
  'k2eesti_loovkirjutis': 'query_text_data_type_L2_creative_writing',
  'k2eesti_harjutus_dialoog': 'query_text_data_type_L2_exercise_dialogue_full',
  'k2eesti_harjutus_etteutlus': 'query_text_data_type_L2_exercise_dictation_full',
  'k2eesti_harjutus_juhend': 'query_text_data_type_L2_exercise_instruction_full',
  'k2eesti_harjutus_kirjeldus': 'query_text_data_type_L2_exercise_description_full',
  'k2eesti_harjutus_kuulutus': 'query_text_data_type_L2_exercise_announcement_full',
  'k2eesti_harjutus_kone': 'query_text_data_type_L2_exercise_speech_full',
  'k2eesti_harjutus_laused': 'query_text_data_type_L2_exercise_sentence_construction_full',
  'k2eesti_harjutus_leping': 'query_text_data_type_L2_exercise_contract_full',
  'k2eesti_harjutus_lunktekst': 'query_text_data_type_L2_exercise_fill_in_the_blanks_full',
  'k2eesti_harjutus_menuu': 'query_text_data_type_L2_exercise_menu_full',
  'k2eesti_harjutus_reklaam': 'query_text_data_type_L2_exercise_ad_full',
  'k2eesti_harjutus_retsept': 'query_text_data_type_L2_exercise_recipe_full',
  'k2eesti_harjutus_teejuht': 'query_text_data_type_L2_exercise_guide_full',
  'k2eesti_harjutus_vastused': 'query_text_data_type_L2_exercise_answering_questions_full',
  'k2eesti_harjutus_umberjutustus': 'query_text_data_type_L2_exercise_retelling_full',
  'k2eesti_eksamitoo': 'query_text_data_type_L2_examination',
  'k2eesti_kontrolltoo_test': 'query_text_data_type_L2_test',
  'k2eesti_tolge': 'query_text_data_type_L2_translation',
  'k1eesti_arvamuslugu': 'query_text_data_type_L1_opinion_piece',
  'k1eesti_eksamitoo': 'query_text_data_type_L1_examination',
  'k1eesti_harjutus': 'query_text_data_type_L1_exercise',
  'k1vene_loovkirjutis': 'query_text_data_type_L1_russian_creative_writing',
  'k1vene_eksamitoo': 'query_text_data_type_L1_russian_examination',
  'k3vene_loovkirjutis': 'query_text_data_type_L3_russian_creative_writing',
  'k3vene_eksamitoo': 'query_text_data_type_L3_russian_examination',
  'ak_eriala_analuus': 'query_text_data_type_academic_studies_analysis_full',
  'ak_eriala_essee': 'query_text_data_type_academic_studies_essay_full',
  'ak_eriala_kursusetoo': 'query_text_data_type_academic_studies_course_paper_full',
  'ak_eriala_referaat': 'query_text_data_type_academic_studies_report_full',
  'ak_eriala_retsensioon': 'query_text_data_type_academic_studies_review_full',
  'ak_eriala_seminaritoo': 'query_text_data_type_academic_studies_seminar_paper_full',
  'ak_eriala_ulevaade': 'query_text_data_type_academic_studies_overview_full',
  'ak_uurimus_artikkel': 'query_text_data_type_academic_research_research_article_full',
  'ak_uurimus_ettekanne': 'query_text_data_type_academic_research_presentation_full',
  'ak_uurimus_kokkuvote': 'query_text_data_type_academic_research_summary_full',
  'ak_uurimus_batoo': 'query_text_data_type_academic_research_bachelors_thesis_full',
  'ak_uurimus_diplomitoo': 'query_text_data_type_academic_research_thesis_full',
  'ak_uurimus_matoo': 'query_text_data_type_academic_research_masters_thesis_full',
  'ak_uurimus_phdtoo': 'query_text_data_type_academic_research_doctoral_thesis_full'
};

export const textTypesOptions = {
  'clWmOIrLa': {
    'k2eesti_riiklik_eksamitoo': 'common_text_data_type_L2_proficiency_examination'
  },
  'cFqPphvYi': {
    'k2eesti_ol_loovkirjutis': 'common_text_data_type_L2_olympiade_creative_writing'
  },
  'cFOoRQekA': {
    'query_text_data_type_L2_letter': {
      'k2eesti_kiri_isiklik': 'query_text_data_type_L2_letter_informal',
      'k2eesti_kiri_poolametlik': 'query_text_data_type_L2_letter_semi_formal'
    },
    'k2eesti_loovkirjutis': 'query_text_data_type_L2_creative_writing',
    'query_text_data_type_L2_exercise': {
      'k2eesti_harjutus_dialoog': 'query_text_data_type_L2_exercise_dialogue',
      'k2eesti_harjutus_etteutlus': 'query_text_data_type_L2_exercise_dictation',
      'k2eesti_harjutus_juhend': 'query_text_data_type_L2_exercise_instruction',
      'k2eesti_harjutus_kirjeldus': 'query_text_data_type_L2_exercise_description',
      'k2eesti_harjutus_kuulutus': 'query_text_data_type_L2_exercise_announcement',
      'k2eesti_harjutus_kone': 'query_text_data_type_L2_exercise_speech',
      'k2eesti_harjutus_laused': 'query_text_data_type_L2_exercise_sentence_construction',
      'k2eesti_harjutus_leping': 'query_text_data_type_L2_exercise_contract',
      'k2eesti_harjutus_lunktekst': 'query_text_data_type_L2_exercise_fill_in_the_blanks',
      'k2eesti_harjutus_menuu': 'query_text_data_type_L2_exercise_menu',
      'k2eesti_harjutus_reklaam': 'query_text_data_type_L2_exercise_ad',
      'k2eesti_harjutus_retsept': 'query_text_data_type_L2_exercise_recipe',
      'k2eesti_harjutus_teejuht': 'query_text_data_type_L2_exercise_guide',
      'k2eesti_harjutus_vastused': 'query_text_data_type_L2_exercise_answering_questions',
      'k2eesti_harjutus_umberjutustus': 'query_text_data_type_L2_exercise_retelling'
    },
    'k2eesti_eksamitoo': 'query_text_data_type_L2_examination',
    'k2eesti_kontrolltoo_test': 'query_text_data_type_L2_test',
    'k2eesti_tolge': 'query_text_data_type_L2_translation'
  },
  'cYDRkpymb': {
    'k1eesti_arvamuslugu': 'query_text_data_type_L1_opinion_piece',
    // currently no texts present in the database
    // 'k1eesti_eksamitoo': 'query_text_data_type_L1_examination',
    'k1eesti_harjutus': 'query_text_data_type_L1_exercise'
  },
  'cgSRJPKTr': {
    'k1vene_loovkirjutis': 'query_text_data_type_L1_russian_creative_writing',
    'k1vene_eksamitoo': 'query_text_data_type_L1_russian_examination'
  },
  'cZjHWUPtD': {
    'k3vene_loovkirjutis': 'query_text_data_type_L3_russian_creative_writing',
    'k3vene_eksamitoo': 'query_text_data_type_L3_russian_examination'
  },
  'cwUSEqQLt': {
    'query_text_data_type_academic_studies': {
      'ak_eriala_analuus': 'query_text_data_type_academic_studies_analysis',
      'ak_eriala_essee': 'query_text_data_type_academic_studies_essay',
      'ak_eriala_kursusetoo': 'query_text_data_type_academic_studies_course_paper',
      'ak_eriala_referaat': 'query_text_data_type_academic_studies_report',
      'ak_eriala_retsensioon': 'query_text_data_type_academic_studies_review',
      'ak_eriala_seminaritoo': 'query_text_data_type_academic_studies_seminar_paper',
      'ak_eriala_ulevaade': 'query_text_data_type_academic_studies_overview'
    },
    'query_text_data_type_academic_research': {
      // currently no texts present in the database
      // 'ak_uurimus_artikkel': 'query_text_data_type_academic_research_research_article',
      'ak_uurimus_ettekanne': 'query_text_data_type_academic_research_presentation',
      'ak_uurimus_kokkuvote': 'query_text_data_type_academic_research_summary',
      'ak_uurimus_batoo': 'query_text_data_type_academic_research_bachelors_thesis',
      'ak_uurimus_diplomitoo': 'query_text_data_type_academic_research_thesis',
      'ak_uurimus_matoo': 'query_text_data_type_academic_research_masters_thesis'
      // currently no texts present in the database
      // 'ak_uurimus_phdtoo': 'query_text_data_type_academic_research_doctoral_thesis'
    }
  }
};

export const textPublishSubTextTypesOptions = {
  'k2eesti_riiklik_eksamitoo': 'common_text_data_type_L2_proficiency_examination',
  'k2eesti_ol_loovkirjutis': 'common_text_data_type_L2_olympiade_creative_writing',
  'k2eesti_keeleope_disabled': 'query_subcorpus_L2_estonian',
  'k2eesti_tolge': 'common_text_data_type_translation',
  'k2eesti_eksamitoo': 'common_text_data_type_examination',
  'k2eesti_kontrolltoo_test': 'common_text_data_type_test',
  'k2eesti_loovkirjutis': 'common_text_data_type_creative_writing',
  'k2eesti_kiri_disabled': 'query_text_data_type_L2_letter',
  'k2eesti_kiri_isiklik': 'query_text_data_type_L2_letter_informal',
  'k2eesti_kiri_poolametlik': 'query_text_data_type_L2_letter_semi_formal',
  'k2eesti_harjutus_disabled': 'query_text_data_type_L2_exercise',
  'k2eesti_harjutus_dialoog': 'query_text_data_type_L2_exercise_dialogue',
  'k2eesti_harjutus_etteutlus': 'query_text_data_type_L2_exercise_dictation',
  'k2eesti_harjutus_juhend': 'query_text_data_type_L2_exercise_instruction',
  'k2eesti_harjutus_kirjeldus': 'query_text_data_type_L2_exercise_description',
  'k2eesti_harjutus_kuulutus': 'query_text_data_type_L2_exercise_announcement',
  'k2eesti_harjutus_kone': 'query_text_data_type_L2_exercise_speech',
  'k2eesti_harjutus_laused': 'query_text_data_type_L2_exercise_sentence_construction',
  'k2eesti_harjutus_leping': 'query_text_data_type_L2_exercise_contract',
  'k2eesti_harjutus_lunktekst': 'query_text_data_type_L2_exercise_fill_in_the_blanks',
  'k2eesti_harjutus_menuu': 'query_text_data_type_L2_exercise_menu',
  'k2eesti_harjutus_reklaam': 'query_text_data_type_L2_exercise_ad',
  'k2eesti_harjutus_retsept': 'query_text_data_type_L2_exercise_recipe',
  'k2eesti_harjutus_teejuht': 'query_text_data_type_L2_exercise_guide',
  'k2eesti_harjutus_vastused': 'query_text_data_type_L2_exercise_answering_questions',
  'k2eesti_harjutus_umberjutustus': 'query_text_data_type_L2_exercise_retelling',
  'k1eesti_disabled': 'query_subcorpus_L1_estonian',
  'k1eesti_arvamuslugu': 'common_text_data_type_opinion_piece',
  'k1eesti_eksamitoo': 'common_text_data_type_examination',
  'k1eesti_harjutus': 'common_text_data_type_exercise'
};

export const usedMaterialsMultiOptions = {
  'query_text_data_used_study_or_supporting_materials_yes': {
    'tolkesonastik': 'query_text_data_used_study_or_supporting_materials_translation_dictionary_or_machine_translation',
    'ykskeelnesonastik': 'query_text_data_used_study_or_supporting_materials_monolingual_dictionary',
    'terminisonastik': 'query_text_data_used_study_or_supporting_materials_term_glossary_or_base',
    'kasiraamat': 'query_text_data_used_study_or_supporting_materials_professional_handbook',
    'automaatkontroll': 'query_text_data_used_study_or_supporting_materials_automated_correction',
    'muu': 'common_other'
  },
  'ei': 'query_text_data_used_study_or_supporting_materials_no'
};

export const usedMaterialsMultiList = {
  'tolkesonastik': 'query_text_data_used_study_or_supporting_materials_translation_dictionary_or_machine_translation',
  'ykskeelnesonastik': 'query_text_data_used_study_or_supporting_materials_monolingual_dictionary',
  'terminisonastik': 'query_text_data_used_study_or_supporting_materials_term_glossary_or_base',
  'kasiraamat': 'query_text_data_used_study_or_supporting_materials_professional_handbook',
  'automaatkontroll': 'query_text_data_used_study_or_supporting_materials_automated_correction',
  'muu': 'common_other',
  'ei': 'query_text_data_used_study_or_supporting_materials_no'
};

export const textLanguageOptions = {
  'eesti': 'query_common_language_et',
  'vene': 'query_common_language_ru'
};

export const domainDisplayOptions = {
  // currently no texts present in the database
  // 'biojakeskkonnateadused': 'common_text_data_field_of_research_biosciences_and_environment',
  'yhiskondjakultuur': 'common_text_data_field_of_research_culture_and_society',
  // currently no texts present in the database
  // 'terviseuuringud': 'common_text_data_field_of_research_health',
  'loodustehnika': 'common_text_data_field_of_research_natural_sciences_and_engineering'
};

export const domainSaveOptions = {
  'biojakeskkonnateadused': 'common_text_data_field_of_research_biosciences_and_environment',
  'yhiskondjakultuur': 'common_text_data_field_of_research_culture_and_society',
  'terviseuuringud': 'common_text_data_field_of_research_health',
  'loodustehnika': 'common_text_data_field_of_research_natural_sciences_and_engineering'
};

export const usedMaterialsDisplayOptions = {
  'jah': 'query_text_data_used_supporting_materials_yes',
  'ei': 'query_text_data_used_supporting_materials_no'
};

export const usedMaterialsSaveOptions = {
  'true': 'query_text_data_used_supporting_materials_yes',
  'false': 'query_text_data_used_supporting_materials_no'
};

export const ageOptions = {
  'kuni18': 'query_author_data_age_up_to_18',
  'kuni26': '19–26',
  'kuni40': '27–40',
  '41plus': 'query_author_data_age_over_40'
};

export const genderOptions = {
  'mees': 'query_author_data_gender_male',
  'naine': 'query_author_data_gender_female'
};

export const studyLevelOptions = {
  'bakalaureuseope': 'query_author_data_level_of_study_bachelors_studies',
  'magistriope': 'query_author_data_level_of_study_masters_studies',
  'doktoriope': 'query_author_data_level_of_study_doctoral_studies'
};

export const degreeOptions = {
  'ba': 'query_author_data_degree_bachelors',
  'ma': 'query_author_data_degree_masters',
  'phd': 'query_author_data_degree_doctoral'
};

export const educationOptions = {
  'Alg-/põhiharidus': 'query_author_data_education_elementary',
  'Keskharidus': 'query_author_data_education_secondary',
  'Keskeriharidus/kutseharidus': 'query_author_data_education_vocational',
  'Kõrgharidus': 'query_author_data_education_higher'
};

export const textPublishMainTextTypesOptions = {
  'akadeemiline': 'publish_your_text_text_data_main_text_type_academic',
  'mitteakadeemiline': 'publish_your_text_text_data_main_text_type_non_academic'
};

export const textPublishAcademicCategoryOptions = {
  'ak_erialaopingud': 'publish_your_text_text_data_academic_category_academic_studies',
  'ak_uurimused': 'publish_your_text_text_data_academic_category_research'
};

export const textPublishAcademicStudiesSubtypeOptions = {
  'ak_analuus': 'query_text_data_type_academic_studies_analysis',
  'ak_eriala_essee': 'query_text_data_type_academic_studies_essay',
  'ak_eriala_kursusetoo': 'query_text_data_type_academic_studies_course_paper',
  'ak_eriala_referaat': 'query_text_data_type_academic_studies_report',
  'ak_eriala_retsensioon': 'query_text_data_type_academic_studies_review',
  'ak_eriala_seminaritoo': 'query_text_data_type_academic_studies_seminar_paper',
  'ak_eriala_ulevaade': 'query_text_data_type_academic_studies_overview'
};

export const textPublishAcademicResearchSubtypeOptions = {
  'ak_uurimus_artikkel': 'query_text_data_type_academic_research_research_article',
  'ak_uurimus_ettekanne': 'query_text_data_type_academic_research_presentation',
  'ak_uurimus_kokkuvote': 'query_text_data_type_academic_research_summary',
  'ak_uurimus_batoo': 'query_text_data_type_academic_research_bachelors_thesis',
  'ak_uurimus_diplomitoo': 'query_text_data_type_academic_research_thesis',
  'ak_uurimus_matoo': 'query_text_data_type_academic_research_masters_thesis',
  'ak_uurimus_phdtoo': 'query_text_data_type_academic_research_doctoral_thesis'
};

export const textPublishUsedMaterialsOptions = {
  'tolkesonastik': 'query_text_data_used_study_or_supporting_materials_translation_dictionary_or_machine_translation',
  'ykskeelnesonastik': 'query_text_data_used_study_or_supporting_materials_monolingual_dictionary',
  'terminisonastik': 'query_text_data_used_study_or_supporting_materials_term_glossary_or_base',
  'kasiraamat': 'query_text_data_used_study_or_supporting_materials_professional_handbook',
  'automaatkontroll': 'query_text_data_used_study_or_supporting_materials_automated_correction',
  'muu': 'common_other'
};

export const nationalityOptions = {
  'Eesti': 'query_common_nationality_et',
  'Afganistan': 'query_common_nationality_af',
  'Aserbaidžaan': 'query_common_nationality_az',
  'Ameerika Ühendriigid': 'query_common_nationality_us',
  'Brasiilia': 'query_common_nationality_br',
  'Bulgaaria': 'query_common_nationality_bg',
  'Egiptus': 'query_common_nationality_eg',
  'Filipiinid': 'query_common_nationality_ph',
  'Hiina': 'query_common_nationality_cn',
  'Hispaania': 'query_common_nationality_es',
  'Holland': 'query_common_nationality_nl',
  'Iirimaa': 'query_common_nationality_ie',
  'India': 'query_common_nationality_in',
  'Itaalia': 'query_common_nationality_it',
  'Kanada': 'query_common_nationality_ca',
  'Kasashstan': 'query_common_nationality_kz',
  'Kreeka': 'query_common_nationality_gr',
  'Leedu': 'query_common_nationality_lt',
  'Läti': 'query_common_nationality_lv',
  'Makedoonia': 'query_common_nationality_mk',
  'Moldova': 'query_common_nationality_md',
  'Määramata': 'query_common_nationality_unassigned',
  'Poola': 'query_common_nationality_pl',
  'Prantsusmaa': 'query_common_nationality_fr',
  'Rumeenia': 'query_common_nationality_ro',
  'Saksamaa': 'query_common_nationality_de',
  'Soome': 'query_common_nationality_fi',
  'Suurbritannia': 'query_common_nationality_gb',
  'Süüria': 'query_common_nationality_sy',
  'Türgi': 'query_common_nationality_tr',
  'Ukraina': 'query_common_nationality_ua',
  'Ungari': 'query_common_nationality_hu',
  'Valgevene': 'query_common_nationality_by',
  'Venemaa': 'query_common_nationality_ru',
  'Venezuela': 'query_common_nationality_ve'
};

export const languageOptionsForNativeLangs = {
  'eesti': 'query_common_language_et',
  'vene': 'query_common_language_ru',
  'eesti, vene': 'query_common_language_et_ru',
  'soome': 'query_common_language_fi',
  'saksa': 'query_common_language_de',
  'ukraina': 'query_common_language_ua',
  'valgevene': 'query_common_language_by',
  'läti': 'query_common_language_lv',
  'leedu': 'query_common_language_lt',
  'rootsi': 'query_common_language_se',
  'inglise': 'query_common_language_en',
  'jidiš': 'query_common_language_ji',
  'poola': 'query_common_language_pl',
  'ungari': 'query_common_language_hu'
};

export const languageOptionsForOtherLangs = {
  'eesti': 'query_common_language_et',
  'vene': 'query_common_language_ru',
  'hiina': 'query_common_language_cn',
  'inglise': 'query_common_language_en',
  'jaapani': 'query_common_language_jp',
  'läti': 'query_common_language_lv',
  'prantsuse': 'query_common_language_fr',
  'saksa': 'query_common_language_de'
};

export const countryOptionsForQuery = {
  'Eesti': 'query_common_country_et',
  'Soome': 'query_common_country_fi',
  'Leedu': 'query_common_country_lt',
  'Saksamaa': 'query_common_country_de',
  'Inglismaa': 'query_common_country_en',
  'Ungari': 'query_common_country_hu'
};

export const countryOptionsForQueryResults = {
  'Eesti': 'query_common_country_et',
  'Soome': 'query_common_country_fi',
  'Leedu': 'query_common_country_lt',
  'Saksamaa': 'query_common_country_de',
  'Inglismaa': 'query_common_country_en',
  'Ungari': 'query_common_country_hu',
  'Muu': 'query_common_country_other'
};

export const countryOptionsForAddingText = {
  'Eesti': 'query_common_country_et',
  'Soome': 'query_common_country_fi',
  'Rootsi': 'query_common_country_se',
  'Venemaa': 'query_common_country_ru',
  'Läti': 'query_common_country_lv',
  'Leedu': 'query_common_country_lt',
  'Saksamaa': 'query_common_country_de',
  'Inglismaa': 'query_common_country_en',
  'Ungari': 'query_common_country_hu'
};

export const donationSideButtonEnabledPaths = {
  home: '/',
  corrector: `/${RouteConstants.CORRECTOR}`,
  correctorTest: `/${RouteConstants.CORRECTOR_TEST}`
};

export const toolsDrawerList = [
  {
    key: 'tool-management',
    items: [
      {
        text: 'query_choose_texts',
        icon: <ManageSearch />,
        customAction: true
      },
      {
        text: 'query_own_texts',
        icon: <ReadMore />,
        customAction: true
      },
      {
        text: 'query_results_saved_for_analysis',
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

export const aboutUsDrawerList = [
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

export const linksDrawerList = [
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

export const textToSpeechVoices = {
  mari: 'Mari',
  albert: 'Albert',
  kalev: 'Kalev'
};

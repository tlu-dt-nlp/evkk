export const WORDANALYSER_MAX_WORD_COUNT_FOR_WORDINFO = 1000;
export const STATISTICS_CORPUS_TEXT_COUNT = '14 000+';
export const STATISTICS_CORPUS_WORD_COUNT = '3 000 000+';

export const replaceCombined = /<\/?span[^>]*>|<\/?div[^>]*>/g;
export const replaceSpaceTags = /&nbsp; ?/g;
export const replaceQuotes = /&quot;/g;
export const replaceDots = /\.{2,}/g;
export const replaceSpaces = /\s\s+/g;

export const UserRoles = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export const scoreOptions = [
  { key: 'query_text_data_score_under_50', range: 'alla 50%' },
  { key: '51–60%', range: '51-60%' },
  { key: '61–70%', range: '61-70%' },
  { key: '71–80%', range: '71-80%' },
  { key: 'query_text_data_score_over_80', range: 'üle 80%' }
];

export const addedYearOptions = [
  { key: '2000–2005', range: '2000-2005' },
  { key: '2006–2010', range: '2006-2010' },
  { key: '2011–2015', range: '2011-2015' },
  { key: '2016–2020', range: '2016-2020' },
  { key: '2021–2025', range: '2021-2025' }
];

export const charactersOptions = [
  { key: 'query_text_data_char_up_to_500', range: [0, 500] },
  { key: '501–1000', range: [501, 1000] },
  { key: '1001–1500', range: [1001, 1500] },
  { key: '1501–2500', range: [1501, 2500] },
  { key: '2501–5000', range: [2501, 5000] },
  { key: 'query_text_data_char_over_5000', range: [5001, 2147483647] }
];

export const wordsOptions = [
  { key: 'query_text_data_words_up_to_100', range: [0, 100] },
  { key: '101–200', range: [101, 200] },
  { key: '201–300', range: [201, 300] },
  { key: '301–400', range: [301, 400] },
  { key: '401–600', range: [401, 600] },
  { key: '601–800', range: [601, 800] },
  { key: 'query_text_data_words_over_800', range: [801, 2147483647] }
];

export const sentencesOptions = [
  { key: 'query_text_data_sentences_up_to_10', range: [0, 10] },
  { key: '11–20', range: [11, 20] },
  { key: '21–30', range: [21, 30] },
  { key: '31–60', range: [31, 60] },
  { key: '61–100', range: [61, 100] },
  { key: 'query_text_data_sentences_over_100', range: [101, 2147483647] }
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
  'ak_eriala_analuus': 'query_text_data_type_academic_studies_analysis_full',
  'ak_eriala_essee': 'query_text_data_type_academic_studies_essay_full',
  'ak_eriala_kursusetoo': 'query_text_data_type_academic_studies_course_paper_full',
  'ak_eriala_referaat': 'query_text_data_type_academic_studies_report_full',
  'ak_eriala_retsensioon': 'query_text_data_type_academic_studies_review_full',
  'ak_eriala_seminaritoo': 'query_text_data_type_academic_studies_seminar_paper_full',
  'ak_eriala_ulevaade': 'query_text_data_type_academic_studies_overview_full',
  'ak_uurimus_artikkel': 'query_text_data_type_academic_research_research_article_full',
  'ak_uurimus_batoo': 'query_text_data_type_academic_research_bachelors_thesis_full',
  'ak_uurimus_diplomitoo': 'query_text_data_type_academic_research_thesis_full',
  'ak_uurimus_ettekanne': 'query_text_data_type_academic_research_presentation_full',
  'ak_uurimus_kokkuvote': 'query_text_data_type_academic_research_summary_full',
  'ak_uurimus_matoo': 'query_text_data_type_academic_research_masters_thesis_full',
  'ak_uurimus_phdtoo': 'query_text_data_type_academic_research_doctoral_thesis_full',
  'k1eesti_arvamuslugu': 'query_text_data_type_L1_opinion_piece',
  'k1eesti_ekirjand_12kl': 'query_text_data_type_L1_e_essay_12th_grade_full',
  'k1eesti_ekirjand_9kl': 'query_text_data_type_L1_e_essay_9th_grade_full',
  'k1eesti_eksamitoo': 'query_text_data_type_L1_examination',
  'k1eesti_harjutus': 'query_text_data_type_L1_exercise',
  'k1vene_eksamitoo': 'query_text_data_type_L1_russian_examination',
  'k1vene_loovkirjutis': 'query_text_data_type_L1_russian_creative_writing',
  'k2eesti_eksamitoo': 'query_text_data_type_L2_examination',
  'k2eesti_harjutus_dialoog': 'query_text_data_type_L2_exercise_dialogue_full',
  'k2eesti_harjutus_etteutlus': 'query_text_data_type_L2_exercise_dictation_full',
  'k2eesti_harjutus_juhend': 'query_text_data_type_L2_exercise_instruction_full',
  'k2eesti_harjutus_kirjeldus': 'query_text_data_type_L2_exercise_description_full',
  'k2eesti_harjutus_kone': 'query_text_data_type_L2_exercise_speech_full',
  'k2eesti_harjutus_kuulutus': 'query_text_data_type_L2_exercise_announcement_full',
  'k2eesti_harjutus_laused': 'query_text_data_type_L2_exercise_sentence_construction_full',
  'k2eesti_harjutus_leping': 'query_text_data_type_L2_exercise_contract_full',
  'k2eesti_harjutus_lunktekst': 'query_text_data_type_L2_exercise_fill_in_the_blanks_full',
  'k2eesti_harjutus_menuu': 'query_text_data_type_L2_exercise_menu_full',
  'k2eesti_harjutus_reklaam': 'query_text_data_type_L2_exercise_ad_full',
  'k2eesti_harjutus_retsept': 'query_text_data_type_L2_exercise_recipe_full',
  'k2eesti_harjutus_teejuht': 'query_text_data_type_L2_exercise_guide_full',
  'k2eesti_harjutus_umberjutustus': 'query_text_data_type_L2_exercise_retelling_full',
  'k2eesti_harjutus_vastused': 'query_text_data_type_L2_exercise_answering_questions_full',
  'k2eesti_kiri_isiklik': 'query_text_data_type_L2_letter_informal_full',
  'k2eesti_kiri_poolametlik': 'query_text_data_type_L2_letter_semi_formal_full',
  'k2eesti_kontrolltoo_test': 'query_text_data_type_L2_test',
  'k2eesti_loovkirjutis': 'query_text_data_type_L2_creative_writing',
  'k2eesti_ol_loovkirjutis': 'common_text_data_type_L2_olympiade_creative_writing',
  'k2eesti_riiklik_eksamitoo': 'common_text_data_type_L2_proficiency_examination',
  'k2eesti_tolge': 'query_text_data_type_L2_translation',
  'k3vene_eksamitoo': 'query_text_data_type_L3_russian_examination',
  'k3vene_loovkirjutis': 'query_text_data_type_L3_russian_creative_writing'
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
    'k1eesti_harjutus': 'query_text_data_type_L1_exercise',
    'query_text_data_type_L1_e_essay': {
      'k1eesti_ekirjand_9kl': 'query_text_data_type_L1_e_essay_9th_grade',
      'k1eesti_ekirjand_12kl': 'query_text_data_type_L1_e_essay_12th_grade'
    }
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

export const textPublishTextSubtypesOptions = {
  'k2eesti_riiklik_eksamitoo': 'common_text_data_type_L2_proficiency_examination',
  'k2eesti_ol_loovkirjutis': 'common_text_data_type_L2_olympiade_creative_writing',
  'k2eesti_keeleope_disabled': 'query_subcorpus_L2_estonian',
  'k2eesti_tolge_child': 'common_text_data_type_translation',
  'k2eesti_eksamitoo_child': 'common_text_data_type_examination',
  'k2eesti_kontrolltoo_test_child': 'common_text_data_type_test',
  'k2eesti_loovkirjutis_child': 'common_text_data_type_creative_writing',
  'k2eesti_kiri_disabled': 'query_text_data_type_L2_letter',
  'k2eesti_kiri_isiklik_child': 'query_text_data_type_L2_letter_informal',
  'k2eesti_kiri_poolametlik_child': 'query_text_data_type_L2_letter_semi_formal',
  'k2eesti_harjutus_disabled': 'query_text_data_type_L2_exercise',
  'k2eesti_harjutus_dialoog_child': 'query_text_data_type_L2_exercise_dialogue',
  'k2eesti_harjutus_etteutlus_child': 'query_text_data_type_L2_exercise_dictation',
  'k2eesti_harjutus_juhend_child': 'query_text_data_type_L2_exercise_instruction',
  'k2eesti_harjutus_kirjeldus_child': 'query_text_data_type_L2_exercise_description',
  'k2eesti_harjutus_kuulutus_child': 'query_text_data_type_L2_exercise_announcement',
  'k2eesti_harjutus_kone_child': 'query_text_data_type_L2_exercise_speech',
  'k2eesti_harjutus_laused_child': 'query_text_data_type_L2_exercise_sentence_construction',
  'k2eesti_harjutus_leping_child': 'query_text_data_type_L2_exercise_contract',
  'k2eesti_harjutus_lunktekst_child': 'query_text_data_type_L2_exercise_fill_in_the_blanks',
  'k2eesti_harjutus_menuu_child': 'query_text_data_type_L2_exercise_menu',
  'k2eesti_harjutus_reklaam_child': 'query_text_data_type_L2_exercise_ad',
  'k2eesti_harjutus_retsept_child': 'query_text_data_type_L2_exercise_recipe',
  'k2eesti_harjutus_teejuht_child': 'query_text_data_type_L2_exercise_guide',
  'k2eesti_harjutus_vastused_child': 'query_text_data_type_L2_exercise_answering_questions',
  'k2eesti_harjutus_umberjutustus_child': 'query_text_data_type_L2_exercise_retelling',
  'k1eesti_disabled': 'query_subcorpus_L1_estonian',
  'k1eesti_arvamuslugu_child': 'common_text_data_type_opinion_piece',
  'k1eesti_eksamitoo_child': 'common_text_data_type_examination',
  'k1eesti_harjutus_child': 'common_text_data_type_exercise'
};

export const usedMaterialsMultiOptions = {
  'query_text_data_used_study_or_supporting_materials_yes': {
    'tehisintellekt': 'query_text_data_used_study_or_supporting_materials_generative_ai',
    'keeleoppematerjalid': 'query_text_data_used_study_or_supporting_materials_language_learning_materials',
    'automaatkontroll': 'query_text_data_used_study_or_supporting_materials_automated_correction',
    'tolkesonastik': 'query_text_data_used_study_or_supporting_materials_translation_dictionary_or_machine_translation',
    'ykskeelnesonastik': 'query_text_data_used_study_or_supporting_materials_monolingual_dictionary',
    'terminisonastik': 'query_text_data_used_study_or_supporting_materials_term_glossary_or_base',
    'kasiraamat': 'query_text_data_used_study_or_supporting_materials_professional_handbook',
    'muu': 'common_other'
  },
  'ei': 'query_text_data_used_study_or_supporting_materials_no'
};

export const usedMaterialsMultiList = {
  'tehisintellekt': 'query_text_data_used_study_or_supporting_materials_generative_ai',
  'keeleoppematerjalid': 'query_text_data_used_study_or_supporting_materials_language_learning_materials',
  'automaatkontroll': 'query_text_data_used_study_or_supporting_materials_automated_correction',
  'tolkesonastik': 'query_text_data_used_study_or_supporting_materials_translation_dictionary_or_machine_translation',
  'ykskeelnesonastik': 'query_text_data_used_study_or_supporting_materials_monolingual_dictionary',
  'terminisonastik': 'query_text_data_used_study_or_supporting_materials_term_glossary_or_base',
  'kasiraamat': 'query_text_data_used_study_or_supporting_materials_professional_handbook',
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
  'mitteakadeemiline': 'publish_your_text_text_data_main_text_type_non_academic',
  'akadeemiline': 'publish_your_text_text_data_main_text_type_academic'
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

export const textPublishUsedMaterialsOptions = [
  { key: 'tehisintellekt', label: 'query_text_data_used_study_or_supporting_materials_generative_ai' },
  { key: 'keeleoppematerjalid', label: 'query_text_data_used_study_or_supporting_materials_language_learning_materials' },
  { key: 'automaatkontroll', label: 'query_text_data_used_study_or_supporting_materials_automated_correction' },
  { key: 'tolkesonastik', label: 'query_text_data_used_study_or_supporting_materials_translation_dictionary_or_machine_translation' },
  { key: 'ykskeelnesonastik', label: 'query_text_data_used_study_or_supporting_materials_monolingual_dictionary' },
  { key: 'terminisonastik', label: 'query_text_data_used_study_or_supporting_materials_term_glossary_or_base' },
  { key: 'kasiraamat', label: 'query_text_data_used_study_or_supporting_materials_professional_handbook' },
  { key: 'muu', label: 'common_other' }
];

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

export const textToSpeechVoices = {
  mari: 'Mari',
  albert: 'Albert',
  kalev: 'Kalev'
};

package ee.tlu.evkk.api.constant;

import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class TextPropertyConstants {

  // Property names
  public static final String PROP_TITLE = "title";
  public static final String PROP_DESCRIPTION = "kirjeldus";
  public static final String PROP_TYPE = "tekstityyp";
  public static final String PROP_CORPUS = "korpus";
  public static final String PROP_TEXT_LANGUAGE = "tekstikeel";
  public static final String PROP_USED_MATERIALS = "abivahendid";
  public static final String PROP_ACADEMIC_MATERIALS = "akad_oppematerjal";
  public static final String PROP_ACADEMIC_MATERIALS_OTHER = "akad_oppematerjal_muu";
  public static final String PROP_ACADEMIC_SUBTYPE = "akad_alamliik";
  public static final String PROP_NON_ACADEMIC_SUBTYPE = "mitteakad_alamliik";
  public static final String PROP_DOMAIN = "valdkond";
  public static final String PROP_ARTICLE_PUBLICATION = "artikkel_valjaanne";
  public static final String PROP_ARTICLE_YEAR = "artikkel_aasta";
  public static final String PROP_ARTICLE_NUMBER = "artikkel_number";
  public static final String PROP_ARTICLE_PAGES = "artikkel_lehekyljed";
  public static final String PROP_AGE_RAW = "vanus";
  public static final String PROP_AGE_RANGE = "vanusevahemik";
  public static final String PROP_YEAR = "aasta";
  public static final String PROP_YEAR_RANGE = "ajavahemik";
  public static final String PROP_GENDER = "sugu";
  public static final String PROP_EDUCATION = "haridus";
  public static final String PROP_STUDY_LEVEL = "oppeaste";
  public static final String PROP_DEGREE = "teaduskraad";
  public static final String PROP_NATIVE_LANGUAGE = "emakeel";
  public static final String PROP_OTHER_LANGUAGES = "muudkeeled";
  public static final String PROP_COUNTRY = "riik";

  // Main text type values
  public static final String TEXT_TYPE_ACADEMIC = "akadeemiline";

  // Subtype values requiring exact matching
  public static final String SUBTYPE_K2_PROFICIENCY_EXAM = "k2eesti_riiklik_eksamitoo";
  public static final String SUBTYPE_K2_OLYMPIADE = "k2eesti_ol_loovkirjutis";

  // Subtype prefix values
  public static final String SUBTYPE_PREFIX_K1_ESTONIAN = "k1eesti";
  public static final String SUBTYPE_PREFIX_K1_RUSSIAN = "k1vene";
  public static final String SUBTYPE_PREFIX_K2_ESTONIAN = "k2eesti";
  public static final String SUBTYPE_PREFIX_K3_RUSSIAN = "k3vene";

  // Corpus IDs
  public static final String CORPUS_ACADEMIC_ESTONIAN = "cwUSEqQLt";
  public static final String CORPUS_L1_ESTONIAN = "cYDRkpymb";
  public static final String CORPUS_L1_RUSSIAN = "cgSRJPKTr";
  public static final String CORPUS_L2_ESTONIAN = "cFOoRQekA";
  public static final String CORPUS_L2_OLYMPIADE = "cFqPphvYi";
  public static final String CORPUS_L2_PROFICIENCY_EXAMS = "clWmOIrLa";
  public static final String CORPUS_L3_RUSSIAN = "cZjHWUPtD";

  // Text language values
  public static final String LANGUAGE_ESTONIAN = "eesti";
  public static final String LANGUAGE_RUSSIAN = "vene";

  // Age range codes
  public static final String AGE_RANGE_UP_TO_18 = "kuni18";
  public static final String AGE_RANGE_19_TO_26 = "kuni26";
  public static final String AGE_RANGE_27_TO_40 = "kuni40";
  public static final String AGE_RANGE_41_PLUS = "41plus";

  // Year range codes
  public static final String YEAR_RANGE_2000_2005 = "2000-2005";
  public static final String YEAR_RANGE_2006_2010 = "2006-2010";
  public static final String YEAR_RANGE_2011_2015 = "2011-2015";
  public static final String YEAR_RANGE_2016_2020 = "2016-2020";
  public static final String YEAR_RANGE_2021_2025 = "2021-2025";
  public static final String YEAR_RANGE_2026_2030 = "2026-2030";
}

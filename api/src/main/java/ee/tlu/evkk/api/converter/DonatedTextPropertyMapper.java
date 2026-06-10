package ee.tlu.evkk.api.converter;

import ee.evkk.dto.TextMetadataDto;
import ee.tlu.evkk.dal.dto.TextMetadata;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static ee.tlu.evkk.api.constant.TextPropertyConstants.AGE_RANGE_19_TO_26;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.AGE_RANGE_27_TO_40;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.AGE_RANGE_41_PLUS;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.AGE_RANGE_UP_TO_18;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.CORPUS_ACADEMIC_ESTONIAN;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.CORPUS_L1_ESTONIAN;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.CORPUS_L1_RUSSIAN;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.CORPUS_L2_ESTONIAN;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.CORPUS_L2_OLYMPIADE;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.CORPUS_L2_PROFICIENCY_EXAMS;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.CORPUS_L3_RUSSIAN;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.LANGUAGE_ESTONIAN;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.LANGUAGE_RUSSIAN;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_ACADEMIC_MATERIALS;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_ACADEMIC_MATERIALS_OTHER;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_ACADEMIC_SUBTYPE;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_AGE_RANGE;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_AGE_RAW;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_ARTICLE_NUMBER;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_ARTICLE_PAGES;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_ARTICLE_PUBLICATION;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_ARTICLE_YEAR;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_CORPUS;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_COUNTRY;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_DEGREE;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_DESCRIPTION;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_DOMAIN;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_EDUCATION;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_GENDER;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_NATIVE_LANGUAGE;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_NON_ACADEMIC_SUBTYPE;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_OTHER_LANGUAGES;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_STUDY_LEVEL;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_TEXT_LANGUAGE;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_TITLE;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_TYPE;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_USED_MATERIALS;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.PROP_YEAR_RANGE;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.SUBTYPE_K2_OLYMPIADE;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.SUBTYPE_K2_PROFICIENCY_EXAM;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.SUBTYPE_PREFIX_K1_ESTONIAN;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.SUBTYPE_PREFIX_K1_RUSSIAN;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.SUBTYPE_PREFIX_K2_ESTONIAN;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.SUBTYPE_PREFIX_K3_RUSSIAN;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.TEXT_TYPE_ACADEMIC;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.YEAR_RANGE_2000_2005;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.YEAR_RANGE_2006_2010;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.YEAR_RANGE_2011_2015;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.YEAR_RANGE_2016_2020;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.YEAR_RANGE_2021_2025;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.YEAR_RANGE_2026_2030;
import static java.lang.Integer.parseInt;

@Component
public class DonatedTextPropertyMapper {

  private static final Set<String> PASS_THROUGH = Set.of(
    PROP_TITLE,
    PROP_DESCRIPTION,
    PROP_USED_MATERIALS,
    PROP_ACADEMIC_MATERIALS,
    PROP_ACADEMIC_MATERIALS_OTHER,
    PROP_DOMAIN,
    PROP_GENDER,
    PROP_EDUCATION,
    PROP_STUDY_LEVEL,
    PROP_DEGREE,
    PROP_NATIVE_LANGUAGE,
    PROP_OTHER_LANGUAGES,
    PROP_COUNTRY,
    PROP_ARTICLE_PUBLICATION,
    PROP_ARTICLE_NUMBER,
    PROP_ARTICLE_PAGES
  );

  public List<TextMetadataDto> map(List<TextMetadata> donatedProperties) {
    Map<String, List<String>> byName = groupByName(donatedProperties);
    List<TextMetadataDto> result = new ArrayList<>();

    for (String name : PASS_THROUGH) {
      byName.getOrDefault(name, List.of())
        .forEach(value -> result.add(property(name, value)));
    }

    String mainType = first(byName, PROP_TYPE);
    String subtype = TEXT_TYPE_ACADEMIC.equals(mainType)
      ? first(byName, PROP_ACADEMIC_SUBTYPE)
      : first(byName, PROP_NON_ACADEMIC_SUBTYPE);

    addIfNotBlank(result, PROP_TYPE, subtype);
    addIfNotBlank(result, PROP_CORPUS, inferCorpus(mainType, subtype));
    addIfNotBlank(result, PROP_TEXT_LANGUAGE, inferTextLanguage(mainType, subtype));

    addIfNotBlank(result, PROP_AGE_RANGE, mapAgeToRange(first(byName, PROP_AGE_RAW)));

    String articleYear = first(byName, PROP_ARTICLE_YEAR);
    addIfNotBlank(result, PROP_ARTICLE_YEAR, articleYear);
    addIfNotBlank(result, PROP_YEAR_RANGE, mapYearToRange(articleYear));

    return result;
  }

  private Map<String, List<String>> groupByName(List<TextMetadata> properties) {
    Map<String, List<String>> byName = new LinkedHashMap<>();
    for (TextMetadata metadata : properties) {
      byName.computeIfAbsent(metadata.getPropertyName(), k -> new ArrayList<>())
        .add(metadata.getPropertyValue());
    }
    return byName;
  }

  private TextMetadataDto property(String name, String value) {
    return TextMetadataDto.builder()
      .propertyName(name)
      .propertyValue(value)
      .build();
  }

  private String first(Map<String, List<String>> byName, String key) {
    List<String> values = byName.get(key);
    return (values != null && !values.isEmpty()) ? values.get(0) : null;
  }

  private void addIfNotBlank(List<TextMetadataDto> result, String name, String value) {
    if (value != null && !value.isBlank()) {
      result.add(property(name, value));
    }
  }

  private String inferCorpus(String mainType, String subtype) {
    if (TEXT_TYPE_ACADEMIC.equals(mainType)) {
      return CORPUS_ACADEMIC_ESTONIAN;
    }
    if (subtype == null) {
      return null;
    }
    if (subtype.startsWith(SUBTYPE_PREFIX_K1_ESTONIAN)) {
      return CORPUS_L1_ESTONIAN;
    }
    if (subtype.startsWith(SUBTYPE_PREFIX_K1_RUSSIAN)) {
      return CORPUS_L1_RUSSIAN;
    }
    if (SUBTYPE_K2_PROFICIENCY_EXAM.equals(subtype)) {
      return CORPUS_L2_PROFICIENCY_EXAMS;
    }
    if (SUBTYPE_K2_OLYMPIADE.equals(subtype)) {
      return CORPUS_L2_OLYMPIADE;
    }
    if (subtype.startsWith(SUBTYPE_PREFIX_K2_ESTONIAN)) {
      return CORPUS_L2_ESTONIAN;
    }
    if (subtype.startsWith(SUBTYPE_PREFIX_K3_RUSSIAN)) {
      return CORPUS_L3_RUSSIAN;
    }
    return null;
  }

  private String inferTextLanguage(String mainType, String subtype) {
    if (TEXT_TYPE_ACADEMIC.equals(mainType)) {
      return LANGUAGE_ESTONIAN;
    }
    if (subtype == null) {
      return null;
    }
    if (subtype.startsWith(SUBTYPE_PREFIX_K1_RUSSIAN) || subtype.startsWith(SUBTYPE_PREFIX_K3_RUSSIAN)) {
      return LANGUAGE_RUSSIAN;
    }
    return LANGUAGE_ESTONIAN;
  }

  private String mapAgeToRange(String rawAge) {
    if (rawAge == null) {
      return null;
    }
    try {
      int age = parseInt(rawAge.trim());
      if (age <= 18) {
        return AGE_RANGE_UP_TO_18;
      }
      if (age <= 26) {
        return AGE_RANGE_19_TO_26;
      }
      if (age <= 40) {
        return AGE_RANGE_27_TO_40;
      }
      return AGE_RANGE_41_PLUS;
    } catch (NumberFormatException e) {
      return null;
    }
  }

  private String mapYearToRange(String articleYear) {
    if (articleYear == null) {
      return null;
    }
    try {
      int year = parseInt(articleYear.trim());
      if (year >= 2000 && year <= 2005) {
        return YEAR_RANGE_2000_2005;
      }
      if (year >= 2006 && year <= 2010) {
        return YEAR_RANGE_2006_2010;
      }
      if (year >= 2011 && year <= 2015) {
        return YEAR_RANGE_2011_2015;
      }
      if (year >= 2016 && year <= 2020) {
        return YEAR_RANGE_2016_2020;
      }
      if (year >= 2021 && year <= 2025) {
        return YEAR_RANGE_2021_2025;
      }
      if (year >= 2026 && year <= 2030) {
        return YEAR_RANGE_2026_2030;
      }
      return null;
    } catch (NumberFormatException e) {
      return null;
    }
  }
}

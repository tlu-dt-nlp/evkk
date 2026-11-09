package ee.tlu.evkk.api.converter;

import ee.evkk.dto.TextMetadataDto;
import ee.tlu.evkk.dal.dto.TextMetadata;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Stream;

import static ee.tlu.evkk.api.util.DateUtils.PG_TIMESTAMP_FORMAT;
import static ee.tlu.evkk.api.util.StringUtils.isNullOrBlank;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.AGE_RANGE_19_TO_26;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.AGE_RANGE_27_TO_40;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.AGE_RANGE_41_PLUS;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.AGE_RANGE_UP_TO_18;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.CORPUS_ACADEMIC_ESTONIAN;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.CORPUS_L1_ESTONIAN;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.CORPUS_L1_RUSSIAN;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.CORPUS_L2_ESTONIAN;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.CORPUS_L2_OLYMPIADE;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.CORPUS_L2_PROFICIENCY_EXAMS;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.CORPUS_L3_RUSSIAN;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.LANGUAGE_ESTONIAN;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.LANGUAGE_RUSSIAN;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_ACADEMIC_SUBTYPE;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_AGE_RANGE;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_AGE_RAW;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_CORPUS;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_NON_ACADEMIC_SUBTYPE;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_OTHER_LANGUAGES;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_TEXT_LANGUAGE;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_TYPE;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_YEAR;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_YEAR_RANGE;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.SUBTYPE_K2_OLYMPIADE;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.SUBTYPE_K2_PROFICIENCY_EXAM;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.SUBTYPE_PREFIX_K1_ESTONIAN;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.SUBTYPE_PREFIX_K1_RUSSIAN;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.SUBTYPE_PREFIX_K2_ESTONIAN;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.SUBTYPE_PREFIX_K3_RUSSIAN;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.TEXT_TYPE_ACADEMIC;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.YEAR_RANGE_2000_2005;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.YEAR_RANGE_2006_2010;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.YEAR_RANGE_2011_2015;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.YEAR_RANGE_2016_2020;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.YEAR_RANGE_2021_2025;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.YEAR_RANGE_2026_2030;
import static java.lang.Integer.parseInt;
import static java.time.ZoneOffset.UTC;
import static java.time.format.DateTimeFormatter.ISO_OFFSET_DATE_TIME;
import static java.util.stream.Collectors.toList;
import static lombok.AccessLevel.PRIVATE;
import static org.apache.commons.collections4.CollectionUtils.isNotEmpty;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

@NoArgsConstructor(access = PRIVATE)
public class DonatedTextPropertyMapper {

  // properties that are transformed or derived, all others are published as-is
  // NB! keep in sync with DONATED_TEXT_KNOWN_PROPERTIES and DONATED_TEXT_DERIVED_PROPERTIES in
  // DonatedTextDetailsModal.jsx, so these can't be added as additional properties
  private static final Set<String> CONSUMED = Set.of(
    PROP_TYPE,
    PROP_ACADEMIC_SUBTYPE,
    PROP_NON_ACADEMIC_SUBTYPE,
    PROP_CORPUS,
    PROP_TEXT_LANGUAGE,
    PROP_AGE_RAW,
    PROP_AGE_RANGE,
    PROP_YEAR,
    PROP_YEAR_RANGE,
    PROP_OTHER_LANGUAGES
  );

  public static List<TextMetadataDto> map(List<TextMetadata> donatedProperties, String createdAt) {
    return map(groupByName(donatedProperties, TextMetadata::getPropertyName, TextMetadata::getPropertyValue), createdAt);
  }

  public static List<TextMetadataDto> mapDtos(List<TextMetadataDto> donatedProperties, String createdAt) {
    return map(groupByName(donatedProperties, TextMetadataDto::getPropertyName, TextMetadataDto::getPropertyValue), createdAt);
  }

  private static List<TextMetadataDto> map(Map<String, List<String>> byName, String createdAt) {
    List<TextMetadataDto> result = new ArrayList<>();

    byName.forEach((name, values) -> {
      if (!CONSUMED.contains(name)) {
        values.forEach(value -> result.add(property(name, value)));
      }
    });

    byName.getOrDefault(PROP_OTHER_LANGUAGES, List.of()).forEach(raw ->
      splitCommaSeparated(raw).forEach(lang -> result.add(property(PROP_OTHER_LANGUAGES, lang)))
    );

    String mainType = first(byName, PROP_TYPE);
    String subtype = first(byName, TEXT_TYPE_ACADEMIC.equals(mainType)
      ? PROP_ACADEMIC_SUBTYPE
      : PROP_NON_ACADEMIC_SUBTYPE);

    addIfNotBlank(result, PROP_TYPE, subtype);

    String corpus = first(byName, PROP_CORPUS);
    addIfNotBlank(result, PROP_CORPUS, corpus != null ? corpus : inferCorpus(mainType, subtype));

    String textLanguage = first(byName, PROP_TEXT_LANGUAGE);
    addIfNotBlank(result, PROP_TEXT_LANGUAGE, textLanguage != null ? textLanguage : inferTextLanguage(mainType, subtype));

    String age = first(byName, PROP_AGE_RAW);
    addIfNotBlank(result, PROP_AGE_RAW, age);
    addIfNotBlank(result, PROP_AGE_RANGE, mapAgeToRange(age));

    String submissionYear = extractYear(createdAt);
    addIfNotBlank(result, PROP_YEAR, submissionYear);
    addIfNotBlank(result, PROP_YEAR_RANGE, mapYearToRange(submissionYear));

    return result;
  }

  private static <T> Map<String, List<String>> groupByName(List<T> properties, Function<T, String> nameFn, Function<T, String> valueFn) {
    Map<String, List<String>> byName = new LinkedHashMap<>();
    for (T metadata : properties) {
      byName.computeIfAbsent(nameFn.apply(metadata), k -> new ArrayList<>())
        .add(valueFn.apply(metadata));
    }
    return byName;
  }

  private static TextMetadataDto property(String name, String value) {
    return TextMetadataDto.builder()
      .propertyName(name)
      .propertyValue(value)
      .build();
  }

  private static String first(Map<String, List<String>> byName, String key) {
    List<String> values = byName.get(key);
    return isNotEmpty(values) ? values.get(0) : null;
  }

  private static void addIfNotBlank(List<TextMetadataDto> result, String name, String value) {
    if (isNotBlank(value)) {
      result.add(property(name, value));
    }
  }

  private static String inferCorpus(String mainType, String subtype) {
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

  private static String inferTextLanguage(String mainType, String subtype) {
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

  private static String extractYear(String createdAt) {
    if (isNullOrBlank(createdAt)) {
      return null;
    }
    for (DateTimeFormatter fmt : List.of(ISO_OFFSET_DATE_TIME, PG_TIMESTAMP_FORMAT)) {
      try {
        return String.valueOf(OffsetDateTime.parse(createdAt, fmt).atZoneSameInstant(UTC).getYear());
      } catch (Exception ignored) {
        // try to parse with next formatter
      }
    }
    return null;
  }

  private static List<String> splitCommaSeparated(String value) {
    if (isNullOrBlank(value)) {
      return List.of();
    }

    return Stream.of(value.split(","))
      .map(String::trim)
      .filter(s -> !s.isEmpty())
      .collect(toList());
  }

  private static String mapAgeToRange(String rawAge) {
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

  private static String mapYearToRange(String articleYear) {
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

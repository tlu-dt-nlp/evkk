package ee.tlu.evkk.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import ee.evkk.dto.TextMetadataDto;
import ee.tlu.evkk.api.converter.DonatedTextPropertyMapper;
import ee.tlu.evkk.dal.dto.TextMetadata;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static ee.tlu.evkk.api.constant.TextPropertyConstants.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.params.provider.Arguments.arguments;

class DonatedTextPropertyMapperTest {

  private final ObjectMapper objectMapper = new ObjectMapper();

  private final DonatedTextPropertyMapper mapper = new DonatedTextPropertyMapper();

  @ParameterizedTest(name = "mainType={0}, subtype={1} -> corpus={2}, textLanguage={3}")
  @MethodSource("corpusAndTextLanguageCases")
  @DisplayName("map should derive correct corpus and text language from text type and subtype")
  void map_shouldDeriveCorpusAndTextLanguage(String mainType, String subtype, String expectedCorpus, String expectedTextLanguage) throws Exception {
    // Given
    List<TextMetadata> properties = buildTypeProperties(mainType, subtype);

    // When
    List<TextMetadataDto> result = mapper.map(properties);

    // Then
    assertThat(propertyValue(result, PROP_CORPUS)).isEqualTo(expectedCorpus);
    assertThat(propertyValue(result, PROP_TEXT_LANGUAGE)).isEqualTo(expectedTextLanguage);
  }

  static Stream<Arguments> corpusAndTextLanguageCases() {
    return Stream.of(
      arguments(TEXT_TYPE_ACADEMIC, "ak_eriala_essee", CORPUS_ACADEMIC_ESTONIAN, LANGUAGE_ESTONIAN),
      arguments("mitteakadeemiline", "k1eesti_arvamuslugu", CORPUS_L1_ESTONIAN, LANGUAGE_ESTONIAN),
      arguments("mitteakadeemiline", "k1vene_loovkirjutis", CORPUS_L1_RUSSIAN, LANGUAGE_RUSSIAN),
      arguments("mitteakadeemiline", "k2eesti_loovkirjutis", CORPUS_L2_ESTONIAN, LANGUAGE_ESTONIAN),
      arguments("mitteakadeemiline", SUBTYPE_K2_PROFICIENCY_EXAM, CORPUS_L2_PROFICIENCY_EXAMS, LANGUAGE_ESTONIAN),
      arguments("mitteakadeemiline", SUBTYPE_K2_OLYMPIADE, CORPUS_L2_OLYMPIADE, LANGUAGE_ESTONIAN),
      arguments("mitteakadeemiline", "k3vene_eksamitoo", CORPUS_L3_RUSSIAN, LANGUAGE_RUSSIAN)
    );
  }

  @ParameterizedTest(name = "rawAge={0} -> ageRange={1}")
  @MethodSource("ageCases")
  @DisplayName("map should convert raw age to age range")
  void map_shouldMapRawAgeToAgeRange(String rawAge, String expectedRange) throws Exception {
    // Given
    List<TextMetadata> properties = List.of(createTextMetadata(PROP_AGE_RAW, rawAge));

    // When
    List<TextMetadataDto> result = mapper.map(properties);

    // Then
    assertThat(propertyValue(result, PROP_AGE_RANGE)).isEqualTo(expectedRange);
  }

  static Stream<Arguments> ageCases() {
    return Stream.of(
      arguments("18", AGE_RANGE_UP_TO_18),
      arguments("19", AGE_RANGE_19_TO_26),
      arguments("26", AGE_RANGE_19_TO_26),
      arguments("27", AGE_RANGE_27_TO_40),
      arguments("40", AGE_RANGE_27_TO_40),
      arguments("41", AGE_RANGE_41_PLUS),
      arguments("abc", null)
    );
  }

  @ParameterizedTest(name = "articleYear={0} -> yearRange={1}")
  @MethodSource("yearCases")
  @DisplayName("map should convert article year to year range")
  void map_shouldMapArticleYearToYearRange(String articleYear, String expectedRange) throws Exception {
    // Given
    List<TextMetadata> properties = List.of(createTextMetadata(PROP_ARTICLE_YEAR, articleYear));

    // When
    List<TextMetadataDto> result = mapper.map(properties);

    // Then
    assertThat(propertyValue(result, PROP_YEAR_RANGE)).isEqualTo(expectedRange);
  }

  static Stream<Arguments> yearCases() {
    return Stream.of(
      arguments("2000", YEAR_RANGE_2000_2005),
      arguments("2005", YEAR_RANGE_2000_2005),
      arguments("2023", YEAR_RANGE_2021_2025),
      arguments("1999", null),
      arguments("2026", null),
      arguments("abc", null)
    );
  }

  @Test
  @DisplayName("map should not include kasAutor in published properties")
  void map_shouldNotIncludeKasAutor() throws Exception {
    // Given
    List<TextMetadata> properties = List.of(
      createTextMetadata("kasAutor", "John Doe"),
      createTextMetadata(PROP_TITLE, "My title")
    );

    // When
    List<TextMetadataDto> result = mapper.map(properties);

    // Then
    assertThat(propertyValue(result, "kasAutor")).isNull();
    assertThat(propertyValue(result, PROP_TITLE)).isEqualTo("My title");
  }

  @Test
  @DisplayName("map should not include raw main-type value of tekstityyp in published properties")
  void map_shouldNotIncludeRawMainTypeTekstityyp() throws Exception {
    // Given
    List<TextMetadata> properties = buildTypeProperties("mitteakadeemiline", "k1eesti_harjutus");

    // When
    List<TextMetadataDto> result = mapper.map(properties);

    // Then
    assertThat(propertyValues(result, PROP_TYPE)).containsExactly("k1eesti_harjutus");
  }

  @Test
  @DisplayName("map should preserve all values of multi-value akad_oppematerjal")
  void map_shouldPreserveMultiValueProperties() throws Exception {
    // Given
    List<TextMetadata> properties = List.of(
      createTextMetadata(PROP_ACADEMIC_MATERIALS, "kasiraamat"),
      createTextMetadata(PROP_ACADEMIC_MATERIALS, "ykskeelnesonastik")
    );

    // When
    List<TextMetadataDto> result = mapper.map(properties);

    // Then
    assertThat(propertyValues(result, PROP_ACADEMIC_MATERIALS))
      .containsExactlyInAnyOrder("kasiraamat", "ykskeelnesonastik");
  }

  @Test
  @DisplayName("map should pass through known properties unchanged")
  void map_shouldPassThroughKnownProperties() throws Exception {
    // Given
    List<TextMetadata> properties = List.of(
      createTextMetadata(PROP_GENDER, "naine"),
      createTextMetadata(PROP_NATIVE_LANGUAGE, "eesti"),
      createTextMetadata(PROP_COUNTRY, "Eesti"),
      createTextMetadata(PROP_STUDY_LEVEL, "magistriope"),
      createTextMetadata(PROP_DEGREE, "ma"),
      createTextMetadata(PROP_DOMAIN, "loodustehnika"),
      createTextMetadata(PROP_EDUCATION, "Kõrgharidus"),
      createTextMetadata(PROP_OTHER_LANGUAGES, "inglise")
    );

    // When
    List<TextMetadataDto> result = mapper.map(properties);

    // Then
    assertThat(propertyValue(result, PROP_GENDER)).isEqualTo("naine");
    assertThat(propertyValue(result, PROP_NATIVE_LANGUAGE)).isEqualTo("eesti");
    assertThat(propertyValue(result, PROP_COUNTRY)).isEqualTo("Eesti");
    assertThat(propertyValue(result, PROP_STUDY_LEVEL)).isEqualTo("magistriope");
    assertThat(propertyValue(result, PROP_DEGREE)).isEqualTo("ma");
    assertThat(propertyValue(result, PROP_DOMAIN)).isEqualTo("loodustehnika");
    assertThat(propertyValue(result, PROP_EDUCATION)).isEqualTo("Kõrgharidus");
    assertThat(propertyValue(result, PROP_OTHER_LANGUAGES)).isEqualTo("inglise");
  }

  @Test
  @DisplayName("map should keep raw article year alongside derived year range")
  void map_shouldKeepArticleYearAndDeriveRange() throws Exception {
    // Given
    List<TextMetadata> properties = List.of(createTextMetadata(PROP_ARTICLE_YEAR, "2023"));

    // When
    List<TextMetadataDto> result = mapper.map(properties);

    // Then
    assertThat(propertyValue(result, PROP_ARTICLE_YEAR)).isEqualTo("2023");
    assertThat(propertyValue(result, PROP_YEAR_RANGE)).isEqualTo(YEAR_RANGE_2021_2025);
  }

  private List<TextMetadata> buildTypeProperties(String mainType, String subtype) throws Exception {
    List<TextMetadata> props = new ArrayList<>();
    props.add(createTextMetadata(PROP_TYPE, mainType));
    if (TEXT_TYPE_ACADEMIC.equals(mainType)) {
      props.add(createTextMetadata(PROP_ACADEMIC_SUBTYPE, subtype));
    } else {
      props.add(createTextMetadata(PROP_NON_ACADEMIC_SUBTYPE, subtype));
    }
    return props;
  }

  private String propertyValue(List<TextMetadataDto> properties, String name) {
    return properties.stream()
      .filter(p -> name.equals(p.getPropertyName()))
      .map(TextMetadataDto::getPropertyValue)
      .findFirst()
      .orElse(null);
  }

  private List<String> propertyValues(List<TextMetadataDto> properties, String name) {
    return properties.stream()
      .filter(p -> name.equals(p.getPropertyName()))
      .map(TextMetadataDto::getPropertyValue)
      .collect(Collectors.toList());
  }

  private TextMetadata createTextMetadata(String name, String value) throws Exception {
    String json = String.format("{\"propertyName\":\"%s\", \"propertyValue\":\"%s\"}", name, value);
    return objectMapper.readValue(json, TextMetadata.class);
  }
}

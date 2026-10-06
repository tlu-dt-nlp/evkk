package ee.tlu.evkk.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import ee.evkk.dto.CorpusRequestDto;
import ee.evkk.dto.DonatedTextRequestDto;
import ee.evkk.dto.TextDetailsResponseDto;
import ee.evkk.dto.TextMetadataDto;
import ee.evkk.dto.TextUpdateRequestDto;
import ee.evkk.dto.TextsToReviewResponseDto;
import ee.tlu.evkk.api.controller.dto.NovelPropertyValueDto;
import ee.tlu.evkk.api.controller.dto.PropertyCheckConfigDto;
import ee.tlu.evkk.api.converter.DtoMapperImpl;
import ee.tlu.evkk.api.exception.EntityNotFoundException;
import ee.tlu.evkk.core.service.TextService;
import ee.tlu.evkk.dal.dao.TextAddedDao;
import ee.tlu.evkk.dal.dao.TextDao;
import ee.tlu.evkk.dal.dao.TextPropertyAddedDao;
import ee.tlu.evkk.dal.dao.TextPropertyCheckConfigDao;
import ee.tlu.evkk.dal.dao.TextPropertyDao;
import ee.tlu.evkk.dal.dto.TextAndMetadata;
import ee.tlu.evkk.dal.dto.TextMetadata;
import ee.tlu.evkk.dal.dto.TextProperty;
import ee.tlu.evkk.dal.dto.TextPropertyCheckConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.UUID;

import static ee.tlu.evkk.api.constant.TextPropertyConstants.CORPUS_L1_ESTONIAN;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.CORPUS_L2_ESTONIAN;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.LANGUAGE_ESTONIAN;
import static ee.tlu.evkk.api.constant.TextPropertyConstants.LANGUAGE_RUSSIAN;
import static java.util.UUID.randomUUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.argThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminTextServiceTest {

  private final ObjectMapper objectMapper = new ObjectMapper();

  @Spy
  @SuppressWarnings("unused")
  private final DtoMapperImpl dtoMapper = new DtoMapperImpl();

  @Mock
  private TextService textService;

  @Mock
  private TextAddedDao textAddedDao;

  @Mock
  private TextPropertyAddedDao textPropertyAddedDao;

  @Mock
  private TextDao textDao;

  @Mock
  private TextPropertyDao textPropertyDao;

  @Mock
  private TextPropertyCheckConfigDao textPropertyCheckConfigDao;

  @InjectMocks
  private AdminTextService adminTextService;

  @Test
  @DisplayName("Get texts to review returns count")
  void getTextsToReview_shouldReturnCount() {
    // Given
    Integer expectedCount = 10;
    when(textAddedDao.count()).thenReturn(expectedCount);

    // When
    TextsToReviewResponseDto response = adminTextService.getTextsToReview();

    // Then
    assertThat(response.getCount()).isEqualTo(expectedCount);
    verify(textAddedDao).count();
  }

  @Test
  @DisplayName("Get donated texts returns JSON from text service")
  void getDonatedTexts_shouldReturnJsonFromTextService() {
    // Given
    DonatedTextRequestDto request = new DonatedTextRequestDto();
    String expectedJson = "[]";
    when(textService.getDonatedTexts(request, true)).thenReturn(expectedJson);

    // When
    String response = adminTextService.getDonatedTexts(request);

    // Then
    assertThat(response).isEqualTo(expectedJson);
    verify(textService).getDonatedTexts(request, true);
  }

  @Test
  @DisplayName("Get donated text details returns text when donated text exists")
  void getDonatedTextDetails_whenTextExists_shouldReturnText() throws Exception {
    // Given
    UUID testId = randomUUID();
    TextAndMetadata textAndMetadata = createTextAndMetadata("Text", List.of());
    when(textAddedDao.findTextAndMetadataById(testId)).thenReturn(textAndMetadata);

    // When
    TextDetailsResponseDto response = adminTextService.getDonatedTextDetails(testId);

    // Then
    assertThat(response.getText()).isEqualTo("Text");
    assertThat(response.getProperties()).isEmpty();
    verify(textAddedDao).findTextAndMetadataById(testId);
  }

  @Test
  @DisplayName("Get donated text details includes inferred corpus and text language")
  void getDonatedTextDetails_shouldIncludeInferredCorpusAndTextLanguage() throws Exception {
    // Given
    UUID testId = randomUUID();
    TextAndMetadata textAndMetadata = createTextAndMetadata("Text", List.of(
      createTextMetadata("tekstityyp", "mitteakadeemiline"),
      createTextMetadata("mitteakad_alamliik", "k1eesti_arvamuslugu")
    ));
    when(textAddedDao.findTextAndMetadataById(testId)).thenReturn(textAndMetadata);

    // When
    TextDetailsResponseDto response = adminTextService.getDonatedTextDetails(testId);

    // Then
    assertThat(response.getText()).isEqualTo("Text");
    assertThat(getPropertyValue(response.getProperties(), "korpus")).isEqualTo(CORPUS_L1_ESTONIAN);
    assertThat(getPropertyValue(response.getProperties(), "tekstikeel")).isEqualTo(LANGUAGE_ESTONIAN);
  }

  @Test
  @DisplayName("Get donated text details does not override admin-set corpus and text language")
  void getDonatedTextDetails_whenCorpusAndTextLanguageAlreadySet_shouldNotOverride() throws Exception {
    // Given
    UUID testId = randomUUID();
    TextAndMetadata textAndMetadata = createTextAndMetadata("Text", List.of(
      createTextMetadata("tekstityyp", "mitteakadeemiline"),
      createTextMetadata("mitteakad_alamliik", "k1eesti_arvamuslugu"),
      createTextMetadata("korpus", CORPUS_L2_ESTONIAN),
      createTextMetadata("tekstikeel", LANGUAGE_RUSSIAN)
    ));
    when(textAddedDao.findTextAndMetadataById(testId)).thenReturn(textAndMetadata);

    // When
    TextDetailsResponseDto response = adminTextService.getDonatedTextDetails(testId);

    // Then
    assertThat(getPropertyValue(response.getProperties(), "korpus")).isEqualTo(CORPUS_L2_ESTONIAN);
    assertThat(getPropertyValue(response.getProperties(), "tekstikeel")).isEqualTo(LANGUAGE_RUSSIAN);
  }

  @Test
  @DisplayName("Get donated text details returns empty when donated text is not found")
  void getDonatedTextDetails_whenTextNotFound_shouldReturnEmpty() {
    // Given
    UUID testId = randomUUID();
    when(textAddedDao.findTextAndMetadataById(testId)).thenReturn(null);

    // When
    assertThrows(EntityNotFoundException.class, () -> adminTextService.getDonatedTextDetails(testId));

    // Then
    verify(textAddedDao).findTextAndMetadataById(testId);
  }

  @Test
  @DisplayName("Update donated text updates text and properties")
  void updateDonatedText_shouldUpdateTextAndProperties() throws Exception {
    // Given
    UUID testId = randomUUID();
    UUID titlePropertyId = randomUUID();
    UUID authorPropertyId = randomUUID();

    TextAndMetadata existing = createTextAndMetadata("Existing content", List.of(
      createTextMetadata("title", "Existing Title"),
      createTextMetadata("author", "Existing Author")
    ));

    List<TextProperty> existingProperties = List.of(
      createTextProperty(titlePropertyId, "title", "Existing Title"),
      createTextProperty(authorPropertyId, "author", "Existing Author")
    );

    TextMetadataDto updatedTitleProp = TextMetadataDto.builder()
      .propertyName("title")
      .propertyValue("Updated Title")
      .build();

    TextMetadataDto newTypeProp = TextMetadataDto.builder()
      .propertyName("type")
      .propertyValue("Article")
      .build();

    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("Updated content");
    request.setProperties(List.of(updatedTitleProp, newTypeProp));

    TextAndMetadata updated = createTextAndMetadata("Updated content", List.of(
      createTextMetadata("title", "Updated Title"),
      createTextMetadata("type", "Article")
    ));

    when(textAddedDao.findTextAndMetadataById(testId))
      .thenReturn(existing)
      .thenReturn(updated);
    when(textPropertyAddedDao.findByTextId(testId)).thenReturn(existingProperties);

    // When
    TextDetailsResponseDto response = adminTextService.updateDonatedText(testId, request);

    // Then
    assertThat(response.getText()).isEqualTo("Updated content");
    assertThat(response.getProperties()).hasSize(2);
    verify(textAddedDao).updateTextContent(testId, "Updated content");
    verify(textPropertyAddedDao).updateProperty(titlePropertyId, "Updated Title");
    verify(textPropertyAddedDao).insertProperty(testId, "type", "Article");
    verify(textPropertyAddedDao).deleteByIds(List.of(authorPropertyId));
  }

  @Test
  @DisplayName("Update donated text does not update properties when property value is unchanged")
  void updateDonatedText_whenPropertyValueUnchanged_shouldNotUpdate() throws Exception {
    // Given
    UUID testId = randomUUID();
    UUID titlePropertyId = randomUUID();

    TextAndMetadata existing = createTextAndMetadata("Content", List.of(
      createTextMetadata("title", "Same Title")
    ));

    List<TextProperty> existingProperties = List.of(
      createTextProperty(titlePropertyId, "title", "Same Title")
    );

    TextMetadataDto sameTitleProp = TextMetadataDto.builder()
      .propertyName("title")
      .propertyValue("Same Title")
      .build();

    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("Content");
    request.setProperties(List.of(sameTitleProp));

    TextAndMetadata updated = createTextAndMetadata("Content", List.of(
      createTextMetadata("title", "Same Title")
    ));

    when(textAddedDao.findTextAndMetadataById(testId))
      .thenReturn(existing)
      .thenReturn(updated);
    when(textPropertyAddedDao.findByTextId(testId)).thenReturn(existingProperties);

    // When
    adminTextService.updateDonatedText(testId, request);

    // Then
    verify(textPropertyAddedDao, never()).updateProperty(any(), any());
    verify(textPropertyAddedDao, never()).insertProperty(any(), any(), any());
    verify(textPropertyAddedDao, never()).deleteByIds(any());
  }

  @Test
  @DisplayName("Update donated text handles multi-value properties correctly")
  void updateDonatedText_withMultiValueProperties_shouldHandleCorrectly() throws Exception {
    // Given
    UUID testId = randomUUID();
    UUID enId = randomUUID();
    UUID esId = randomUUID();
    UUID deId = randomUUID();

    TextAndMetadata existing = createTextAndMetadata("Content", List.of(
      createTextMetadata("muudkeeled", "en"),
      createTextMetadata("muudkeeled", "es"),
      createTextMetadata("muudkeeled", "de")
    ));

    List<TextProperty> existingProperties = List.of(
      createTextProperty(enId, "muudkeeled", "en"),
      createTextProperty(esId, "muudkeeled", "es"),
      createTextProperty(deId, "muudkeeled", "de")
    );

    List<TextMetadataDto> newProperties = List.of(
      TextMetadataDto.builder()
        .propertyName("muudkeeled")
        .propertyValue("en")
        .build(),
      TextMetadataDto.builder()
        .propertyName("muudkeeled")
        .propertyValue("de")
        .build(),
      TextMetadataDto.builder()
        .propertyName("muudkeeled")
        .propertyValue("ru")
        .build()
    );

    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("Content");
    request.setProperties(newProperties);

    TextAndMetadata updated = createTextAndMetadata("Content", List.of(
      createTextMetadata("muudkeeled", "en"),
      createTextMetadata("muudkeeled", "de"),
      createTextMetadata("muudkeeled", "ru")
    ));

    when(textAddedDao.findTextAndMetadataById(testId))
      .thenReturn(existing)
      .thenReturn(updated);
    when(textPropertyAddedDao.findByTextId(testId)).thenReturn(existingProperties);

    // When
    adminTextService.updateDonatedText(testId, request);

    // Then
    verify(textPropertyAddedDao, never()).updateProperty(eq(enId), any());
    verify(textPropertyAddedDao).updateProperty(esId, "ru");
    verify(textPropertyAddedDao, never()).updateProperty(eq(deId), any());
    verify(textPropertyAddedDao, never()).insertProperty(any(), any(), any());
    verify(textPropertyAddedDao, never()).deleteByIds(any());
  }

  @Test
  @DisplayName("Update donated text handles mixed single-value and multi-value properties correctly")
  void updateDonatedText_withMixedSingleAndMultiValueProperties_shouldHandleCorrectly() throws Exception {
    // Given
    UUID testId = randomUUID();
    UUID titleId = randomUUID();
    UUID enId = randomUUID();
    UUID esId = randomUUID();

    TextAndMetadata existing = createTextAndMetadata("Content", List.of(
      createTextMetadata("title", "Existing Title"),
      createTextMetadata("muudkeeled", "en"),
      createTextMetadata("muudkeeled", "es")
    ));

    List<TextProperty> existingProperties = List.of(
      createTextProperty(titleId, "title", "Existing Title"),
      createTextProperty(enId, "muudkeeled", "en"),
      createTextProperty(esId, "muudkeeled", "es")
    );

    List<TextMetadataDto> newProperties = List.of(
      TextMetadataDto.builder()
        .propertyName("title")
        .propertyValue("Updated Title")
        .build(),
      TextMetadataDto.builder()
        .propertyName("muudkeeled")
        .propertyValue("en")
        .build(),
      TextMetadataDto.builder()
        .propertyName("muudkeeled")
        .propertyValue("ru")
        .build()
    );

    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("Content");
    request.setProperties(newProperties);

    TextAndMetadata updated = createTextAndMetadata("Content", List.of(
      createTextMetadata("title", "Updated Title"),
      createTextMetadata("muudkeeled", "en"),
      createTextMetadata("muudkeeled", "ru")
    ));

    when(textAddedDao.findTextAndMetadataById(testId))
      .thenReturn(existing)
      .thenReturn(updated);
    when(textPropertyAddedDao.findByTextId(testId)).thenReturn(existingProperties);

    // When
    adminTextService.updateDonatedText(testId, request);

    // Then
    verify(textPropertyAddedDao).updateProperty(titleId, "Updated Title");
    verify(textPropertyAddedDao, never()).updateProperty(eq(enId), any());
    verify(textPropertyAddedDao).updateProperty(esId, "ru");
    verify(textPropertyAddedDao, never()).insertProperty(any(), any(), any());
    verify(textPropertyAddedDao, never()).deleteByIds(any());
  }

  @Test
  @DisplayName("Update donated text deletes removed properties")
  void updateDonatedText_whenPropertyRemoved_shouldDelete() throws Exception {
    // Given
    UUID testId = randomUUID();
    UUID titleId = randomUUID();
    UUID authorId = randomUUID();
    UUID typeId = randomUUID();

    TextAndMetadata existing = createTextAndMetadata("Content", List.of(
      createTextMetadata("title", "Title"),
      createTextMetadata("author", "Author"),
      createTextMetadata("type", "Article")
    ));

    List<TextProperty> existingProperties = List.of(
      createTextProperty(titleId, "title", "Title"),
      createTextProperty(authorId, "author", "Author"),
      createTextProperty(typeId, "type", "Article")
    );

    List<TextMetadataDto> newProperties = List.of(
      TextMetadataDto.builder()
        .propertyName("title")
        .propertyValue("Title")
        .build(),
      TextMetadataDto.builder()
        .propertyName("type")
        .propertyValue("Article")
        .build()
    );

    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("Content");
    request.setProperties(newProperties);

    TextAndMetadata updated = createTextAndMetadata("Content", List.of(
      createTextMetadata("title", "Title"),
      createTextMetadata("type", "Article")
    ));

    when(textAddedDao.findTextAndMetadataById(testId))
      .thenReturn(existing)
      .thenReturn(updated);
    when(textPropertyAddedDao.findByTextId(testId)).thenReturn(existingProperties);

    // When
    adminTextService.updateDonatedText(testId, request);

    // Then
    verify(textPropertyAddedDao, never()).updateProperty(any(), any());
    verify(textPropertyAddedDao, never()).insertProperty(any(), any(), any());
    verify(textPropertyAddedDao).deleteByIds(List.of(authorId));
  }

  @Test
  @DisplayName("Update donated text deletes all properties when all properties are removed")
  void updateDonatedText_whenAllPropertiesRemoved_shouldDeleteAll() throws Exception {
    // Given
    UUID testId = randomUUID();
    UUID titleId = randomUUID();
    UUID authorId = randomUUID();

    TextAndMetadata existing = createTextAndMetadata("Content", List.of(
      createTextMetadata("title", "Title"),
      createTextMetadata("author", "Author")
    ));

    List<TextProperty> existingProperties = List.of(
      createTextProperty(titleId, "title", "Title"),
      createTextProperty(authorId, "author", "Author")
    );

    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("Content");
    request.setProperties(List.of());

    TextAndMetadata updated = createTextAndMetadata("Content", List.of());

    when(textAddedDao.findTextAndMetadataById(testId))
      .thenReturn(existing)
      .thenReturn(updated);
    when(textPropertyAddedDao.findByTextId(testId)).thenReturn(existingProperties);

    // When
    adminTextService.updateDonatedText(testId, request);

    // Then
    verify(textPropertyAddedDao, never()).updateProperty(any(), any());
    verify(textPropertyAddedDao, never()).insertProperty(any(), any(), any());
    verify(textPropertyAddedDao).deleteByIds(argThat(ids ->
      ids.size() == 2 && ids.contains(titleId) && ids.contains(authorId)
    ));
  }

  @Test
  @DisplayName("Update donated text does not update content when text is unchanged")
  void updateDonatedText_whenTextUnchanged_shouldNotUpdateContent() throws Exception {
    // Given
    UUID testId = randomUUID();
    TextAndMetadata existing = createTextAndMetadata("Content", List.of());

    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("Content");
    request.setProperties(List.of());

    TextAndMetadata updated = createTextAndMetadata("Content", List.of());

    when(textAddedDao.findTextAndMetadataById(testId))
      .thenReturn(existing)
      .thenReturn(updated);
    when(textPropertyAddedDao.findByTextId(testId)).thenReturn(List.of());

    // When
    adminTextService.updateDonatedText(testId, request);

    // Then
    verify(textAddedDao, never()).updateTextContent(any(), any());
  }

  @Test
  @DisplayName("Update donated text throws exception when donated text is not found")
  void updateDonatedText_whenTextNotFound_shouldThrowException() {
    // Given
    UUID testId = randomUUID();

    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("Updated content");
    request.setProperties(List.of());

    when(textAddedDao.findTextAndMetadataById(testId)).thenReturn(null);

    // When & Then
    assertThatThrownBy(() -> adminTextService.updateDonatedText(testId, request))
      .isInstanceOf(EntityNotFoundException.class);
    verify(textPropertyAddedDao, never()).findByTextId(any());
  }

  @Test
  @DisplayName("Delete donated text deletes properties and text")
  void deleteDonatedText_shouldDeletePropertiesAndText() throws Exception {
    // Given
    UUID testId = randomUUID();
    TextAndMetadata existing = createTextAndMetadata("Text", List.of(
      createTextMetadata("title", "Title")
    ));
    when(textAddedDao.findTextAndMetadataById(testId)).thenReturn(existing);

    // When
    adminTextService.deleteDonatedText(testId);

    // Then
    verify(textPropertyAddedDao).deleteByTextId(testId);
    verify(textAddedDao).deleteById(testId);
  }

  @Test
  @DisplayName("Delete donated text throws exception when donated text is not found")
  void deleteDonatedText_whenNotFound_shouldThrowException() {
    // Given
    UUID testId = randomUUID();
    when(textAddedDao.findTextAndMetadataById(testId)).thenReturn(null);

    // When & Then
    assertThatThrownBy(() -> adminTextService.deleteDonatedText(testId))
      .isInstanceOf(EntityNotFoundException.class);
    verify(textPropertyAddedDao, never()).deleteByTextId(any());
    verify(textAddedDao, never()).deleteById(any());
  }

  @Test
  @DisplayName("Publish donated text moves text and properties to published tables")
  void publishDonatedText_shouldMoveTextAndPropertiesToPublishedTables() throws Exception {
    // Given
    UUID testId = randomUUID();
    UUID publishedId = randomUUID();

    TextAndMetadata existing = createTextAndMetadata("Donated content", List.of(
      createTextMetadata("title", "Title")
    ));

    TextAndMetadata published = createTextAndMetadata("Donated content", List.of(
      createTextMetadata("title", "Title")
    ));

    when(textAddedDao.findTextAndMetadataById(testId)).thenReturn(existing);
    when(textAddedDao.findCreatedAtById(testId)).thenReturn(null);
    when(textDao.insertDonatedText("Donated content")).thenReturn(publishedId);
    when(textDao.findTextAndMetadataById(publishedId)).thenReturn(published);

    // When
    TextDetailsResponseDto response = adminTextService.publishDonatedText(testId, null);

    // Then
    assertThat(response.getText()).isEqualTo("Donated content");
    assertThat(response.getProperties()).hasSize(1);
    verify(textAddedDao, never()).updateTextContent(any(), any());
    verify(textPropertyAddedDao, never()).updateProperty(any(), any());
    verify(textDao).insertDonatedText("Donated content");
    verify(textPropertyDao).insertProperty(publishedId, "title", "Title");
    verify(textPropertyAddedDao).deleteByTextId(testId);
    verify(textAddedDao).deleteById(testId);
  }

  @Test
  @DisplayName("Publish donated text updates donated text before publishing when request is provided")
  void publishDonatedText_withRequest_shouldUpdateDonatedTextBeforePublish() throws Exception {
    // Given
    UUID testId = randomUUID();
    UUID publishedId = randomUUID();
    UUID titlePropertyId = randomUUID();
    UUID descriptionPropertyId = randomUUID();

    TextAndMetadata existing = createTextAndMetadata("Existing content", List.of(
      createTextMetadata("title", "Existing Title"),
      createTextMetadata("kirjeldus", "Old Description")
    ));

    List<TextProperty> existingProperties = List.of(
      createTextProperty(titlePropertyId, "title", "Existing Title"),
      createTextProperty(descriptionPropertyId, "kirjeldus", "Old Description")
    );

    List<TextMetadataDto> newProperties = List.of(
      TextMetadataDto.builder()
        .propertyName("title")
        .propertyValue("Updated Title")
        .build(),
      TextMetadataDto.builder()
        .propertyName("kirjeldus")
        .propertyValue("New Description")
        .build()
    );

    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("Updated content");
    request.setProperties(newProperties);

    TextAndMetadata updatedDonated = createTextAndMetadata("Updated content", List.of(
      createTextMetadata("title", "Updated Title"),
      createTextMetadata("kirjeldus", "New Description")
    ));

    TextAndMetadata published = createTextAndMetadata("Updated content", List.of(
      createTextMetadata("title", "Updated Title"),
      createTextMetadata("kirjeldus", "New Description")
    ));

    when(textAddedDao.findTextAndMetadataById(testId))
      .thenReturn(existing)
      .thenReturn(updatedDonated);
    when(textPropertyAddedDao.findByTextId(testId)).thenReturn(existingProperties);
    when(textDao.insertDonatedText("Updated content")).thenReturn(publishedId);
    when(textAddedDao.findCreatedAtById(testId)).thenReturn(null);
    when(textDao.findTextAndMetadataById(publishedId)).thenReturn(published);

    // When
    TextDetailsResponseDto response = adminTextService.publishDonatedText(testId, request);

    // Then
    assertThat(response.getText()).isEqualTo("Updated content");
    verify(textAddedDao).updateTextContent(testId, "Updated content");
    verify(textPropertyAddedDao).updateProperty(titlePropertyId, "Updated Title");
    verify(textPropertyAddedDao).updateProperty(descriptionPropertyId, "New Description");
    verify(textDao).insertDonatedText("Updated content");
    verify(textPropertyDao).insertProperty(publishedId, "title", "Updated Title");
    verify(textPropertyDao).insertProperty(publishedId, "kirjeldus", "New Description");
    verify(textPropertyAddedDao).deleteByTextId(testId);
    verify(textAddedDao).deleteById(testId);
  }

  @Test
  @DisplayName("Publish donated text uses admin-set korpus and tekstikeel instead of re-inferring")
  void publishDonatedText_shouldUseAdminSetCorpusAndTextLanguage() throws Exception {
    // Given
    UUID testId = randomUUID();
    UUID publishedId = randomUUID();

    TextAndMetadata existing = createTextAndMetadata("Content", List.of(
      createTextMetadata("tekstityyp", "mitteakadeemiline"),
      createTextMetadata("mitteakad_alamliik", "k1eesti_arvamuslugu"),
      createTextMetadata("korpus", CORPUS_L2_ESTONIAN),
      createTextMetadata("tekstikeel", LANGUAGE_RUSSIAN)
    ));

    TextAndMetadata published = createTextAndMetadata("Content", List.of());

    when(textAddedDao.findTextAndMetadataById(testId)).thenReturn(existing);
    when(textAddedDao.findCreatedAtById(testId)).thenReturn(null);
    when(textDao.insertDonatedText("Content")).thenReturn(publishedId);
    when(textDao.findTextAndMetadataById(publishedId)).thenReturn(published);

    // When
    adminTextService.publishDonatedText(testId, null);

    // Then: admin-overridden values should be published, not the inferred L1 Estonian ones
    verify(textPropertyDao).insertProperty(publishedId, "korpus", CORPUS_L2_ESTONIAN);
    verify(textPropertyDao).insertProperty(publishedId, "tekstikeel", LANGUAGE_RUSSIAN);
  }

  @Test
  @DisplayName("Publish donated text throws exception when donated text is not found")
  void publishDonatedText_whenNotFound_shouldThrowException() {
    // Given
    UUID testId = randomUUID();
    when(textAddedDao.findTextAndMetadataById(testId)).thenReturn(null);

    // When & Then
    assertThatThrownBy(() -> adminTextService.publishDonatedText(testId, null))
      .isInstanceOf(EntityNotFoundException.class);
    verify(textDao, never()).insertDonatedText(any());
    verify(textPropertyDao, never()).insertProperty(any(), any(), any());
    verify(textPropertyAddedDao, never()).deleteByTextId(any());
    verify(textAddedDao, never()).deleteById(any());
  }

  @Test
  @DisplayName("Get published texts returns JSON from text service")
  void getPublishedTexts_shouldReturnJsonFromTextService() {
    // Given
    CorpusRequestDto request = new CorpusRequestDto();
    String expectedJson = "[]";
    when(textService.detailneparing(request, true)).thenReturn(expectedJson);

    // When
    String response = adminTextService.getPublishedTexts(request);

    // Then
    assertThat(response).isEqualTo(expectedJson);
    verify(textService).detailneparing(request, true);
  }

  @Test
  @DisplayName("Get published text details returns text when published text exists")
  void getPublishedTextDetails_whenTextExists_shouldReturnText() throws Exception {
    // Given
    UUID testId = randomUUID();
    TextAndMetadata textAndMetadata = createTextAndMetadata("Text", List.of());
    when(textDao.findTextAndMetadataById(testId)).thenReturn(textAndMetadata);

    // When
    TextDetailsResponseDto response = adminTextService.getPublishedTextDetails(testId);

    // Then
    assertThat(response.getText()).isEqualTo("Text");
    assertThat(response.getProperties()).isEmpty();
    verify(textDao).findTextAndMetadataById(testId);
  }

  @Test
  @DisplayName("Get published text details returns empty when published text is not found")
  void getPublishedTextDetails_whenTextNotFound_shouldReturnEmpty() {
    // Given
    UUID testId = randomUUID();
    when(textDao.findTextAndMetadataById(testId)).thenReturn(null);

    // When
    assertThrows(EntityNotFoundException.class, () -> adminTextService.getPublishedTextDetails(testId));

    // Then
    verify(textDao).findTextAndMetadataById(testId);
  }

  @Test
  @DisplayName("Update published text updates text and properties")
  void updatePublishedText_shouldUpdateTextAndProperties() throws Exception {
    // Given
    UUID testId = randomUUID();
    UUID titlePropertyId = randomUUID();
    UUID authorPropertyId = randomUUID();

    TextAndMetadata existing = createTextAndMetadata("Existing content", List.of(
      createTextMetadata("title", "Existing Title"),
      createTextMetadata("author", "Existing Author")
    ));

    List<TextProperty> existingProperties = List.of(
      createTextProperty(titlePropertyId, "title", "Existing Title"),
      createTextProperty(authorPropertyId, "author", "Existing Author")
    );

    TextMetadataDto updatedTitleProp = TextMetadataDto.builder()
      .propertyName("title")
      .propertyValue("Updated Title")
      .build();

    TextMetadataDto newTypeProp = TextMetadataDto.builder()
      .propertyName("type")
      .propertyValue("Article")
      .build();

    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("Updated content");
    request.setProperties(List.of(updatedTitleProp, newTypeProp));

    TextAndMetadata updated = createTextAndMetadata("Updated content", List.of(
      createTextMetadata("title", "Updated Title"),
      createTextMetadata("type", "Article")
    ));

    when(textDao.findTextAndMetadataById(testId))
      .thenReturn(existing)
      .thenReturn(updated);
    when(textPropertyDao.findByTextId(testId)).thenReturn(existingProperties);

    // When
    TextDetailsResponseDto response = adminTextService.updatePublishedText(testId, request);

    // Then
    assertThat(response.getText()).isEqualTo("Updated content");
    assertThat(response.getProperties()).hasSize(2);
    verify(textDao).updateTextContent(testId, "Updated content");
    verify(textPropertyDao).updateProperty(titlePropertyId, "Updated Title");
    verify(textPropertyDao).insertProperty(testId, "type", "Article");
    verify(textPropertyDao).deleteByIds(List.of(authorPropertyId));
  }

  @Test
  @DisplayName("Update published text does not update content when text is unchanged")
  void updatePublishedText_whenTextUnchanged_shouldNotUpdateContent() throws Exception {
    // Given
    UUID testId = randomUUID();
    TextAndMetadata existing = createTextAndMetadata("Content", List.of());

    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("Content");
    request.setProperties(List.of());

    TextAndMetadata updated = createTextAndMetadata("Content", List.of());

    when(textDao.findTextAndMetadataById(testId))
      .thenReturn(existing)
      .thenReturn(updated);
    when(textPropertyDao.findByTextId(testId)).thenReturn(List.of());

    // When
    adminTextService.updatePublishedText(testId, request);

    // Then
    verify(textDao, never()).updateTextContent(any(), any());
  }

  @Test
  @DisplayName("Update published text throws exception when published text is not found")
  void updatePublishedText_whenTextNotFound_shouldThrowException() {
    // Given
    UUID testId = randomUUID();

    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("Updated content");
    request.setProperties(List.of());

    when(textDao.findTextAndMetadataById(testId)).thenReturn(null);

    // When & Then
    assertThatThrownBy(() -> adminTextService.updatePublishedText(testId, request))
      .isInstanceOf(EntityNotFoundException.class);
    verify(textPropertyDao, never()).findByTextId(any());
  }

  @Test
  @DisplayName("Delete published text deletes properties and text")
  void deletePublishedText_shouldDeletePropertiesAndText() throws Exception {
    // Given
    UUID testId = randomUUID();
    TextAndMetadata existing = createTextAndMetadata("Text", List.of(
      createTextMetadata("title", "Title")
    ));
    when(textDao.findTextAndMetadataById(testId)).thenReturn(existing);

    // When
    adminTextService.deletePublishedText(testId);

    // Then
    verify(textPropertyDao).deleteByTextId(testId);
    verify(textDao).deleteById(testId);
  }

  @Test
  @DisplayName("Delete published text throws exception when published text is not found")
  void deletePublishedText_whenNotFound_shouldThrowException() {
    // Given
    UUID testId = randomUUID();
    when(textDao.findTextAndMetadataById(testId)).thenReturn(null);

    // When & Then
    assertThatThrownBy(() -> adminTextService.deletePublishedText(testId))
      .isInstanceOf(EntityNotFoundException.class);
    verify(textPropertyDao, never()).deleteByTextId(any());
    verify(textDao, never()).deleteById(any());
  }

  private TextAndMetadata createTextAndMetadata(String text, List<TextMetadata> properties) throws Exception {
    String json = objectMapper.writeValueAsString(properties);
    return new TextAndMetadata(json, text);
  }

  private TextMetadata createTextMetadata(String name, String value) throws Exception {
    String json = String.format("{\"propertyName\":\"%s\", \"propertyValue\":\"%s\"}", name, value);
    return objectMapper.readValue(json, TextMetadata.class);
  }

  private TextProperty createTextProperty(UUID id, String name, String value) {
    TextProperty property = new TextProperty();
    property.setId(id);
    property.setPropertyName(name);
    property.setPropertyValue(value);
    return property;
  }

  private static String getPropertyValue(List<TextMetadataDto> properties, String name) {
    return properties.stream()
      .filter(p -> name.equals(p.getPropertyName()))
      .map(TextMetadataDto::getPropertyValue)
      .findFirst()
      .orElse(null);
  }


  @Test
  @DisplayName("Get property names returns distinct names from DAO")
  void getPropertyNames_shouldReturnDistinctNamesFromDao() {
    // Given
    List<String> expected = List.of("emakeel", "korpus", "sugu");
    when(textPropertyDao.findDistinctPropertyNames()).thenReturn(expected);

    // When
    List<String> result = adminTextService.getPropertyNames();

    // Then
    assertThat(result).containsExactlyElementsOf(expected);
    verify(textPropertyDao).findDistinctPropertyNames();
  }


  @Test
  @DisplayName("Get property values returns distinct values for given property name")
  void getPropertyValues_shouldReturnDistinctValuesForPropertyName() {
    // Given
    String propertyName = "sugu";
    List<String> expected = List.of("M", "N");
    when(textPropertyDao.findDistinctValuesByName(propertyName)).thenReturn(expected);

    // When
    List<String> result = adminTextService.getPropertyValues(propertyName);

    // Then
    assertThat(result).containsExactlyElementsOf(expected);
    verify(textPropertyDao).findDistinctValuesByName(propertyName);
  }


  @Test
  @DisplayName("Check novel values returns empty list when no properties provided")
  void checkNovelValues_whenNoProperties_shouldReturnEmpty() {
    // Given
    when(textPropertyCheckConfigDao.findAll()).thenReturn(List.of());
    when(textPropertyDao.findDistinctPropertyNames()).thenReturn(List.of());

    // When
    List<NovelPropertyValueDto> result = adminTextService.checkNovelValues(List.of());

    // Then
    assertThat(result).isEmpty();
  }

  @Test
  @DisplayName("Check novel values flags entry when property name is completely new")
  void checkNovelValues_whenPropertyNameIsNew_shouldFlagAsNovelName() {
    // Given
    when(textPropertyCheckConfigDao.findAll()).thenReturn(List.of());
    when(textPropertyDao.findDistinctPropertyNames()).thenReturn(List.of("emakeel"));

    List<TextMetadataDto> input = List.of(
      TextMetadataDto.builder().propertyName("brandNew").propertyValue("someValue").build()
    );

    // When
    List<NovelPropertyValueDto> result = adminTextService.checkNovelValues(input);

    // Then
    assertThat(result).hasSize(1);
    assertThat(result.get(0).getPropertyName()).isEqualTo("brandNew");
    assertThat(result.get(0).getPropertyValue()).isEqualTo("someValue");
    assertThat(result.get(0).isNovelName()).isTrue();
  }

  @Test
  @DisplayName("Check novel values does not flag same novel name twice")
  void checkNovelValues_whenPropertyNameIsNewAndRepeated_shouldFlagOnlyOnce() {
    // Given
    when(textPropertyCheckConfigDao.findAll()).thenReturn(List.of());
    when(textPropertyDao.findDistinctPropertyNames()).thenReturn(List.of());

    List<TextMetadataDto> input = List.of(
      TextMetadataDto.builder().propertyName("brandNew").propertyValue("value1").build(),
      TextMetadataDto.builder().propertyName("brandNew").propertyValue("value2").build()
    );

    // When
    List<NovelPropertyValueDto> result = adminTextService.checkNovelValues(input);

    // Then
    assertThat(result).hasSize(1);
    assertThat(result.get(0).isNovelName()).isTrue();
  }

  @Test
  @DisplayName("Check novel values flags entry when value is new for a known active property name")
  void checkNovelValues_whenValueIsNewForActivePropertyName_shouldFlagAsNovelValue() {
    // Given
    TextPropertyCheckConfig activeConfig = TextPropertyCheckConfig.builder()
      .propertyName("sugu")
      .isActive(true)
      .build();

    when(textPropertyCheckConfigDao.findAll()).thenReturn(List.of(activeConfig));
    when(textPropertyDao.findDistinctPropertyNames()).thenReturn(List.of("sugu"));
    when(textPropertyDao.findExistingValues(any())).thenReturn(List.of());

    List<TextMetadataDto> input = List.of(
      TextMetadataDto.builder().propertyName("sugu").propertyValue("X").build()
    );

    // When
    List<NovelPropertyValueDto> result = adminTextService.checkNovelValues(input);

    // Then
    assertThat(result).hasSize(1);
    assertThat(result.get(0).getPropertyName()).isEqualTo("sugu");
    assertThat(result.get(0).getPropertyValue()).isEqualTo("X");
    assertThat(result.get(0).isNovelName()).isFalse();
  }

  @Test
  @DisplayName("Check novel values does not flag entry when value already exists")
  void checkNovelValues_whenValueAlreadyExists_shouldNotFlag() {
    // Given
    TextPropertyCheckConfig activeConfig = TextPropertyCheckConfig.builder()
      .propertyName("sugu")
      .isActive(true)
      .build();

    TextProperty existing = TextProperty.builder()
      .propertyName("sugu")
      .propertyValue("M")
      .build();

    when(textPropertyCheckConfigDao.findAll()).thenReturn(List.of(activeConfig));
    when(textPropertyDao.findDistinctPropertyNames()).thenReturn(List.of("sugu"));
    when(textPropertyDao.findExistingValues(any())).thenReturn(List.of(existing));

    List<TextMetadataDto> input = List.of(
      TextMetadataDto.builder().propertyName("sugu").propertyValue("M").build()
    );

    // When
    List<NovelPropertyValueDto> result = adminTextService.checkNovelValues(input);

    // Then
    assertThat(result).isEmpty();
  }

  @Test
  @DisplayName("Check novel values does not flag entry when property name is known but inactive in config")
  void checkNovelValues_whenPropertyNameIsInactive_shouldNotFlagValue() {
    // Given
    TextPropertyCheckConfig inactiveConfig = TextPropertyCheckConfig.builder()
      .propertyName("kirjeldus")
      .isActive(false)
      .build();

    when(textPropertyCheckConfigDao.findAll()).thenReturn(List.of(inactiveConfig));
    when(textPropertyDao.findDistinctPropertyNames()).thenReturn(List.of("kirjeldus"));

    List<TextMetadataDto> input = List.of(
      TextMetadataDto.builder().propertyName("kirjeldus").propertyValue("some free text").build()
    );

    // When
    List<NovelPropertyValueDto> result = adminTextService.checkNovelValues(input);

    // Then
    assertThat(result).isEmpty();
    verify(textPropertyDao, never()).findExistingValues(any());
  }

  @Test
  @DisplayName("Check novel values skips blank property values")
  void checkNovelValues_whenPropertyValueIsBlank_shouldSkip() {
    // Given
    TextPropertyCheckConfig activeConfig = TextPropertyCheckConfig.builder()
      .propertyName("sugu")
      .isActive(true)
      .build();

    when(textPropertyCheckConfigDao.findAll()).thenReturn(List.of(activeConfig));
    when(textPropertyDao.findDistinctPropertyNames()).thenReturn(List.of("sugu"));

    List<TextMetadataDto> input = List.of(
      TextMetadataDto.builder().propertyName("sugu").propertyValue("").build(),
      TextMetadataDto.builder().propertyName("sugu").propertyValue(null).build()
    );

    // When
    List<NovelPropertyValueDto> result = adminTextService.checkNovelValues(input);

    // Then
    assertThat(result).isEmpty();
  }

  @Test
  @DisplayName("Check novel values returns both novel names and novel values when both present")
  void checkNovelValues_whenBothNovelNamesAndValues_shouldReturnBoth() {
    // Given
    TextPropertyCheckConfig activeConfig = TextPropertyCheckConfig.builder()
      .propertyName("sugu")
      .isActive(true)
      .build();

    when(textPropertyCheckConfigDao.findAll()).thenReturn(List.of(activeConfig));
    when(textPropertyDao.findDistinctPropertyNames()).thenReturn(List.of("sugu"));
    when(textPropertyDao.findExistingValues(any())).thenReturn(List.of());

    List<TextMetadataDto> input = List.of(
      TextMetadataDto.builder().propertyName("brandNew").propertyValue("val").build(),
      TextMetadataDto.builder().propertyName("sugu").propertyValue("X").build()
    );

    // When
    List<NovelPropertyValueDto> result = adminTextService.checkNovelValues(input);

    // Then
    assertThat(result).hasSize(2);
    assertThat(result).anyMatch(r -> r.isNovelName() && "brandNew".equals(r.getPropertyName()));
    assertThat(result).anyMatch(r -> !r.isNovelName() && "sugu".equals(r.getPropertyName()));
  }


  @Test
  @DisplayName("Get property check config merges config table with all known property names")
  void getPropertyCheckConfig_shouldMergeConfigWithKnownPropertyNames() {
    // Given
    TextPropertyCheckConfig configuredEntry = TextPropertyCheckConfig.builder()
      .propertyName("sugu")
      .isActive(true)
      .build();

    when(textPropertyCheckConfigDao.findAll()).thenReturn(List.of(configuredEntry));
    when(textPropertyDao.findDistinctPropertyNames()).thenReturn(List.of("sugu", "emakeel"));

    // When
    List<PropertyCheckConfigDto> result = adminTextService.getPropertyCheckConfig();

    // Then
    assertThat(result).hasSize(2);
    assertThat(result).anySatisfy(c -> {
      assertThat(c.getPropertyName()).isEqualTo("emakeel");
      assertThat(c.isActive()).isFalse();
    });
    assertThat(result).anySatisfy(c -> {
      assertThat(c.getPropertyName()).isEqualTo("sugu");
      assertThat(c.isActive()).isTrue();
    });
  }

  @Test
  @DisplayName("Get property check config includes config-only entries not in text_property table")
  void getPropertyCheckConfig_shouldIncludeConfigOnlyEntries() {
    // Given
    TextPropertyCheckConfig configOnly = TextPropertyCheckConfig.builder()
      .propertyName("legacyProp")
      .isActive(false)
      .build();

    when(textPropertyCheckConfigDao.findAll()).thenReturn(List.of(configOnly));
    when(textPropertyDao.findDistinctPropertyNames()).thenReturn(List.of());

    // When
    List<PropertyCheckConfigDto> result = adminTextService.getPropertyCheckConfig();

    // Then
    assertThat(result).hasSize(1);
    assertThat(result.get(0).getPropertyName()).isEqualTo("legacyProp");
    assertThat(result.get(0).isActive()).isFalse();
  }

  @Test
  @DisplayName("Get property check config returns results sorted by property name")
  void getPropertyCheckConfig_shouldReturnSortedByPropertyName() {
    // Given
    when(textPropertyCheckConfigDao.findAll()).thenReturn(List.of());
    when(textPropertyDao.findDistinctPropertyNames()).thenReturn(List.of("sugu", "emakeel", "haridus"));

    // When
    List<PropertyCheckConfigDto> result = adminTextService.getPropertyCheckConfig();

    // Then
    assertThat(result).extracting(PropertyCheckConfigDto::getPropertyName)
      .containsExactly("emakeel", "haridus", "sugu");
  }


  @Test
  @DisplayName("Update property check config calls upsert for each entry")
  void updatePropertyCheckConfig_shouldCallUpsertForEachEntry() {
    // Given
    List<PropertyCheckConfigDto> config = List.of(
      PropertyCheckConfigDto.builder().propertyName("sugu").isActive(true).build(),
      PropertyCheckConfigDto.builder().propertyName("kirjeldus").isActive(false).build()
    );

    // When
    adminTextService.updatePropertyCheckConfig(config);

    // Then
    verify(textPropertyCheckConfigDao).upsert("sugu", true);
    verify(textPropertyCheckConfigDao).upsert("kirjeldus", false);
  }
}

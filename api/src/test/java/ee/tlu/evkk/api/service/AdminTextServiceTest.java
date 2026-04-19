package ee.tlu.evkk.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import ee.evkk.dto.TextDetailsResponseDto;
import ee.evkk.dto.TextMetadataDto;
import ee.evkk.dto.TextUpdateRequestDto;
import ee.evkk.dto.TextsToReviewResponseDto;
import ee.tlu.evkk.api.exception.EntityNotFoundException;
import ee.tlu.evkk.dal.dao.TextAddedDao;
import ee.tlu.evkk.dal.dao.TextDao;
import ee.tlu.evkk.dal.dao.TextPropertyAddedDao;
import ee.tlu.evkk.dal.dao.TextPropertyDao;
import ee.tlu.evkk.dal.dto.TextAndMetadata;
import ee.tlu.evkk.dal.dto.TextMetadata;
import ee.tlu.evkk.dal.dto.TextProperty;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminTextServiceTest {

  private final ObjectMapper objectMapper = new ObjectMapper();

  @Mock
  private TextAddedDao textAddedDao;

  @Mock
  private TextDao textDao;

  @Mock
  private TextPropertyAddedDao textPropertyAddedDao;

  @Mock
  private TextPropertyDao textPropertyDao;

  @InjectMocks
  private AdminTextService adminTextService;

  @Test
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
  void getDonatedTextDetails_whenTextExists_shouldReturnText() throws Exception {
    // Given
    UUID testId = UUID.randomUUID();
    TextAndMetadata textAndMetadata = createTextAndMetadata("Text", List.of());
    when(textAddedDao.findTextAndMetadataById(testId)).thenReturn(textAndMetadata);

    // When
    Optional<TextDetailsResponseDto> response = adminTextService.getDonatedTextDetails(testId);

    // Then
    assertThat(response).isPresent();
    assertThat(response.get().getText()).isEqualTo("Text");
    assertThat(response.get().getProperties()).isEmpty();
    verify(textAddedDao).findTextAndMetadataById(testId);
  }

  @Test
  void getDonatedTextDetails_whenTextNotFound_shouldReturnEmpty() {
    // Given
    UUID testId = UUID.randomUUID();
    when(textAddedDao.findTextAndMetadataById(testId)).thenReturn(null);

    // When
    Optional<TextDetailsResponseDto> response = adminTextService.getDonatedTextDetails(testId);

    // Then
    assertThat(response).isEmpty();
    verify(textAddedDao).findTextAndMetadataById(testId);
  }

  @Test
  void updateDonatedText_shouldUpdateTextAndProperties() throws Exception {
    // Given
    UUID testId = UUID.randomUUID();
    UUID titlePropertyId = UUID.randomUUID();
    UUID authorPropertyId = UUID.randomUUID();

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
  void updateDonatedText_whenPropertyValueUnchanged_shouldNotUpdate() throws Exception {
    // Given
    UUID testId = UUID.randomUUID();
    UUID titlePropertyId = UUID.randomUUID();

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
  void updateDonatedText_withMultiValueProperties_shouldHandleCorrectly() throws Exception {
    // Given
    UUID testId = UUID.randomUUID();
    UUID enId = UUID.randomUUID();
    UUID esId = UUID.randomUUID();
    UUID deId = UUID.randomUUID();

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
  void updateDonatedText_withMixedSingleAndMultiValueProperties_shouldHandleCorrectly() throws Exception {
    // Given
    UUID testId = UUID.randomUUID();
    UUID titleId = UUID.randomUUID();
    UUID enId = UUID.randomUUID();
    UUID esId = UUID.randomUUID();

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
  void updateDonatedText_whenPropertyRemoved_shouldDelete() throws Exception {
    // Given
    UUID testId = UUID.randomUUID();
    UUID titleId = UUID.randomUUID();
    UUID authorId = UUID.randomUUID();
    UUID typeId = UUID.randomUUID();

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
  void updateDonatedText_whenAllPropertiesRemoved_shouldDeleteAll() throws Exception {
    // Given
    UUID testId = UUID.randomUUID();
    UUID titleId = UUID.randomUUID();
    UUID authorId = UUID.randomUUID();

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
  void updateDonatedText_whenTextUnchanged_shouldNotUpdateContent() throws Exception {
    // Given
    UUID testId = UUID.randomUUID();
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
  void updateDonatedText_whenTextNotFound_shouldThrowException() {
    // Given
    UUID testId = UUID.randomUUID();

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
  void getPublishedTextDetails_whenTextExists_shouldReturnText() throws Exception {
    // Given
    UUID testId = UUID.randomUUID();
    TextAndMetadata textAndMetadata = createTextAndMetadata("Text", List.of());
    when(textDao.findTextAndMetadataById(testId)).thenReturn(textAndMetadata);

    // When
    Optional<TextDetailsResponseDto> response = adminTextService.getPublishedTextDetails(testId);

    // Then
    assertThat(response).isPresent();
    assertThat(response.get().getText()).isEqualTo("Text");
    assertThat(response.get().getProperties()).isEmpty();
    verify(textDao).findTextAndMetadataById(testId);
  }

  @Test
  void getPublishedTextDetails_whenTextNotFound_shouldReturnEmpty() {
    // Given
    UUID testId = UUID.randomUUID();
    when(textDao.findTextAndMetadataById(testId)).thenReturn(null);

    // When
    Optional<TextDetailsResponseDto> response = adminTextService.getPublishedTextDetails(testId);

    // Then
    assertThat(response).isEmpty();
    verify(textDao).findTextAndMetadataById(testId);
  }

  @Test
  void updatePublishedText_shouldUpdateTextAndProperties() throws Exception {
    // Given
    UUID testId = UUID.randomUUID();
    UUID titlePropertyId = UUID.randomUUID();
    UUID authorPropertyId = UUID.randomUUID();

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
  void updatePublishedText_whenTextUnchanged_shouldNotUpdateContent() throws Exception {
    // Given
    UUID testId = UUID.randomUUID();
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
  void updatePublishedText_whenTextNotFound_shouldThrowException() {
    // Given
    UUID testId = UUID.randomUUID();

    TextUpdateRequestDto request = new TextUpdateRequestDto();
    request.setText("Updated content");
    request.setProperties(List.of());

    when(textDao.findTextAndMetadataById(testId)).thenReturn(null);

    // When & Then
    assertThatThrownBy(() -> adminTextService.updatePublishedText(testId, request))
      .isInstanceOf(EntityNotFoundException.class);
    verify(textPropertyDao, never()).findByTextId(any());
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
}

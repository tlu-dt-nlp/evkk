package ee.tlu.evkk.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import ee.evkk.dto.TextDetailsResponseDto;
import ee.evkk.dto.TextMetadataDto;
import ee.evkk.dto.TextUpdateRequestDto;
import ee.evkk.dto.TextsToReviewResponseDto;
import ee.tlu.evkk.api.exception.EntityNotFoundException;
import ee.tlu.evkk.dal.dao.TextAddedDao;
import ee.tlu.evkk.dal.dao.TextDao;
import ee.tlu.evkk.dal.dao.TextPropertyDao;
import ee.tlu.evkk.dal.dto.TextAndMetadata;
import ee.tlu.evkk.dal.dto.TextMetadata;
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
    TextAndMetadata existing = createTextAndMetadata("Existing content", List.of(
      createTextMetadata("title", "Existing Title"),
      createTextMetadata("author", "Existing Author")
    ));

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

    // When
    TextDetailsResponseDto response = adminTextService.updatePublishedText(testId, request);

    // Then
    assertThat(response.getText()).isEqualTo("Updated content");
    assertThat(response.getProperties()).hasSize(2);
    verify(textDao).updateTextContent(testId, "Updated content");
    verify(textPropertyDao).deleteAllByTextId(testId);
    verify(textPropertyDao).insertProperty(testId, "title", "Updated Title");
    verify(textPropertyDao).insertProperty(testId, "type", "Article");
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
  }

  private TextAndMetadata createTextAndMetadata(String text, List<TextMetadata> properties) throws Exception {
    String json = objectMapper.writeValueAsString(properties);
    return new TextAndMetadata(json, text);
  }

  private TextMetadata createTextMetadata(String name, String value) throws Exception {
    String json = String.format("{\"propertyName\":\"%s\", \"propertyValue\":\"%s\"}", name, value);
    return objectMapper.readValue(json, TextMetadata.class);
  }
}

package ee.tlu.evkk.api.service;

import ee.tlu.evkk.dal.dao.TextAddedDao;
import ee.tlu.evkk.dal.dao.TextDao;
import ee.tlu.evkk.dal.dto.TextAndMetadata;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminTextServiceTest {

  @Mock
  private TextAddedDao textAddedDao;

  @Mock
  private TextDao textDao;

  @InjectMocks
  private AdminTextService adminTextService;

  @Test
  void getTextsToReview_shouldReturnCount() {
    // Given
    Integer expected = 10;
    when(textAddedDao.count()).thenReturn(expected);

    // When
    Integer result = adminTextService.getTextsToReview();

    // Then
    assertThat(result).isEqualTo(expected);
    verify(textAddedDao).count();
  }

  @Test
  void getDonatedTextDetails_whenTextExists_shouldReturnText() {
    // Given
    UUID testId = UUID.randomUUID();
    TextAndMetadata expected = mock(TextAndMetadata.class);
    when(textAddedDao.findTextAndMetadataById(testId)).thenReturn(expected);

    // When
    Optional<TextAndMetadata> result = adminTextService.getDonatedTextDetails(testId);

    // Then
    assertThat(result)
      .isPresent()
      .hasValue(expected);
    verify(textAddedDao).findTextAndMetadataById(testId);
  }

  @Test
  void getDonatedTextDetails_whenTextNotFound_shouldReturnEmpty() {
    // Given
    UUID testId = UUID.randomUUID();
    when(textAddedDao.findTextAndMetadataById(testId)).thenReturn(null);

    // When
    Optional<TextAndMetadata> result = adminTextService.getDonatedTextDetails(testId);

    // Then
    assertThat(result).isEmpty();
    verify(textAddedDao).findTextAndMetadataById(testId);
  }

  @Test
  void getPublishedTextDetails_whenTextExists_shouldReturnText() {
    // Given
    UUID testId = UUID.randomUUID();
    TextAndMetadata expected = mock(TextAndMetadata.class);
    when(textDao.findTextAndMetadataById(testId)).thenReturn(expected);

    // When
    Optional<TextAndMetadata> result = adminTextService.getPublishedTextDetails(testId);

    // Then
    assertThat(result)
      .isPresent()
      .hasValue(expected);
    verify(textDao).findTextAndMetadataById(testId);
  }

  @Test
  void getPublishedTextDetails_whenTextNotFound_shouldReturnEmpty() {
    // Given
    UUID testId = UUID.randomUUID();
    when(textDao.findTextAndMetadataById(testId)).thenReturn(null);

    // When
    Optional<TextAndMetadata> result = adminTextService.getPublishedTextDetails(testId);

    // Then
    assertThat(result).isEmpty();
    verify(textDao).findTextAndMetadataById(testId);
  }
}

package ee.tlu.evkk.api.service;

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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminTextService {

  private final TextAddedDao textAddedDao;
  private final TextDao textDao;
  private final TextPropertyDao textPropertyDao;

  public TextsToReviewResponseDto getTextsToReview() {
    log.info("Fetching texts to review");
    return TextsToReviewResponseDto.builder()
      .count(textAddedDao.count())
      .build();
  }

  public Optional<TextDetailsResponseDto> getDonatedTextDetails(UUID id) {
    log.info("Fetching donated text details id={}", id);
    return Optional.ofNullable(textAddedDao.findTextAndMetadataById(id))
      .map(this::toTextDetailsResponseDto);
  }

  public Optional<TextDetailsResponseDto> getPublishedTextDetails(UUID id) {
    log.info("Fetching published text details id={}", id);
    return Optional.ofNullable(textDao.findTextAndMetadataById(id))
      .map(this::toTextDetailsResponseDto);
  }

  @Transactional
  public TextDetailsResponseDto updatePublishedText(UUID id, TextUpdateRequestDto request) {
    log.info("Updating published text id={}", id);

    TextAndMetadata existing = validateTextExists(id);
    updateTextContentIfChanged(id, existing.getText(), request.getText());
    replaceAllTextProperties(id, request.getProperties());

    return toTextDetailsResponseDto(textDao.findTextAndMetadataById(id));
  }

  private TextDetailsResponseDto toTextDetailsResponseDto(TextAndMetadata textAndMetadata) {
    return TextDetailsResponseDto.builder()
      .text(textAndMetadata.getText())
      .properties(toTextMetadataDtos(textAndMetadata.getProperties()))
      .build();
  }

  private List<TextMetadataDto> toTextMetadataDtos(List<TextMetadata> textMetadataList) {
    return textMetadataList.stream()
      .map(this::toTextMetadataDto)
      .collect(Collectors.toList());
  }

  private TextMetadataDto toTextMetadataDto(TextMetadata textMetadata) {
    return TextMetadataDto.builder()
      .propertyName(textMetadata.getPropertyName())
      .propertyValue(textMetadata.getPropertyValue())
      .build();
  }

  private TextAndMetadata validateTextExists(UUID id) {
    TextAndMetadata existing = textDao.findTextAndMetadataById(id);
    if (existing == null) {
      throw new EntityNotFoundException();
    }
    return existing;
  }

  private void updateTextContentIfChanged(UUID id, String currentText, String newText) {
    if (newText != null && !newText.equals(currentText)) {
      textDao.updateTextContent(id, newText);
    }
  }

  private void replaceAllTextProperties(UUID id, List<TextMetadataDto> newProperties) {
    textPropertyDao.deleteAllByTextId(id);

    for (TextMetadataDto property : newProperties) {
      textPropertyDao.insertProperty(id, property.getPropertyName(), property.getPropertyValue());
    }
  }
}

package ee.tlu.evkk.api.service;

import ee.evkk.dto.*;
import ee.evkk.dto.enums.CorpusTextContext;
import ee.tlu.evkk.api.exception.EntityNotFoundException;
import ee.tlu.evkk.core.service.TextService;
import ee.tlu.evkk.core.service.helpers.CorpusSearchCriteria;
import ee.tlu.evkk.dal.dao.TextAddedDao;
import ee.tlu.evkk.dal.dao.TextDao;
import ee.tlu.evkk.dal.dao.TextPropertyAddedDao;
import ee.tlu.evkk.dal.dao.TextPropertyDao;
import ee.tlu.evkk.dal.dto.TextAndMetadata;
import ee.tlu.evkk.dal.dto.TextMetadata;
import ee.tlu.evkk.dal.dto.TextProperty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminTextService {

  private final TextService textService;

  private final TextAddedDao textAddedDao;
  private final TextPropertyAddedDao textPropertyAddedDao;
  private final TextDao textDao;
  private final TextPropertyDao textPropertyDao;

  public TextsToReviewResponseDto getTextsToReview() {
    log.info("Fetching texts to review");
    return TextsToReviewResponseDto.builder()
      .count(textAddedDao.count())
      .build();
  }

  public String getDonatedTexts(CorpusRequestDto request) {
    log.info("Fetching donated texts");

    CorpusSearchCriteria searchCriteria = CorpusSearchCriteria.builder()
      .corpusRequestDto(request)
      .corpusTextContext(CorpusTextContext.DONATED)
      .includeMeta(true)
      .build();

    return textService.detailneparing(searchCriteria);
  }

  public Optional<TextDetailsResponseDto> getDonatedTextDetails(UUID id) {
    log.info("Fetching donated text details id={}", id);
    return Optional.ofNullable(textAddedDao.findTextAndMetadataById(id))
      .map(this::toTextDetailsResponseDto);
  }

  @Transactional
  public TextDetailsResponseDto updateDonatedText(UUID id, TextUpdateRequestDto request) {
    log.info("Updating donated text id={}", id);

    TextAndMetadata existing = validateDonatedTextExists(id);
    updateDonatedTextContentIfChanged(id, existing.getText(), request.getText());
    updateDonatedTextProperties(id, request.getProperties());

    return toTextDetailsResponseDto(textAddedDao.findTextAndMetadataById(id));
  }

  @Transactional
  public void deleteDonatedText(UUID id) {
    log.info("Deleting donated text id={}", id);

    validateDonatedTextExists(id);
    textPropertyAddedDao.deleteByTextId(id);
    textAddedDao.deleteById(id);
  }

  @Transactional
  public TextDetailsResponseDto publishDonatedText(UUID id, TextUpdateRequestDto request) {
    log.info("Publishing donated text id={}", id);

    TextAndMetadata donatedTextToPublish = validateDonatedTextExists(id);

    if (request != null) {
      updateDonatedTextContentIfChanged(id, donatedTextToPublish.getText(), request.getText());
      updateDonatedTextProperties(id, request.getProperties());
      donatedTextToPublish = textAddedDao.findTextAndMetadataById(id);
    }

    UUID publishedTextId = textDao.insertDonatedText(donatedTextToPublish.getText());
    textDao.copyPropertiesFromDonatedText(id, publishedTextId);
    textPropertyAddedDao.deleteByTextId(id);
    textAddedDao.deleteById(id);

    return toTextDetailsResponseDto(textDao.findTextAndMetadataById(publishedTextId));
  }

  public String getPublishedTexts(CorpusRequestDto request) {
    log.info("Fetching published texts");

    CorpusSearchCriteria searchCriteria = CorpusSearchCriteria.builder()
      .corpusRequestDto(request)
      .corpusTextContext(CorpusTextContext.PUBLISHED)
      .includeMeta(true)
      .build();

    return textService.detailneparing(searchCriteria);
  }

  public Optional<TextDetailsResponseDto> getPublishedTextDetails(UUID id) {
    log.info("Fetching published text details id={}", id);
    return Optional.ofNullable(textDao.findTextAndMetadataById(id))
      .map(this::toTextDetailsResponseDto);
  }

  @Transactional
  public TextDetailsResponseDto updatePublishedText(UUID id, TextUpdateRequestDto request) {
    log.info("Updating published text id={}", id);

    TextAndMetadata existing = validatePublishedTextExists(id);
    updatePublishedTextContentIfChanged(id, existing.getText(), request.getText());
    updatePublishedTextProperties(id, request.getProperties());

    return toTextDetailsResponseDto(textDao.findTextAndMetadataById(id));
  }

  @Transactional
  public void deletePublishedText(UUID id) {
    log.info("Deleting published text id={}", id);

    validatePublishedTextExists(id);
    textPropertyDao.deleteByTextId(id);
    textDao.deleteById(id);
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

  private TextAndMetadata validateDonatedTextExists(UUID id) {
    TextAndMetadata existing = textAddedDao.findTextAndMetadataById(id);
    if (existing == null) {
      throw new EntityNotFoundException();
    }
    return existing;
  }

  private void updateDonatedTextContentIfChanged(UUID id, String currentText, String newText) {
    if (newText != null && !newText.equals(currentText)) {
      textAddedDao.updateTextContent(id, newText);
    }
  }

  private void updateDonatedTextProperties(UUID id, List<TextMetadataDto> newProperties) {
    Collection<TextProperty> existingProperties = textPropertyAddedDao.findByTextId(id);
    Map<String, List<TextProperty>> existingByName = groupPropertiesByName(existingProperties);
    Set<UUID> idsToKeep = new HashSet<>();

    for (TextMetadataDto newProperty : newProperties) {
      PropertyMatch match = findMatchingProperty(existingByName, newProperty, idsToKeep);

      if (match.id() != null && match.valueChanged()) {
        textPropertyAddedDao.updateProperty(match.id(), newProperty.getPropertyValue());
      } else if (match.id() == null) {
        textPropertyAddedDao.insertProperty(id, newProperty.getPropertyName(), newProperty.getPropertyValue());
      }
    }

    deleteUnusedProperties(existingProperties, idsToKeep, textPropertyAddedDao::deleteByIds);
  }

  private Map<String, List<TextProperty>> groupPropertiesByName(Collection<TextProperty> properties) {
    return properties.stream()
      .collect(Collectors.groupingBy(TextProperty::getPropertyName));
  }

  private PropertyMatch findMatchingProperty(
    Map<String, List<TextProperty>> existingByName,
    TextMetadataDto newProperty,
    Set<UUID> idsToKeep
  ) {
    List<TextProperty> matchingProperties = existingByName.get(newProperty.getPropertyName());

    if (matchingProperties == null || matchingProperties.isEmpty()) {
      return new PropertyMatch(null, false);
    }

    // First pass: Try to find exact value match (for multi-value properties)
    for (TextProperty existing : matchingProperties) {
      if (
        !idsToKeep.contains(existing.getId())
          && Objects.equals(existing.getPropertyValue(), newProperty.getPropertyValue())
      ) {
        idsToKeep.add(existing.getId());
        return new PropertyMatch(existing.getId(), false);
      }
    }

    // Second pass: If no value match was found, take first unused (for single-value properties)
    for (TextProperty existing : matchingProperties) {
      if (!idsToKeep.contains(existing.getId())) {
        idsToKeep.add(existing.getId());
        return new PropertyMatch(existing.getId(), true);
      }
    }

    return new PropertyMatch(null, false);
  }

  private void deleteUnusedProperties(
    Collection<TextProperty> existingProperties,
    Set<UUID> idsToKeep,
    Consumer<List<UUID>> deleteFunction
  ) {
    List<UUID> idsToDelete = existingProperties.stream()
      .map(TextProperty::getId)
      .filter(id -> !idsToKeep.contains(id))
      .collect(Collectors.toList());

    if (!idsToDelete.isEmpty()) {
      deleteFunction.accept(idsToDelete);
    }
  }

  private TextAndMetadata validatePublishedTextExists(UUID id) {
    TextAndMetadata existing = textDao.findTextAndMetadataById(id);
    if (existing == null) {
      throw new EntityNotFoundException();
    }
    return existing;
  }

  private void updatePublishedTextContentIfChanged(UUID id, String currentText, String newText) {
    if (newText != null && !newText.equals(currentText)) {
      textDao.updateTextContent(id, newText);
    }
  }

  private void updatePublishedTextProperties(UUID id, List<TextMetadataDto> newProperties) {
    Collection<TextProperty> existingProperties = textPropertyDao.findByTextId(id);
    Map<String, List<TextProperty>> existingByName = groupPropertiesByName(existingProperties);
    Set<UUID> idsToKeep = new HashSet<>();

    for (TextMetadataDto newProperty : newProperties) {
      PropertyMatch match = findMatchingProperty(existingByName, newProperty, idsToKeep);

      if (match.id() != null && match.valueChanged()) {
        textPropertyDao.updateProperty(match.id(), newProperty.getPropertyValue());
      } else if (match.id() == null) {
        textPropertyDao.insertProperty(id, newProperty.getPropertyName(), newProperty.getPropertyValue());
      }
    }

    deleteUnusedProperties(existingProperties, idsToKeep, textPropertyDao::deleteByIds);
  }

  private static class PropertyMatch {
    private final UUID id;
    private final boolean valueChanged;

    PropertyMatch(UUID id, boolean valueChanged) {
      this.id = id;
      this.valueChanged = valueChanged;
    }

    UUID id() {
      return id;
    }

    boolean valueChanged() {
      return valueChanged;
    }
  }
}

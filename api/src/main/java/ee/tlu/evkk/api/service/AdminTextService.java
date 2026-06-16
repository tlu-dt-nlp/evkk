package ee.tlu.evkk.api.service;

import ee.evkk.dto.CorpusRequestDto;
import ee.evkk.dto.DonatedTextRequestDto;
import ee.evkk.dto.TextDetailsResponseDto;
import ee.evkk.dto.TextMetadataDto;
import ee.evkk.dto.TextUpdateRequestDto;
import ee.evkk.dto.TextsToReviewResponseDto;
import ee.tlu.evkk.api.converter.DonatedTextPropertyMapper;
import ee.tlu.evkk.api.converter.DtoMapper;
import ee.tlu.evkk.api.exception.EntityNotFoundException;
import ee.tlu.evkk.core.service.TextService;
import ee.tlu.evkk.dal.dao.TextAddedDao;
import ee.tlu.evkk.dal.dao.TextDao;
import ee.tlu.evkk.dal.dao.TextPropertyAddedDao;
import ee.tlu.evkk.dal.dao.TextPropertyDao;
import ee.tlu.evkk.dal.dto.TextAndMetadata;
import ee.tlu.evkk.dal.dto.TextProperty;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.BiConsumer;
import java.util.function.Consumer;
import java.util.function.Function;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminTextService {

  private final TextService textService;
  private final TextAddedDao textAddedDao;
  private final TextPropertyAddedDao textPropertyAddedDao;
  private final TextDao textDao;
  private final TextPropertyDao textPropertyDao;
  private final DtoMapper dtoMapper;

  public TextsToReviewResponseDto getTextsToReview() {
    return TextsToReviewResponseDto.builder()
      .count(textAddedDao.count())
      .build();
  }

  public String getDonatedTexts(DonatedTextRequestDto request) {
    return textService.getDonatedTexts(request, true);
  }

  public TextDetailsResponseDto getDonatedTextDetails(UUID id) {
    return dtoMapper.toDto(validateTextExists(id, textAddedDao::findTextAndMetadataById));
  }

  @Transactional
  public TextDetailsResponseDto updateDonatedText(UUID id, TextUpdateRequestDto request) {
    log.info("Updating donated text id={}", id);

    TextAndMetadata existing = validateTextExists(id, textAddedDao::findTextAndMetadataById);
    updateDonatedTextContentIfChanged(id, existing.getText(), request.getText());
    updateDonatedTextProperties(id, request.getProperties());

    return dtoMapper.toDto(textAddedDao.findTextAndMetadataById(id));
  }

  @Transactional
  public void deleteDonatedText(UUID id) {
    log.info("Deleting donated text id={}", id);

    validateTextExists(id, textAddedDao::findTextAndMetadataById);
    textPropertyAddedDao.deleteByTextId(id);
    textAddedDao.deleteById(id);
  }

  @Transactional
  public TextDetailsResponseDto publishDonatedText(UUID id, TextUpdateRequestDto request) {
    log.info("Publishing donated text id={}", id);

    TextAndMetadata donatedTextToPublish = validateTextExists(id, textAddedDao::findTextAndMetadataById);

    if (request != null) {
      updateDonatedTextContentIfChanged(id, donatedTextToPublish.getText(), request.getText());
      updateDonatedTextProperties(id, request.getProperties());
      donatedTextToPublish = textAddedDao.findTextAndMetadataById(id);
    }

    String createdAt = textAddedDao.findCreatedAtById(id);
    UUID publishedTextId = textDao.insertDonatedText(donatedTextToPublish.getText());
    DonatedTextPropertyMapper.map(donatedTextToPublish.getProperties(), createdAt)
      .forEach(p -> textPropertyDao.insertProperty(publishedTextId, p.getPropertyName(), p.getPropertyValue()));
    textPropertyAddedDao.deleteByTextId(id);
    textAddedDao.deleteById(id);

    return dtoMapper.toDto(textDao.findTextAndMetadataById(publishedTextId));
  }

  public String getPublishedTexts(CorpusRequestDto request) {
    return textService.detailneparing(request, true);
  }

  public TextDetailsResponseDto getPublishedTextDetails(UUID id) {
    return dtoMapper.toDto(validateTextExists(id, textDao::findTextAndMetadataById));
  }

  @Transactional
  public TextDetailsResponseDto updatePublishedText(UUID id, TextUpdateRequestDto request) {
    log.info("Updating published text id={}", id);

    TextAndMetadata existing = validateTextExists(id, textDao::findTextAndMetadataById);
    updatePublishedTextContentIfChanged(id, existing.getText(), request.getText());
    updateProperties(
      id,
      request.getProperties(),
      textPropertyDao::findByTextId,
      textPropertyDao::updateProperty,
      textPropertyDao::insertProperty,
      textPropertyDao::deleteByIds
    );

    return dtoMapper.toDto(textDao.findTextAndMetadataById(id));
  }

  @Transactional
  public void deletePublishedText(UUID id) {
    log.info("Deleting published text id={}", id);

    validateTextExists(id, textDao::findTextAndMetadataById);
    textPropertyDao.deleteByTextId(id);
    textDao.deleteById(id);
  }

  private TextAndMetadata validateTextExists(UUID id, Function<UUID, TextAndMetadata> findFn) {
    TextAndMetadata existing = findFn.apply(id);
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
    updateProperties(
      id,
      newProperties,
      textPropertyAddedDao::findByTextId,
      textPropertyAddedDao::updateProperty,
      textPropertyAddedDao::insertProperty,
      textPropertyAddedDao::deleteByIds
    );
  }

  private Map<String, List<TextProperty>> groupPropertiesByName(Collection<TextProperty> properties) {
    return properties.stream()
      .collect(groupingBy(TextProperty::getPropertyName));
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
      if (!idsToKeep.contains(existing.getId()) && Objects.equals(existing.getPropertyValue(), newProperty.getPropertyValue())) {
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
      .collect(toList());

    if (!idsToDelete.isEmpty()) {
      deleteFunction.accept(idsToDelete);
    }
  }

  private void updatePublishedTextContentIfChanged(UUID id, String currentText, String newText) {
    if (newText != null && !newText.equals(currentText)) {
      textDao.updateTextContent(id, newText);
    }
  }

  private void updateProperties(
    UUID id,
    List<TextMetadataDto> newProperties,
    Function<UUID, Collection<TextProperty>> findFn,
    BiConsumer<UUID, String> updateFn,
    TriConsumer<UUID, String, String> insertFn,
    Consumer<List<UUID>> deleteFn
  ) {
    Collection<TextProperty> existingProperties = findFn.apply(id);
    Map<String, List<TextProperty>> existingByName = groupPropertiesByName(existingProperties);
    Set<UUID> idsToKeep = new HashSet<>();

    for (TextMetadataDto newProperty : newProperties) {
      PropertyMatch match = findMatchingProperty(existingByName, newProperty, idsToKeep);

      if (match.getId() != null && match.isValueChanged()) {
        updateFn.accept(match.getId(), newProperty.getPropertyValue());
      } else if (match.getId() == null) {
        insertFn.accept(id, newProperty.getPropertyName(), newProperty.getPropertyValue());
      }
    }

    deleteUnusedProperties(existingProperties, idsToKeep, deleteFn);
  }

  @FunctionalInterface
  private interface TriConsumer<A, B, C> {

    void accept(A a, B b, C c);
  }

  @Data
  @RequiredArgsConstructor
  private static class PropertyMatch {
    private final UUID id;
    private final boolean valueChanged;
  }
}

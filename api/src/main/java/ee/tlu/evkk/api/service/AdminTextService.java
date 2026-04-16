package ee.tlu.evkk.api.service;

import ee.tlu.evkk.dal.dao.TextAddedDao;
import ee.tlu.evkk.dal.dao.TextDao;
import ee.tlu.evkk.dal.dto.TextAndMetadata;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminTextService {

  private final TextAddedDao textAddedDao;
  private final TextDao textDao;

  public Integer getTextsToReview() {
    log.info("Fetching texts to review count");
    return textAddedDao.count();
  }

  public Optional<TextAndMetadata> getPublishedTextDetails(UUID id) {
    log.info("Fetching published text details id={}", id);
    return Optional.ofNullable(textDao.findTextAndMetadataById(id));
  }
}

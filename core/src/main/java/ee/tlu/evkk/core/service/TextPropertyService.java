package ee.tlu.evkk.core.service;

import ee.tlu.evkk.dal.dao.TextPropertyDao;
import ee.tlu.evkk.dal.dto.TextProperty;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.Collection;
import java.util.UUID;

/**
 * @author Mikk Tarvas
 * Date: 11.02.2022
 */
@Service
@RequiredArgsConstructor
public class TextPropertyService {

  private final TextPropertyDao textPropertyDao;

  public MultiValueMap<String, String> getTextProperties(UUID textId) {
    Collection<TextProperty> textProperties = textPropertyDao.findByTextId(textId);
    MultiValueMap<String, String> result = new LinkedMultiValueMap<>();
    for (TextProperty textProperty : textProperties) {
      String propertyName = textProperty.getPropertyName();
      String propertyValue = textProperty.getPropertyValue();
      if (isNullOrBlank(propertyName) || isNullOrBlank(propertyValue)) continue;
      result.add(propertyName, propertyValue);
    }
    return result;
  }

  private static boolean isNullOrBlank(String string) {
    return string == null || string.isBlank();
  }

}

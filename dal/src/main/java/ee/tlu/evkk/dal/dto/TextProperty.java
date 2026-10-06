package ee.tlu.evkk.dal.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

/**
 * @author Mikk Tarvas
 * Date: 11.02.2022
 */
@Getter
@Setter
@Builder
public class TextProperty {

  private UUID id;
  private UUID textId;
  private String propertyName;
  private String propertyValue;
}

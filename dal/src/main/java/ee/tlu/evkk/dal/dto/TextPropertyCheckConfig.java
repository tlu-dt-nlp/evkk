package ee.tlu.evkk.dal.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TextPropertyCheckConfig {

  private String propertyName;
  private boolean isActive;
}

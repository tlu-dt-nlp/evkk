package ee.tlu.evkk.api.controller.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PropertyCheckConfigDto {

  private String propertyName;
  @JsonProperty("isActive")
  private boolean isActive;
}

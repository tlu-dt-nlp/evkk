package ee.tlu.evkk.api.controller.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NovelPropertyValueDto {

  private String propertyName;
  private String propertyValue;
  @JsonProperty("isNovelName")
  private boolean isNovelName;
}

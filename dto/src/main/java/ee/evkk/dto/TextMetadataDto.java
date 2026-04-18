package ee.evkk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import javax.validation.constraints.NotBlank;

@Getter
@Builder
@AllArgsConstructor
public class TextMetadataDto {

  @NotBlank
  private String propertyName;
  private String propertyValue;
}

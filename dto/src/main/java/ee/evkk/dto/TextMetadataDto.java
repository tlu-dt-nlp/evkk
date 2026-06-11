package ee.evkk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TextMetadataDto {

  @NotBlank
  private String propertyName;

  @NotBlank
  private String propertyValue;
}

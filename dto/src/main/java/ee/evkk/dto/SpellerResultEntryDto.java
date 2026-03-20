package ee.evkk.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SpellerResultEntryDto {

  private boolean corrected;
  private String text;

  @JsonProperty("error_id")
  private String errorId;

  @JsonProperty("corrected_text")
  private String correctedText;

  @JsonProperty("correction_type")
  private String correctionType;
}

package ee.evkk.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
public class SpellerResponseDto {

  @JsonProperty("corrector_results")
  private List<SpellerResultEntryDto> correctorResults;

  @JsonProperty("error_list")
  private Map<String, List<SpellerResultEntryDto>> errorList;

  @JsonProperty("error_count")
  private int errorCount;
}

package ee.evkk.dto;

import ee.evkk.dto.enums.WordType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Builder
@Accessors(chain = true)
@AllArgsConstructor
@NoArgsConstructor
public class WordlistRequestDto {

  private Set<UUID> corpusTextIds;
  private String ownTexts;

  @NotNull
  private WordType type;

  private boolean excludeStopwords;
  private Set<String> customStopwords;
  private boolean keepCapitalization;

  @Min(value = 1)
  private Integer minFrequency;
}

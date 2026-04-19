package ee.evkk.dto;

import ee.evkk.dto.enums.Language;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;

@Getter
@Setter
public class WordAnalyserRequestDto {

  private Set<UUID> corpusTextIds;
  private String ownTexts;
  private Language language;
}

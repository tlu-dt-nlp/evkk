package ee.tlu.evkk.core.service.helpers;

import ee.evkk.dto.CorpusRequestDto;
import ee.evkk.dto.enums.CorpusTextContext;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class CorpusSearchCriteria {

  private CorpusRequestDto corpusRequestDto;
  private CorpusTextContext corpusTextContext;
  private boolean includeMeta;
}

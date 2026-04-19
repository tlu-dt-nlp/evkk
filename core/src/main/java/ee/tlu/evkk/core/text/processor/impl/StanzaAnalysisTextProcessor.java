package ee.tlu.evkk.core.text.processor.impl;

import ee.tlu.evkk.core.integration.StanzaServerClient;
import ee.tlu.evkk.dal.dto.StanzaResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.annotation.Nonnull;
import java.util.HashMap;
import java.util.Map;

import static ee.tlu.evkk.core.text.processor.TextProcessor.Type.STANZA_ANALYSIS;

@Component
@RequiredArgsConstructor
public class StanzaAnalysisTextProcessor extends AbstractTextProcessor {

  private final StanzaServerClient stanzaServerClient;

  @Override
  public long getVersion() {
    return 1L;
  }

  @Nonnull
  @Override
  public Type getType() {
    return STANZA_ANALYSIS;
  }

  @Nonnull
  @Override
  protected Object doProcess(@Nonnull String input, @Nonnull Context context) {
    Map<String, StanzaResponseDto> answer = new HashMap<>();
    answer.put("content", stanzaServerClient.getFullTextAnalysis(input));
    return answer;
  }

}

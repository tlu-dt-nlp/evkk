package ee.tlu.evkk.core.text.processor.impl;

import ee.tlu.evkk.core.integration.StanzaServerClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.annotation.Nonnull;
import java.util.HashMap;
import java.util.Map;

import static ee.tlu.evkk.core.text.processor.TextProcessor.Type.CHARS_WORDS_SENTENCES;
import static java.lang.Integer.parseInt;

@Component
@RequiredArgsConstructor
public class CharsWordsSentencesTextProcessor extends AbstractTextProcessor {

  private final StanzaServerClient stanzaServerClient;

  @Override
  public long getVersion() {
    return 1L;
  }

  @Nonnull
  @Override
  public Type getType() {
    return CHARS_WORDS_SENTENCES;
  }

  @Nonnull
  @Override
  protected Object doProcess(@Nonnull String input, @Nonnull Context context) {
    String languageCode = context.getLanguageCode().orElseThrow(() -> new RuntimeException("No language code provided"));
    String languageIsoCode = languageCodeToIso(languageCode);
    String[] triple = stanzaServerClient.getTahedSonadLaused(input, languageIsoCode);
    Map<String, Integer> answer = new HashMap<>();
    answer.put("charCount", input.length());
    answer.put("wordCount", parseInt(triple[0]));
    answer.put("sentenceCount", parseInt(triple[1]));
    return answer;
  }


  private static String languageCodeToIso(String languageCode) {
    if (languageCode.equals("eesti")) return "et";
    if (languageCode.equals("vene")) return "ru";
    throw new IllegalArgumentException("Invalid language code: " + languageCode);
  }

}

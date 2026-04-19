package ee.tlu.evkk.core.text.processor;

import lombok.Getter;

import javax.annotation.Nonnull;
import java.util.Optional;
import java.util.UUID;

import static java.util.Optional.ofNullable;

/**
 * @author Mikk Tarvas
 * Date: 21.01.2022
 */
public interface TextProcessor {

  long getVersion();

  @Nonnull
  Type getType();

  @Nonnull
  Object process(@Nonnull String input, @Nonnull Context context);

  enum Type {
    LEMMATIZER,
    CORRECTOR,
    LANGUAGE_LEVEL,
    ANNOTATE_ESTNLTK,
    ANNOTATE_STANZA_CONLLU,
    ANNOTATE_TEI,
    CHARS_WORDS_SENTENCES,
    STANZA_ANALYSIS
  }

  class Context {

    private static final Context INSTANCE = new Context(null, null, null);

    private final String languageCode;
    @Getter
    private final String fileName;
    @Getter
    private final UUID textId;

    private Context(String languageCode, String fileName, UUID textId) {
      this.languageCode = languageCode;
      this.fileName = fileName;
      this.textId = textId;
    }

    private Context copy(String languageCode, String fileName, UUID textId) {
      return new Context(languageCode, fileName, textId);
    }

    public static Context newInstance() {
      return INSTANCE;
    }

    public Context withLanguageCode(String languageCode) {
      return copy(languageCode, fileName, textId);
    }

    public Context withTextIdAndFileName(UUID textId, String fileName) {
      return copy(languageCode, fileName, textId);
    }

    public Optional<String> getLanguageCode() {
      return ofNullable(languageCode);
    }
  }
}

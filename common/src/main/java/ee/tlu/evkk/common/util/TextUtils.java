package ee.tlu.evkk.common.util;

import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static com.google.common.collect.Lists.partition;
import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;
import static lombok.AccessLevel.PRIVATE;

@Component
@NoArgsConstructor(access = PRIVATE)
public class TextUtils {

  private static final String NEWLINE = "\\n";
  private static final String DOUBLE_NEWLINE = "\\n\\n";
  private static final String TAB = "\\t";
  /**
   * <code>&#x5C;u00AD</code> — soft hyphen (optional hyphen shown only at line breaks) <br>
   * <code>&#x5C;u200B</code> — zero-width space (invisible break opportunity) <br>
   * <code>&#x5C;u200C</code>, <code>&#x5C;u200D</code> — zero-width non-joiner / joiner (affects ligatures and script connections) <br>
   * <code>&#x5C;u200E</code>, <code>&#x5C;u200F</code> — left-to-right / right-to-left marks (affect the text direction) <br>
   * <code>&#x5C;u202A</code>–<code>&#x5C;u202E</code> — bi-directional control characters (can reorder text visually) <br>
   * <code>&#x5C;u2060</code>–<code>&#x5C;u2064</code> — word joiner and invisible operators (prevent or alter word breaks) <br>
   * <code>&#x5C;u2066</code>–<code>&#x5C;u2069</code> — bi-directional isolates (modern text direction controls) <br>
   * <code>&#x5C;u180E</code> — Mongolian vowel separator (obsolete spacing character) <br>
   * <code>&#x5C;uFEFF</code> — byte order mark (invisible marker sometimes at the start of text) <br>
   * <code>&#x5C;uFFF9</code>–<code>&#x5C;uFFFB</code> — interlinear annotation controls (invisible markers sometimes appearing in PDF or ePub text) <br>
   * <code>&#x5C;u00B7</code> — middle dot symbol sometimes appearing in the middle of words
   */
  private static final String INVISIBLE_CHARACTER_REGEX = "[\\u00AD\\u180E\\u200B-\\u200F\\u202A-\\u202E\\u2060-\\u206F\\uFEFF\\uFFF9-\\uFFFB\\u00B7]";

  public static List<List<UUID>> getSortedPartitionedUUIDs(Set<UUID> ids) {
    List<UUID> sortedCorpusTextIds = ids.stream().sorted(comparing(UUID::toString)).collect(toList());
    return partition(new ArrayList<>(sortedCorpusTextIds), 1000);
  }

  public static String sanitizeText(String text) {
    return text
      .replace(NEWLINE, " ")
      .replace(DOUBLE_NEWLINE, " ")
      .replace(TAB, " ")
      .replaceAll(INVISIBLE_CHARACTER_REGEX, "");
  }

  public static String sanitizeTextDeep(String text) {
    return sanitizeText(text)
      .replace("'", "")
      .replace("*", "")
      .replace("&quot;", "\"");
  }

  public static List<String> sanitizeLemmaStrings(List<String> lemmas) {
    return lemmas.stream()
      .map(TextUtils::sanitizeLemmaString)
      .collect(toList());
  }

  public static String sanitizeLemmaString(String lemma) {
    return lemma == null ? "–" : lemma
        .replace("'", "")
        .replace("*", "")
        .replace("_", "")
        .replace("=", "");
  }

  public static List<String> sanitizeWordStrings(List<String> words) {
    return words.stream()
      .map(word ->
        word == null ? "–" : word
          .replace("'", "")
          .replace("*", ""))
      .collect(toList());
  }
}

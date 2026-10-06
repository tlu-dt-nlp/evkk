package ee.tlu.evkk.api.util;

import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PRIVATE;

/**
 * @author Mikk Tarvas
 * Date: 04.06.2020
 */
@NoArgsConstructor(access = PRIVATE)
public class StringUtils {

  public static String charSequenceToString(CharSequence charSequence) {
    if (charSequence == null) return null;
    if (charSequence instanceof String) return (String) charSequence;
    return charSequence.toString();
  }

  public static boolean isNullOrBlank(CharSequence charSequence) {
    String string = charSequenceToString(charSequence);
    return string == null || string.isBlank();
  }
}

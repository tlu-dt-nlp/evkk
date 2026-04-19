package ee.tlu.evkk.common.util;

import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PRIVATE;

/**
 * @author Mikk Tarvas
 * Date: 04.06.2020
 */
@NoArgsConstructor(access = PRIVATE)
public class CollectionUtils {

  public static <T> boolean isNullOrEmpty(T[] arr) {
    return arr == null || arr.length == 0;
  }
}

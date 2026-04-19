package ee.tlu.evkk.api.controller.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author Mikk Tarvas
 * Date: 05.06.2020
 */
@Getter
@AllArgsConstructor
public class ErrorEntity {

  private final String code;
  private final String message;
  private final String field;
}

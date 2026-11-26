package ee.tlu.evkk.api.exception;

import lombok.Getter;

@Getter
public class BadRequestException extends RuntimeException {

  private final ErrorCode errorCode;

  public BadRequestException(ErrorCode errorCode, String message) {
    super(message);
    this.errorCode = errorCode;
  }
}

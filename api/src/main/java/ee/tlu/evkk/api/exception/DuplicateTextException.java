package ee.tlu.evkk.api.exception;

public class DuplicateTextException extends AbstractBusinessException {

  @Override
  public String getCode() {
    return "DuplicateText";
  }
}

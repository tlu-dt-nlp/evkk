package ee.tlu.evkk.api.exception;

public class ExerciseNotFoundOrExpiredException extends AbstractBusinessException {

  @Override
  public String getCode() {
    return "ExerciseNotFoundOrExpired";
  }
}

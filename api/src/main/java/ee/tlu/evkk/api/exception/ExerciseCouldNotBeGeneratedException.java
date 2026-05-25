package ee.tlu.evkk.api.exception;

public class ExerciseCouldNotBeGeneratedException extends AbstractBusinessException {

  @Override
  public String getCode() {
    return "ExerciseCouldNotBeGenerated";
  }
}

package ee.tlu.evkk.api.exception;

public class ExerciseDidNotPassQualityGateException extends AbstractBusinessException {

  @Override
  public String getCode() {
    return "ExerciseDidNotPassQualityGate";
  }
}

package ee.tlu.evkk.api.exception;

public class ExerciseInvalidAmountOfAnswersException extends AbstractBusinessException {

  @Override
  public String getCode() {
    return "ExerciseInvalidAmountOfAnswers";
  }
}

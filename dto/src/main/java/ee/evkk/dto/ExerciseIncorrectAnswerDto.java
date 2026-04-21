package ee.evkk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExerciseIncorrectAnswerDto {

  private int index;
  private String submittedAnswer;
  private String correctAnswer;
  private String explanation;
}

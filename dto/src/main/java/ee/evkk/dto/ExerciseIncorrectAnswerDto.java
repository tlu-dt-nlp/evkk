package ee.evkk.dto;

import lombok.Data;

@Data
public class ExerciseIncorrectAnswerDto {

  private int index;
  private String submittedAnswer;
  private String correctAnswer;
  private String explanation;

  public ExerciseIncorrectAnswerDto(int index, String submittedAnswer, String correctAnswer) {
    this.index = index;
    this.submittedAnswer = submittedAnswer;
    this.correctAnswer = correctAnswer;
  }
}

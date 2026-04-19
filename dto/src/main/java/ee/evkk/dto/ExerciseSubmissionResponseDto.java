package ee.evkk.dto;

import lombok.Data;

import java.util.List;

@Data
public class ExerciseSubmissionResponseDto {

  private boolean correct;
  private List<Mistake> mistakes;
//  todo

  @Data
  public static class Mistake {

//    todo
    private String explanation;
  }
}

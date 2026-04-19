package ee.evkk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class FillInTheBlanksExercise {

  private String textWithBlanks;
  private List<Blank> blanks;

  @Data
  @AllArgsConstructor
  public static class Blank {
    private int startChar;
    private int endChar;
    private String hint;
  }
}

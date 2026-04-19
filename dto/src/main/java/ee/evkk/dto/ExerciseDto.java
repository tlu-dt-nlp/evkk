package ee.evkk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ExerciseDto {

  private String textWithBlanks;
  private List<Blank> blanks;

  @Data
  @AllArgsConstructor
  public static class Blank {

    private Integer startChar;
    private Integer endChar;
    private String hint;
  }
}

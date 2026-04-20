package ee.evkk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ExerciseDto {

  private String textWithBlanks;
  private List<Blank> blanks;
  private List<SentenceWithBlanks> sentencesWithBlanks;

  public ExerciseDto(String textWithBlanks, List<Blank> blanks) {
    this.textWithBlanks = textWithBlanks;
    this.blanks = blanks;
  }

  public ExerciseDto(List<SentenceWithBlanks> sentencesWithBlanks) {
    this.sentencesWithBlanks = sentencesWithBlanks;
  }

  public ExerciseDto(List<SentenceWithBlanks> sentencesWithBlanks, List<Blank> blanks) {
    this.sentencesWithBlanks = sentencesWithBlanks;
    this.blanks = blanks;
  }

  @Data
  @AllArgsConstructor
  public static class SentenceWithBlanks {

    private String sentence;
    private List<Blank> blanks;
  }

  @Data
  @AllArgsConstructor
  public static class Blank {

    private Integer startChar;
    private Integer endChar;
    private String hint;
  }
}

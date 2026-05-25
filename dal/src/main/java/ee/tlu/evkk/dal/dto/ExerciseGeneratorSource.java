package ee.tlu.evkk.dal.dto;

import ee.evkk.dto.ExerciseGeneratorAnalysisDto;
import ee.evkk.dto.ExerciseGeneratorAnalysisDto.Sentence;
import ee.tlu.evkk.dal.json.Json;
import lombok.Data;

import java.util.UUID;

@Data
public class ExerciseGeneratorSource {

  private UUID id;
  private String content;
  private Json analysis;

  public ExerciseGeneratorAnalysisDto getTextAsObject() {
    return analysis.getAsObject(ExerciseGeneratorAnalysisDto.class);
  }

  public Sentence getSentenceAsObject() {
    return analysis.getAsObject(Sentence.class);
  }
}

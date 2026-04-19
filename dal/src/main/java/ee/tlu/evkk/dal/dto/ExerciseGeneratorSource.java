package ee.tlu.evkk.dal.dto;

import ee.evkk.dto.ExerciseGeneratorAnalysisDto;
import ee.tlu.evkk.dal.json.Json;
import lombok.Data;

import java.util.UUID;

@Data
public class ExerciseGeneratorSource {

  private UUID id;
  private String content;
  private Json analysis;

  public ExerciseGeneratorAnalysisDto getAnalysisAsObject() {
    return analysis.getAsObject(ExerciseGeneratorAnalysisDto.class);
  }
}

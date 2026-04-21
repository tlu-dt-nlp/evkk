package ee.tlu.evkk.dal.dto;

import ee.tlu.evkk.dal.json.Json;
import lombok.Data;

import java.util.UUID;

@Data
public class ExerciseAnswer {

  private UUID id;
  private Json answers;
  private Json exerciseData;
}

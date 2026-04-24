package ee.tlu.evkk.dal.dto;

import ee.evkk.dto.enums.ExerciseFormat;
import ee.evkk.dto.enums.ExerciseStructureType;
import ee.evkk.dto.enums.ExerciseType;
import ee.tlu.evkk.dal.json.Json;
import lombok.Data;

import java.util.UUID;

@Data
public class ExerciseAnswer {

  private UUID id;
  private ExerciseType type;
  private ExerciseStructureType structureType;
  private ExerciseFormat format;
  private Json answers;
  private Json exerciseData;
}

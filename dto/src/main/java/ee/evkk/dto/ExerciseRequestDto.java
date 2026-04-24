package ee.evkk.dto;

import ee.evkk.dto.enums.ExerciseFormat;
import ee.evkk.dto.enums.ExerciseStructureType;
import ee.evkk.dto.enums.ExerciseType;
import ee.evkk.dto.enums.TargetWordCriteria;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class ExerciseRequestDto {

  @NotNull
  private ExerciseType type;

  @NotNull
  private ExerciseStructureType structureType;

  @NotNull
  private ExerciseFormat format;

  @NotNull
  private TargetWordCriteria targetWordCriteria;

  private String topic;
  private boolean performQualityCheck = true;
}

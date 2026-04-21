package ee.evkk.dto;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class ExerciseSubmissionDto {

  private UUID exerciseId;
  private List<String> answers;
}

package ee.tlu.evkk.api.controller;

import ee.evkk.dto.ExerciseDto;
import ee.evkk.dto.ExerciseSubmissionResponseDto;
import ee.evkk.dto.enums.ExerciseFormat;
import ee.evkk.dto.enums.ExerciseStructureType;
import ee.evkk.dto.enums.ExerciseType;
import ee.tlu.evkk.api.service.ExerciseGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("exercise-generator")
public class ExerciseGeneratorController {

  private final ExerciseGeneratorService exerciseGeneratorService;

  @GetMapping("generate")
  public ExerciseDto generateExercise(
    @RequestParam ExerciseType type,
    @RequestParam ExerciseStructureType structureType,
    @RequestParam ExerciseFormat format,
    @RequestParam(required = false) String topic,
    @RequestParam(required = false) boolean setC1Criteria
  ) {
    return exerciseGeneratorService.generateExercise(type, structureType, format, topic, setC1Criteria);
  }

  @PostMapping("submit")
  public ExerciseSubmissionResponseDto submitExercise() {
//    todo
    return null;
  }
}

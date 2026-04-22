package ee.tlu.evkk.api.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import ee.evkk.dto.ExerciseDto;
import ee.evkk.dto.ExerciseIncorrectAnswerDto;
import ee.evkk.dto.ExerciseRequestDto;
import ee.tlu.evkk.api.exception.ExerciseCouldNotBeGeneratedException;
import ee.tlu.evkk.api.exception.ExerciseInvalidAmountOfAnswersException;
import ee.tlu.evkk.api.exception.ExerciseNotFoundOrExpiredException;
import ee.tlu.evkk.api.service.ExerciseGeneratorService;
import ee.tlu.evkk.api.service.ExerciseSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("exercise-generator")
public class ExerciseGeneratorController {

  private final ExerciseGeneratorService exerciseGeneratorService;
  private final ExerciseSubmissionService exerciseSubmissionService;

  @GetMapping("generate")
  public ExerciseDto generateExercise(@Valid @ModelAttribute ExerciseRequestDto request) throws ExerciseCouldNotBeGeneratedException {
    return exerciseGeneratorService.generateExercise(request);
  }

  @PostMapping("submit/{exerciseId}")
  public List<ExerciseIncorrectAnswerDto> submitExercise(
    @PathVariable UUID exerciseId,
    @RequestBody List<String> answers
  ) throws ExerciseNotFoundOrExpiredException, ExerciseInvalidAmountOfAnswersException, JsonProcessingException {
    return exerciseSubmissionService.submitExercise(exerciseId, answers);
  }
}

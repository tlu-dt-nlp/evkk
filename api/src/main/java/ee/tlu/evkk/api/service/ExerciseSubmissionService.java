package ee.tlu.evkk.api.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import ee.evkk.dto.ExerciseIncorrectAnswerDto;
import ee.tlu.evkk.api.exception.ExerciseInvalidAmountOfAnswersException;
import ee.tlu.evkk.api.exception.ExerciseNotFoundOrExpiredException;
import ee.tlu.evkk.core.service.GeminiService;
import ee.tlu.evkk.dal.dao.ExerciseAnswerDao;
import ee.tlu.evkk.dal.dto.ExerciseAnswer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static java.util.stream.Collectors.toList;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExerciseSubmissionService {

  private final GeminiService geminiService;
  private final ExerciseAnswerDao exerciseAnswerDao;
  private final ObjectMapper objectMapper;

  public List<ExerciseIncorrectAnswerDto> submitExercise(UUID exerciseId, List<String> userAnswers) throws ExerciseNotFoundOrExpiredException, ExerciseInvalidAmountOfAnswersException, JsonProcessingException {
    ExerciseAnswer exerciseAnswer = exerciseAnswerDao.findById(exerciseId);

    if (exerciseAnswer == null) {
      throw new ExerciseNotFoundOrExpiredException();
    }

    List<String> correctAnswers = objectMapper.readValue(
      exerciseAnswer.getAnswers().getAsString(),
      new TypeReference<>() {}
    );

    List<String> filteredUserAnswers = userAnswers.stream()
      .filter(StringUtils::isNotBlank)
      .collect(toList());

    if (filteredUserAnswers.size() != correctAnswers.size()) {
      throw new ExerciseInvalidAmountOfAnswersException();
    }

    List<ExerciseIncorrectAnswerDto> mistakes = validateAnswers(correctAnswers, filteredUserAnswers);
    generateMistakeExplanations(userAnswers, exerciseAnswer, mistakes);

    return mistakes;
  }

  private void generateMistakeExplanations(List<String> userAnswers, ExerciseAnswer exerciseAnswer, List<ExerciseIncorrectAnswerDto> mistakes) {
    if (mistakes.isEmpty()) {
      return;
    }

    List<String> explanations = geminiService.generateIncorrectAnswerExplanations(userAnswers, exerciseAnswer, mistakes);
    if (explanations == null) {
      log.warn("LLM did not return explanations!");
      return;
    }

    if (mistakes.size() != explanations.size()) {
      log.warn("LLM returned {} explanations, although there were {} mistakes!", explanations.size(), mistakes.size());
      return;
    }

    for (int i = 0; i < mistakes.size(); i++) {
      mistakes.get(i).setExplanation(explanations.get(i));
    }
  }

  private static List<ExerciseIncorrectAnswerDto> validateAnswers(List<String> correctAnswers, List<String> userAnswers) {
    List<ExerciseIncorrectAnswerDto> mistakes = new ArrayList<>();
    for (int i = 0; i < correctAnswers.size(); i++) {
      String correctAnswer = correctAnswers.get(i);
      String userAnswer = userAnswers.get(i);

      if (!correctAnswer.equalsIgnoreCase(userAnswer)) {
        mistakes.add(new ExerciseIncorrectAnswerDto(i, userAnswer, correctAnswer));
      }
    }
    return mistakes;
  }
}

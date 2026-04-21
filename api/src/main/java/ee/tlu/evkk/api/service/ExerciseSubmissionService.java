package ee.tlu.evkk.api.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import ee.evkk.dto.ExerciseIncorrectAnswerDto;
import ee.evkk.dto.ExerciseSubmissionDto;
import ee.tlu.evkk.api.exception.ExerciseInvalidAmountOfAnswersException;
import ee.tlu.evkk.api.exception.ExerciseNotFoundOrExpiredException;
import ee.tlu.evkk.dal.dao.ExerciseAnswerDao;
import ee.tlu.evkk.dal.dto.ExerciseAnswer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseSubmissionService {

  private final ExerciseAnswerDao exerciseAnswerDao;
  private final ObjectMapper objectMapper;

  public List<ExerciseIncorrectAnswerDto> submitExercise(ExerciseSubmissionDto submission) throws ExerciseNotFoundOrExpiredException, ExerciseInvalidAmountOfAnswersException, JsonProcessingException {
    ExerciseAnswer exerciseAnswer = exerciseAnswerDao.findById(submission.getExerciseId());

    if (exerciseAnswer == null) {
      throw new ExerciseNotFoundOrExpiredException();
    }

    List<String> correctAnswers = objectMapper.readValue(
      exerciseAnswer.getAnswers().getAsString(),
      new TypeReference<>() {}
    );

    if (submission.getAnswers().size() != correctAnswers.size()) {
      throw new ExerciseInvalidAmountOfAnswersException();
    }

    List<ExerciseIncorrectAnswerDto> mistakes = new ArrayList<>();
    validateAnswers(correctAnswers, submission.getAnswers(), mistakes);

    return mistakes;
  }

  private static void validateAnswers(List<String> correctAnswers, List<String> userAnswers, List<ExerciseIncorrectAnswerDto> mistakes) {
    for (int i = 0; i < correctAnswers.size(); i++) {
      String correctAnswer = correctAnswers.get(i);
      String userAnswer = userAnswers.get(i);

      if (!correctAnswer.equalsIgnoreCase(userAnswer)) {
        mistakes.add(new ExerciseIncorrectAnswerDto(i, userAnswer, correctAnswer, null));
      }
    }
  }
}

package ee.tlu.evkk.core.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.HttpOptions;
import com.google.genai.types.HttpRetryOptions;
import com.google.genai.types.Part;
import com.google.genai.types.ThinkingConfig;
import com.google.genai.types.ThinkingLevel;
import ee.evkk.dto.ExerciseDto;
import ee.evkk.dto.ExerciseIncorrectAnswerDto;
import ee.evkk.dto.ExerciseRequestDto;
import ee.tlu.evkk.dal.dto.ExerciseAnswer;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

import static ee.evkk.dto.enums.ExerciseFormat.FILL_IN_THE_BLANKS;
import static ee.evkk.dto.enums.ExerciseStructureType.TEXT;
import static ee.evkk.dto.enums.ExerciseType.INFINITIVE;
import static ee.tlu.evkk.core.service.constants.GeminiConstants.EXERCISE_FORMAT_FILL_IN_THE_BLANKS_PROMPT_PART;
import static ee.tlu.evkk.core.service.constants.GeminiConstants.EXERCISE_FORMAT_MATCHING_PROMPT_PART;
import static ee.tlu.evkk.core.service.constants.GeminiConstants.EXERCISE_INCORRECT_ANSWER_EXPLANATIONS_PROMPT_BASE;
import static ee.tlu.evkk.core.service.constants.GeminiConstants.EXERCISE_QUALITY_CHECK_PROMPT_BASE;
import static ee.tlu.evkk.core.service.constants.GeminiConstants.EXERCISE_STRUCTURE_TYPE_SENTENCE_PROMPT_PART;
import static ee.tlu.evkk.core.service.constants.GeminiConstants.EXERCISE_STRUCTURE_TYPE_TEXT_PROMPT_PART;
import static ee.tlu.evkk.core.service.constants.GeminiConstants.EXERCISE_TYPE_INFINITIVE_PROMPT_PART;
import static ee.tlu.evkk.core.service.constants.GeminiConstants.EXERCISE_TYPE_OBJECT_PROMPT_PART;
import static ee.tlu.evkk.core.service.constants.GeminiConstants.MODEL_NAME;
import static ee.tlu.evkk.core.service.constants.GeminiConstants.RETRY_ATTEMPTS;
import static ee.tlu.evkk.core.service.constants.GeminiConstants.RETRY_HTTP_STATUS_CODES;
import static ee.tlu.evkk.core.service.constants.GeminiConstants.SYSTEM_INSTRUCTION;
import static ee.tlu.evkk.core.service.constants.GeminiConstants.THINKING_LEVEL;
import static java.lang.Boolean.parseBoolean;
import static java.lang.String.format;
import static java.util.Arrays.asList;

@Slf4j
@Service
public class GeminiService {

  private final ObjectMapper objectMapper = new ObjectMapper();
  private final Client client = Client.builder()
    .httpOptions(HttpOptions.builder()
      .retryOptions(HttpRetryOptions.builder()
        .attempts(RETRY_ATTEMPTS)
        .httpStatusCodes(RETRY_HTTP_STATUS_CODES)
        .build())
      .build())
    .build();

  private final GenerateContentConfig config = GenerateContentConfig.builder()
    .systemInstruction(Content.fromParts(Part.fromText(SYSTEM_INSTRUCTION)))
    .thinkingConfig(ThinkingConfig.builder()
      .thinkingLevel(new ThinkingLevel(THINKING_LEVEL))
      .build())
    .build();

  public boolean checkExerciseQuality(List<String> answers, ExerciseRequestDto request, ExerciseDto exercise) {
    try {
      String response = client.models.generateContent(
        MODEL_NAME,
        buildExerciseQualityPrompt(answers, request, exercise),
        config
      ).text();

      if (response == null) {
        return true;
      }

      boolean qualityPassed = parseBoolean(response.split(";")[0]);

      if (!qualityPassed) {
        log.warn("Exercise quality not passed!");
        log.warn("Reason: {}", response.split(";")[1]);
        log.warn("Exercise: {}", objectMapper.writeValueAsString(exercise));
      }
      return qualityPassed;
    } catch (Exception ex) {
      log.error("Unable to perform exercise quality check", ex);
      return true;
    }
  }

  public List<String> generateIncorrectAnswerExplanations(List<String> userAnswers, ExerciseAnswer exerciseAnswer, List<ExerciseIncorrectAnswerDto> mistakes) {
    try {
      String response = client.models.generateContent(
        MODEL_NAME,
        buildIncorrectAnswerExplanationPrompt(userAnswers, exerciseAnswer, mistakes),
        config
      ).text();

      return response == null ? List.of() : asList(response.split(";"));
    } catch (Exception ex) {
      log.error("Unable to generate incorrect answer explanations", ex);
      return List.of();
    }
  }

  @SneakyThrows
  private String buildExerciseQualityPrompt(List<String> answers, ExerciseRequestDto request, ExerciseDto exercise) {
    return format(
      EXERCISE_QUALITY_CHECK_PROMPT_BASE,
      TEXT.equals(request.getStructureType()) ? EXERCISE_STRUCTURE_TYPE_TEXT_PROMPT_PART : EXERCISE_STRUCTURE_TYPE_SENTENCE_PROMPT_PART,
      FILL_IN_THE_BLANKS.equals(request.getFormat()) ? EXERCISE_FORMAT_FILL_IN_THE_BLANKS_PROMPT_PART : EXERCISE_FORMAT_MATCHING_PROMPT_PART,
      INFINITIVE.equals(request.getType()) ? EXERCISE_TYPE_INFINITIVE_PROMPT_PART : EXERCISE_TYPE_OBJECT_PROMPT_PART,
      objectMapper.writeValueAsString(answers),
      objectMapper.writeValueAsString(exercise)
    );
  }

  @SneakyThrows
  private String buildIncorrectAnswerExplanationPrompt(List<String> userAnswers, ExerciseAnswer exerciseAnswer, List<ExerciseIncorrectAnswerDto> mistakes) {
    return format(
      EXERCISE_INCORRECT_ANSWER_EXPLANATIONS_PROMPT_BASE,
      TEXT.equals(exerciseAnswer.getStructureType()) ? EXERCISE_STRUCTURE_TYPE_TEXT_PROMPT_PART : EXERCISE_STRUCTURE_TYPE_SENTENCE_PROMPT_PART,
      FILL_IN_THE_BLANKS.equals(exerciseAnswer.getFormat()) ? EXERCISE_FORMAT_FILL_IN_THE_BLANKS_PROMPT_PART : EXERCISE_FORMAT_MATCHING_PROMPT_PART,
      INFINITIVE.equals(exerciseAnswer.getType()) ? EXERCISE_TYPE_INFINITIVE_PROMPT_PART : EXERCISE_TYPE_OBJECT_PROMPT_PART,
      objectMapper.writeValueAsString(exerciseAnswer.getAnswers()),
      objectMapper.writeValueAsString(mistakes),
      objectMapper.writeValueAsString(userAnswers),
      objectMapper.writeValueAsString(exerciseAnswer.getExerciseData())
    );
  }
}

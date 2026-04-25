package ee.tlu.evkk.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import ee.evkk.dto.ExerciseDto;
import ee.evkk.dto.ExerciseDto.Blank;
import ee.evkk.dto.ExerciseDto.SentenceWithBlanks;
import ee.evkk.dto.ExerciseGeneratorAnalysisDto;
import ee.evkk.dto.ExerciseGeneratorAnalysisDto.Sentence;
import ee.evkk.dto.ExerciseGeneratorAnalysisDto.Word;
import ee.evkk.dto.ExerciseRequestDto;
import ee.evkk.dto.enums.ExerciseType;
import ee.evkk.dto.enums.TargetWordCriteria;
import ee.tlu.evkk.api.exception.ExerciseCouldNotBeGeneratedException;
import ee.tlu.evkk.api.exception.ExerciseDidNotPassQualityGateException;
import ee.tlu.evkk.core.service.GeminiService;
import ee.tlu.evkk.dal.dao.ExerciseAnswerDao;
import ee.tlu.evkk.dal.dao.ExerciseGeneratorSourceDao;
import ee.tlu.evkk.dal.dto.ExerciseGeneratorSource;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static ee.evkk.dto.enums.ExerciseFormat.FILL_IN_THE_BLANKS;
import static ee.evkk.dto.enums.ExerciseStructureType.SENTENCE;
import static ee.evkk.dto.enums.ExerciseStructureType.TEXT;
import static ee.evkk.dto.enums.ExerciseType.INFINITIVE;
import static ee.evkk.dto.enums.TargetWordCriteria.C1_OR_B2;
import static ee.evkk.dto.enums.TargetWordCriteria.NONE;
import static ee.tlu.evkk.api.util.ExerciseGeneratorUtils.calculateFirstWordOffset;
import static ee.tlu.evkk.api.util.ExerciseGeneratorUtils.isInfinitiveTarget;
import static ee.tlu.evkk.api.util.ExerciseGeneratorUtils.isObjectTarget;
import static ee.tlu.evkk.api.util.FileUtils.readResourceAsString;
import static ee.tlu.evkk.common.util.TextUtils.sanitizeLemmaString;
import static java.util.Arrays.asList;
import static java.util.Collections.shuffle;
import static java.util.Comparator.comparingInt;
import static java.util.UUID.randomUUID;
import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class ExerciseGeneratorService {

  private static final int BLANK_LENGTH = 3;
  private static final String BLANK_REPLACEMENT = "_".repeat(BLANK_LENGTH);

  private final GeminiService geminiService;
  private final ExerciseGeneratorSourceDao exerciseGeneratorSourceDao;
  private final ExerciseAnswerDao exerciseAnswerDao;
  private final ObjectMapper objectMapper;

  public ExerciseDto generateExercise(ExerciseRequestDto request) throws ExerciseCouldNotBeGeneratedException, ExerciseDidNotPassQualityGateException {
    List<String> criteriaWords = loadCriteriaWords(request.getType(), request.getTargetWordCriteria());
    boolean isFillInTheBlanks = FILL_IN_THE_BLANKS.equals(request.getFormat());
    GenerationContext generationContext = new GenerationContext(criteriaWords, isFillInTheBlanks);

    ExerciseDto exercise = TEXT.equals(request.getStructureType())
      ? generateFromTexts(request, generationContext)
      : generateFromSentences(request, generationContext);

    if (exercise == null) {
      throw new ExerciseCouldNotBeGeneratedException();
    }

    if (!generationContext.isFillInTheBlanks() && exercise.getBlanks() != null) {
      shuffle(exercise.getBlanks());
    }

    if (request.isPerformQualityCheck() && !geminiService.checkExerciseQuality(generationContext.getCorrectAnswers(), request, exercise)) {
      throw new ExerciseDidNotPassQualityGateException();
    }

    exercise.setExerciseId(randomUUID());
    storeAnswers(generationContext.getCorrectAnswers(), request, exercise);
    return exercise;
  }

  private ExerciseDto generateFromTexts(ExerciseRequestDto request, GenerationContext generationContext) {
    ExerciseGeneratorSource targetSource = findTextTargetSource(request, generationContext.getCriteriaWords());
    if (targetSource == null) {
      return null;
    }

    StringBuilder modifiedContent = new StringBuilder(targetSource.getContent());
    List<Blank> textBlankIndexes = new ArrayList<>();
    List<Blank> blanks = new ArrayList<>();

    collectTextBlanks(request, generationContext, targetSource, textBlankIndexes, blanks, modifiedContent);

    if (generationContext.isFillInTheBlanks()) {
      return new ExerciseDto(modifiedContent.toString(), blanks);
    }

    return new ExerciseDto(modifiedContent.toString(), textBlankIndexes, blanks);
  }

  private ExerciseGeneratorSource findTextTargetSource(ExerciseRequestDto request, List<String> criteriaWords) {
    List<ExerciseGeneratorSource> sources = exerciseGeneratorSourceDao.findSourcesForExercise(TEXT, request.getType(), request.getTopic());
    return sources.stream()
      .filter(source -> {
        ExerciseGeneratorAnalysisDto textAsObject = source.getTextAsObject();
        long matchingWordCount = textAsObject.getSentences().stream()
          .flatMap(sentence -> sentence.getWords().stream())
          .filter(word -> isTargetWord(word, request, criteriaWords))
          .map(Word::getWord)
          .distinct()
          .count();

        return textAsObject.getMetadata().getTotalSentences() <= request.getSentenceCount()
          && matchingWordCount >= 5;
      })
      .findFirst()
      .orElse(null);
  }

  private ExerciseDto generateFromSentences(ExerciseRequestDto request, GenerationContext generationContext) {
    List<ExerciseGeneratorSource> targetSources = findSentenceTargetSources(request, generationContext.getCriteriaWords());
    if (targetSources.isEmpty()) {
      return null;
    }

    List<SentenceWithBlanks> sentencesWithBlanks = new ArrayList<>();
    List<Blank> globalBlanks = generationContext.isFillInTheBlanks() ? null : new ArrayList<>();

    collectSentenceBlanks(request, generationContext, targetSources, sentencesWithBlanks, globalBlanks);
    return buildSentenceExerciseResult(sentencesWithBlanks, globalBlanks, generationContext.isFillInTheBlanks());
  }

  private List<ExerciseGeneratorSource> findSentenceTargetSources(ExerciseRequestDto request, List<String> criteriaWords) {
    List<ExerciseGeneratorSource> sources = exerciseGeneratorSourceDao.findSourcesForExercise(SENTENCE, request.getType(), request.getTopic());
    return sources.stream()
      .filter(source -> source.getSentenceAsObject().getWords().stream()
        .anyMatch(word -> isTargetWord(word, request, criteriaWords))
      )
      .collect(toList());
  }

  @SneakyThrows
  private void storeAnswers(List<String> answers, ExerciseRequestDto request, ExerciseDto exercise) {
    exerciseAnswerDao.insert(
      exercise.getExerciseId(),
      request.getType(),
      request.getStructureType(),
      request.getFormat(),
      objectMapper.writeValueAsString(answers),
      objectMapper.writeValueAsString(exercise)
    );
  }

  private static List<String> loadCriteriaWords(ExerciseType type, TargetWordCriteria targetWordCriteria) {
    if (NONE.equals(targetWordCriteria)) {
      return new ArrayList<>();
    }

    boolean isInfinitive = INFINITIVE.equals(type);
    List<String> words = new ArrayList<>(asList(readResourceAsString(
      isInfinitive ? "c1_verbs.txt" : "c1_nouns.txt"
    ).split(",")));

    if (C1_OR_B2.equals(targetWordCriteria)) {
      words.addAll(asList(readResourceAsString(
        isInfinitive ? "b2_verbs.txt" : "b2_nouns.txt"
      ).split(",")));
    }

    return words;
  }

  private static void collectTextBlanks(ExerciseRequestDto request, GenerationContext generationContext, ExerciseGeneratorSource targetSource, List<Blank> textBlankIndexes, List<Blank> blanks, StringBuilder modifiedContent) {
    int lengthDelta = 0;

    for (Sentence sentence : targetSource.getTextAsObject().getSentences()) {
      List<Word> targetWords = filterTargetWords(sentence.getWords(), request, generationContext.getCriteriaWords());

      for (Word targetWord : targetWords) {
        ProcessedTargetWord processedTargetWord = processTargetWord(targetWord, modifiedContent, generationContext, 0, 0, lengthDelta);
        if (processedTargetWord != null) {
          Blank blank = processedTargetWord.getBlank();
          lengthDelta += processedTargetWord.getLengthDeltaChange();

          if (generationContext.isFillInTheBlanks()) {
            blanks.add(blank);
          } else {
            textBlankIndexes.add(createIndexOnlyBlank(blank));
            blanks.add(createHintOnlyBlank(blank));
          }
        }
      }
    }
  }

  private static void collectSentenceBlanks(ExerciseRequestDto request, GenerationContext generationContext, List<ExerciseGeneratorSource> targetSources, List<SentenceWithBlanks> sentencesWithBlanks, List<Blank> globalBlanks) {
    for (ExerciseGeneratorSource source : targetSources) {
      if (sentencesWithBlanks.size() >= request.getSentenceCount()) {
        break;
      }

      SentenceWithBlanks processedSentence = processSingleSentence(request, generationContext, source, globalBlanks);
      if (processedSentence != null) {
        sentencesWithBlanks.add(processedSentence);
      }
    }
  }

  private static ExerciseDto buildSentenceExerciseResult(List<SentenceWithBlanks> sentencesWithBlanks, List<Blank> globalBlanks, boolean isFillInTheBlanks) {
    if (sentencesWithBlanks.isEmpty()) {
      return null;
    }

    if (!isFillInTheBlanks) {
      return new ExerciseDto(sentencesWithBlanks, globalBlanks);
    }

    return new ExerciseDto(sentencesWithBlanks);
  }

  private static boolean isTargetWord(Word word, ExerciseRequestDto request, List<String> criteriaWords) {
    TargetWordCriteria targetWordCriteria = request.getTargetWordCriteria();

    return INFINITIVE.equals(request.getType())
      ? isInfinitiveTarget(word, criteriaWords, targetWordCriteria)
      : isObjectTarget(word, criteriaWords, targetWordCriteria);
  }

  private static List<Word> filterTargetWords(List<Word> words, ExerciseRequestDto request, List<String> criteriaWords) {
    return words.stream()
      .filter(word -> isTargetWord(word, request, criteriaWords))
      .sorted(comparingInt(Word::getStartChar))
      .collect(toList());
  }

  private static String getHint(Word word, boolean isFillInTheBlanks) {
    return isFillInTheBlanks ? sanitizeLemmaString(word.getLemma()) : word.getWord();
  }

  private static Blank createIndexOnlyBlank(Blank blank) {
    return new Blank(blank.getStartChar(), blank.getEndChar(), null);
  }

  private static Blank createHintOnlyBlank(Blank blank) {
    return new Blank(null, null, blank.getHint());
  }

  private static SentenceWithBlanks processSingleSentence(ExerciseRequestDto request, GenerationContext generationContext, ExerciseGeneratorSource source, List<Blank> globalBlanks) {
    Sentence sentence = source.getSentenceAsObject();
    List<Word> targetWords = filterTargetWords(sentence.getWords(), request, generationContext.getCriteriaWords());

    if (targetWords.isEmpty()) {
      return null;
    }

    String sentenceText = sentence.getText();
    StringBuilder modifiedSentence = new StringBuilder(sentenceText);
    List<Blank> sentenceBlanks = new ArrayList<>();

    int sentenceOffset = sentence.getWords().isEmpty() ? 0 : sentence.getWords().get(0).getStartChar();
    int firstWordOffset = calculateFirstWordOffset(sentence, sentenceText);

    return processTargetWords(targetWords, modifiedSentence, generationContext, sentenceOffset, firstWordOffset, sentenceBlanks, globalBlanks);
  }

  private static SentenceWithBlanks processTargetWords(List<Word> targetWords, StringBuilder modifiedSentence, GenerationContext generationContext, int sentenceOffset, int firstWordOffset, List<Blank> sentenceBlanks, List<Blank> globalBlanks) {
    boolean hasBlanks = false;
    int lengthDelta = 0;

    for (Word targetWord : targetWords) {
      ProcessedTargetWord processedTargetWord = processTargetWord(targetWord, modifiedSentence, generationContext, sentenceOffset, firstWordOffset, lengthDelta);
      if (processedTargetWord == null) {
        continue;
      }

      Blank blank = processedTargetWord.getBlank();
      lengthDelta += processedTargetWord.getLengthDeltaChange();

      if (generationContext.isFillInTheBlanks()) {
        sentenceBlanks.add(blank);
      } else {
        sentenceBlanks.add(createIndexOnlyBlank(blank));
        globalBlanks.add(createHintOnlyBlank(blank));
      }
      hasBlanks = true;
    }

    return hasBlanks ? new SentenceWithBlanks(modifiedSentence.toString(), sentenceBlanks) : null;
  }

  private static ProcessedTargetWord processTargetWord(Word targetWord, StringBuilder text, GenerationContext generationContext, int sentenceOffset, int firstWordOffset, int lengthDelta) {
    String hint = getHint(targetWord, generationContext.isFillInTheBlanks());

    if (generationContext.getUsedHints().contains(hint)) {
      return null;
    }

    generationContext.getUsedHints().add(hint);
    generationContext.getCorrectAnswers().add(targetWord.getWord());

    int startChar = targetWord.getStartChar() - sentenceOffset + firstWordOffset + lengthDelta;
    int wordEndChar = targetWord.getEndChar() - sentenceOffset + firstWordOffset + lengthDelta;
    int blankEndChar = startChar + BLANK_LENGTH;

    int replacedWordLength = targetWord.getEndChar() - targetWord.getStartChar();
    int lengthDeltaChange = BLANK_LENGTH - replacedWordLength;

    text.replace(startChar, wordEndChar, BLANK_REPLACEMENT);
    return new ProcessedTargetWord(new Blank(startChar, blankEndChar, hint), lengthDeltaChange);
  }

  @Data
  private static class ProcessedTargetWord {

    private final Blank blank;
    private final int lengthDeltaChange;
  }

  @Data
  private static class GenerationContext {

    private List<String> criteriaWords;
    private boolean isFillInTheBlanks;
    private Set<String> usedHints = new HashSet<>();
    private List<String> correctAnswers = new ArrayList<>();

    private GenerationContext(List<String> criteriaWords, boolean isFillInTheBlanks) {
      this.criteriaWords = criteriaWords;
      this.isFillInTheBlanks = isFillInTheBlanks;
    }
  }
}

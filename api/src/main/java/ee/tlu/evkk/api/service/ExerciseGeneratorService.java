package ee.tlu.evkk.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import ee.evkk.dto.ExerciseDto;
import ee.evkk.dto.ExerciseDto.Blank;
import ee.evkk.dto.ExerciseDto.SentenceWithBlanks;
import ee.evkk.dto.ExerciseGeneratorAnalysisDto.Sentence;
import ee.evkk.dto.ExerciseGeneratorAnalysisDto.Word;
import ee.evkk.dto.ExerciseRequestDto;
import ee.evkk.dto.enums.ExerciseType;
import ee.evkk.dto.enums.TargetWordCriteria;
import ee.tlu.evkk.api.exception.ExerciseCouldNotBeGeneratedException;
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
import java.util.UUID;

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
import static java.util.UUID.randomUUID;
import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class ExerciseGeneratorService {

  private final ExerciseGeneratorSourceDao exerciseGeneratorSourceDao;
  private final ExerciseAnswerDao exerciseAnswerDao;
  private final ObjectMapper objectMapper;

  public ExerciseDto generateExercise(ExerciseRequestDto request) throws ExerciseCouldNotBeGeneratedException {
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

    exercise.setExerciseId(randomUUID());
    storeAnswers(exercise.getExerciseId(), generationContext.getCorrectAnswers(), exercise);
    return exercise;
  }

  private ExerciseDto generateFromTexts(ExerciseRequestDto request, GenerationContext generationContext) {
    ExerciseGeneratorSource targetSource = findTextTargetSource(request, generationContext.getCriteriaWords());
    if (targetSource == null) {
      return null;
    }

    StringBuilder modifiedContent = new StringBuilder(targetSource.getContent());
    List<Blank> blanks = new ArrayList<>();

    collectTextBlanks(request, generationContext, targetSource, blanks, modifiedContent);
    return new ExerciseDto(modifiedContent.toString(), blanks);
  }

  private ExerciseGeneratorSource findTextTargetSource(ExerciseRequestDto request, List<String> criteriaWords) {
    List<ExerciseGeneratorSource> sources = exerciseGeneratorSourceDao.findSourcesForExercise(TEXT, request.getType(), request.getTopic());
    return sources.stream()
      .filter(source -> {
        long matchingWordCount = source.getTextAsObject().getSentences().stream()
          .flatMap(sentence -> sentence.getWords().stream())
          .filter(word -> isTargetWord(word, request, criteriaWords))
          .map(Word::getWord)
          .distinct()
          .count();
        return matchingWordCount >= 5;
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
  private void storeAnswers(UUID exerciseId, List<String> answers, ExerciseDto exercise) {
    String answersJson = objectMapper.writeValueAsString(answers);
    String exerciseDataJson = objectMapper.writeValueAsString(exercise);

    exerciseAnswerDao.insert(exerciseId, answersJson, exerciseDataJson);
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

  private static void collectTextBlanks(ExerciseRequestDto request, GenerationContext generationContext, ExerciseGeneratorSource targetSource, List<Blank> blanks, StringBuilder modifiedContent) {
    for (Sentence sentence : targetSource.getTextAsObject().getSentences()) {
      List<Word> targetWords = filterTargetWords(sentence.getWords(), request, generationContext.getCriteriaWords());

      for (Word targetWord : targetWords) {
        Blank blank = processTargetWord(targetWord, modifiedContent, generationContext, 0, 0);
        if (blank != null) {
          blanks.add(blank);
        }
      }
    }
  }

  private static void collectSentenceBlanks(ExerciseRequestDto request, GenerationContext generationContext, List<ExerciseGeneratorSource> targetSources, List<SentenceWithBlanks> sentencesWithBlanks, List<Blank> globalBlanks) {
    for (ExerciseGeneratorSource source : targetSources) {
      if (sentencesWithBlanks.size() >= 5) {
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
      .collect(toList());
  }

  private static String getHint(Word word, boolean isFillInTheBlanks) {
    return isFillInTheBlanks ? sanitizeLemmaString(word.getLemma()) : word.getWord();
  }

  private static Blank createBlank(int startChar, int endChar, String hint, boolean isFillInTheBlanks) {
    return new Blank(
      isFillInTheBlanks ? startChar : null,
      isFillInTheBlanks ? endChar : null,
      hint
    );
  }

  private static SentenceWithBlanks processSingleSentence(ExerciseRequestDto request, GenerationContext generationContext, ExerciseGeneratorSource source, List<Blank> globalBlanks) {
    Sentence sentence = source.getSentenceAsObject();
    List<Word> targetWords = filterTargetWords(sentence.getWords(), request, generationContext.getCriteriaWords());

    if (targetWords.isEmpty()) {
      return null;
    }

    String sentenceText = sentence.getText();
    StringBuilder modifiedSentence = new StringBuilder(sentenceText);
    List<Blank> sentenceBlanks = generationContext.isFillInTheBlanks() ? new ArrayList<>() : null;

    int sentenceOffset = sentence.getWords().isEmpty() ? 0 : sentence.getWords().get(0).getStartChar();
    int firstWordOffset = calculateFirstWordOffset(sentence, sentenceText);

    return processTargetWords(targetWords, modifiedSentence, generationContext, sentenceOffset, firstWordOffset, sentenceBlanks, globalBlanks);
  }

  private static SentenceWithBlanks processTargetWords(List<Word> targetWords, StringBuilder modifiedSentence, GenerationContext generationContext, int sentenceOffset, int firstWordOffset, List<Blank> sentenceBlanks, List<Blank> globalBlanks) {
    boolean hasBlanks = false;

    for (Word targetWord : targetWords) {
      Blank blank = processTargetWord(targetWord, modifiedSentence, generationContext, sentenceOffset, firstWordOffset);
      if (blank == null) {
        continue;
      }

      if (generationContext.isFillInTheBlanks()) {
        sentenceBlanks.add(blank);
      } else {
        globalBlanks.add(blank);
      }
      hasBlanks = true;
    }

    return hasBlanks ? new SentenceWithBlanks(modifiedSentence.toString(), sentenceBlanks) : null;
  }

  private static Blank processTargetWord(Word targetWord, StringBuilder text, GenerationContext generationContext, int sentenceOffset, int firstWordOffset) {
    String hint = getHint(targetWord, generationContext.isFillInTheBlanks());

    if (generationContext.getUsedHints().contains(hint)) {
      return null;
    }

    generationContext.getUsedHints().add(hint);
    generationContext.getCorrectAnswers().add(targetWord.getWord());

    int wordLength = targetWord.getEndChar() - targetWord.getStartChar();
    String blanksReplacement = "_".repeat(wordLength);

    int startChar = targetWord.getStartChar() - sentenceOffset + firstWordOffset;
    int endChar = targetWord.getEndChar() - sentenceOffset + firstWordOffset;

    text.replace(startChar, endChar, blanksReplacement);
    return createBlank(startChar, endChar, hint, generationContext.isFillInTheBlanks());
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

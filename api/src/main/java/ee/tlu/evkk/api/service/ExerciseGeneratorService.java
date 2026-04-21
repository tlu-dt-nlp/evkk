package ee.tlu.evkk.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import ee.evkk.dto.ExerciseDto;
import ee.evkk.dto.ExerciseDto.Blank;
import ee.evkk.dto.ExerciseDto.SentenceWithBlanks;
import ee.evkk.dto.ExerciseGeneratorAnalysisDto.Sentence;
import ee.evkk.dto.ExerciseGeneratorAnalysisDto.Word;
import ee.evkk.dto.enums.ExerciseFormat;
import ee.evkk.dto.enums.ExerciseStructureType;
import ee.evkk.dto.enums.ExerciseType;
import ee.evkk.dto.enums.TargetWordCriteria;
import ee.tlu.evkk.api.exception.ExerciseCouldNotBeGeneratedException;
import ee.tlu.evkk.dal.dao.ExerciseAnswerDao;
import ee.tlu.evkk.dal.dao.ExerciseGeneratorSourceDao;
import ee.tlu.evkk.dal.dto.ExerciseGeneratorSource;
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

  public ExerciseDto generateExercise(ExerciseType type, ExerciseStructureType structureType, ExerciseFormat format, TargetWordCriteria targetWordCriteria, String topic) throws ExerciseCouldNotBeGeneratedException {
    List<String> criteriaWords = loadCriteriaWords(type, targetWordCriteria);
    boolean isFillInTheBlanks = FILL_IN_THE_BLANKS.equals(format);
    List<String> correctAnswers = new ArrayList<>();

    ExerciseDto exercise = TEXT.equals(structureType)
      ? generateFromTexts(type, topic, criteriaWords, targetWordCriteria, isFillInTheBlanks, correctAnswers)
      : generateFromSentences(type, topic, criteriaWords, targetWordCriteria, isFillInTheBlanks, correctAnswers);

    if (exercise == null) {
      throw new ExerciseCouldNotBeGeneratedException();
    }

    if (!isFillInTheBlanks && exercise.getBlanks() != null) {
      shuffle(exercise.getBlanks());
    }

    exercise.setExerciseId(randomUUID());
    storeAnswers(exercise.getExerciseId(), correctAnswers, exercise);
    return exercise;
  }

  private ExerciseDto generateFromTexts(ExerciseType type, String topic, List<String> criteriaWords, TargetWordCriteria targetWordCriteria, boolean isFillInTheBlanks, List<String> correctAnswers) {
    ExerciseGeneratorSource targetSource = findTextTargetSource(type, topic, criteriaWords, targetWordCriteria);
    if (targetSource == null) {
      return null;
    }

    StringBuilder modifiedContent = new StringBuilder(targetSource.getContent());
    List<Blank> blanks = new ArrayList<>();
    Set<String> usedHints = new HashSet<>();

    collectTextBlanks(targetSource, blanks, type, criteriaWords, targetWordCriteria, isFillInTheBlanks, modifiedContent, usedHints, correctAnswers);
    return new ExerciseDto(modifiedContent.toString(), blanks);
  }

  private ExerciseGeneratorSource findTextTargetSource(ExerciseType type, String topic, List<String> criteriaWords, TargetWordCriteria targetWordCriteria) {
    List<ExerciseGeneratorSource> sources = exerciseGeneratorSourceDao.findSourcesForExercise(TEXT, type, topic);
    return sources.stream()
      .filter(source -> {
        long matchingWordCount = source.getTextAsObject().getSentences().stream()
          .flatMap(sentence -> sentence.getWords().stream())
          .filter(word -> isTargetWord(word, type, criteriaWords, targetWordCriteria))
          .map(Word::getWord)
          .distinct()
          .count();
        return matchingWordCount >= 5;
      })
      .findFirst()
      .orElse(null);
  }

  private ExerciseDto generateFromSentences(ExerciseType type, String topic, List<String> criteriaWords, TargetWordCriteria targetWordCriteria, boolean isFillInTheBlanks, List<String> correctAnswers) {
    List<ExerciseGeneratorSource> targetSources = findSentenceTargetSources(type, topic, criteriaWords, targetWordCriteria);
    if (targetSources.isEmpty()) {
      return null;
    }

    List<SentenceWithBlanks> sentencesWithBlanks = new ArrayList<>();
    List<Blank> globalBlanks = isFillInTheBlanks ? null : new ArrayList<>();
    Set<String> usedHints = new HashSet<>();

    collectSentenceBlanks(targetSources, sentencesWithBlanks, type, criteriaWords, targetWordCriteria, isFillInTheBlanks, usedHints, globalBlanks, correctAnswers);
    return buildSentenceExerciseResult(sentencesWithBlanks, globalBlanks, isFillInTheBlanks);
  }

  private List<ExerciseGeneratorSource> findSentenceTargetSources(ExerciseType type, String topic, List<String> criteriaWords, TargetWordCriteria targetWordCriteria) {
    List<ExerciseGeneratorSource> sources = exerciseGeneratorSourceDao.findSourcesForExercise(SENTENCE, type, topic);
    return sources.stream()
      .filter(source -> source.getSentenceAsObject().getWords().stream()
        .anyMatch(word -> isTargetWord(word, type, criteriaWords, targetWordCriteria))
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

  private static void collectTextBlanks(ExerciseGeneratorSource targetSource, List<Blank> blanks, ExerciseType type, List<String> criteriaWords, TargetWordCriteria targetWordCriteria, boolean isFillInTheBlanks, StringBuilder modifiedContent, Set<String> usedHints, List<String> correctAnswers) {
    for (Sentence sentence : targetSource.getTextAsObject().getSentences()) {
      List<Word> targetWords = filterTargetWords(sentence.getWords(), type, criteriaWords, targetWordCriteria);

      for (Word targetWord : targetWords) {
        Blank blank = processTargetWord(targetWord, modifiedContent, usedHints, isFillInTheBlanks, 0, 0, correctAnswers);
        if (blank != null) {
          blanks.add(blank);
        }
      }
    }
  }

  private static void collectSentenceBlanks(List<ExerciseGeneratorSource> targetSources, List<SentenceWithBlanks> sentencesWithBlanks, ExerciseType type, List<String> criteriaWords, TargetWordCriteria targetWordCriteria, boolean isFillInTheBlanks, Set<String> usedHints, List<Blank> globalBlanks, List<String> correctAnswers) {
    for (ExerciseGeneratorSource source : targetSources) {
      if (sentencesWithBlanks.size() >= 5) {
        break;
      }

      SentenceWithBlanks processedSentence = processSingleSentence(source, type, criteriaWords, targetWordCriteria, isFillInTheBlanks, usedHints, globalBlanks, correctAnswers);
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

  private static boolean isTargetWord(Word word, ExerciseType type, List<String> criteriaWords, TargetWordCriteria targetWordCriteria) {
    return INFINITIVE.equals(type)
      ? isInfinitiveTarget(word, criteriaWords, targetWordCriteria)
      : isObjectTarget(word, criteriaWords, targetWordCriteria);
  }

  private static List<Word> filterTargetWords(List<Word> words, ExerciseType type, List<String> criteriaWords, TargetWordCriteria targetWordCriteria) {
    return words.stream()
      .filter(word -> isTargetWord(word, type, criteriaWords, targetWordCriteria))
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

  private static SentenceWithBlanks processSingleSentence(ExerciseGeneratorSource source, ExerciseType type, List<String> criteriaWords, TargetWordCriteria targetWordCriteria, boolean isFillInTheBlanks, Set<String> usedHints, List<Blank> globalBlanks, List<String> correctAnswers) {
    Sentence sentence = source.getSentenceAsObject();
    List<Word> targetWords = filterTargetWords(sentence.getWords(), type, criteriaWords, targetWordCriteria);

    if (targetWords.isEmpty()) {
      return null;
    }

    String sentenceText = sentence.getText();
    StringBuilder modifiedSentence = new StringBuilder(sentenceText);
    List<Blank> sentenceBlanks = isFillInTheBlanks ? new ArrayList<>() : null;

    int sentenceOffset = sentence.getWords().isEmpty() ? 0 : sentence.getWords().get(0).getStartChar();
    int firstWordOffset = calculateFirstWordOffset(sentence, sentenceText);

    return processTargetWords(targetWords, modifiedSentence, usedHints, isFillInTheBlanks, sentenceOffset, firstWordOffset, sentenceBlanks, globalBlanks, correctAnswers);
  }

  private static SentenceWithBlanks processTargetWords(List<Word> targetWords, StringBuilder modifiedSentence, Set<String> usedHints, boolean isFillInTheBlanks, int sentenceOffset, int firstWordOffset, List<Blank> sentenceBlanks, List<Blank> globalBlanks, List<String> correctAnswers) {
    boolean hasBlanks = false;

    for (Word targetWord : targetWords) {
      Blank blank = processTargetWord(targetWord, modifiedSentence, usedHints, isFillInTheBlanks, sentenceOffset, firstWordOffset, correctAnswers);
      if (blank == null) {
        continue;
      }

      if (isFillInTheBlanks) {
        sentenceBlanks.add(blank);
      } else {
        globalBlanks.add(blank);
      }
      hasBlanks = true;
    }

    return hasBlanks ? new SentenceWithBlanks(modifiedSentence.toString(), sentenceBlanks) : null;
  }

  private static Blank processTargetWord(Word targetWord, StringBuilder text, Set<String> usedHints, boolean isFillInTheBlanks, int sentenceOffset, int firstWordOffset, List<String> correctAnswers) {
    String hint = getHint(targetWord, isFillInTheBlanks);

    if (usedHints.contains(hint)) {
      return null;
    }

    usedHints.add(hint);
    correctAnswers.add(targetWord.getWord());

    int wordLength = targetWord.getEndChar() - targetWord.getStartChar();
    String blanksReplacement = "_".repeat(wordLength);

    int startChar = targetWord.getStartChar() - sentenceOffset + firstWordOffset;
    int endChar = targetWord.getEndChar() - sentenceOffset + firstWordOffset;

    text.replace(startChar, endChar, blanksReplacement);
    return createBlank(startChar, endChar, hint, isFillInTheBlanks);
  }
}

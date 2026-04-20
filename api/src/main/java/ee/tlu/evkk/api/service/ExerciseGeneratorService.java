package ee.tlu.evkk.api.service;

import ee.evkk.dto.ExerciseDto;
import ee.evkk.dto.ExerciseDto.Blank;
import ee.evkk.dto.ExerciseDto.SentenceWithBlanks;
import ee.evkk.dto.ExerciseGeneratorAnalysisDto.Sentence;
import ee.evkk.dto.ExerciseGeneratorAnalysisDto.Word;
import ee.evkk.dto.enums.ExerciseFormat;
import ee.evkk.dto.enums.ExerciseStructureType;
import ee.evkk.dto.enums.ExerciseType;
import ee.tlu.evkk.dal.dao.ExerciseGeneratorSourceDao;
import ee.tlu.evkk.dal.dto.ExerciseGeneratorSource;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static ee.evkk.dto.enums.ExerciseFormat.FILL_IN_THE_BLANKS;
import static ee.evkk.dto.enums.ExerciseStructureType.SENTENCE;
import static ee.evkk.dto.enums.ExerciseStructureType.TEXT;
import static ee.evkk.dto.enums.ExerciseType.INFINITIVE;
import static ee.tlu.evkk.api.util.ExerciseGeneratorUtils.calculateFirstWordOffset;
import static ee.tlu.evkk.api.util.ExerciseGeneratorUtils.isInfinitiveTarget;
import static ee.tlu.evkk.api.util.ExerciseGeneratorUtils.isObjectTarget;
import static ee.tlu.evkk.api.util.FileUtils.readResourceAsString;
import static ee.tlu.evkk.common.util.TextUtils.sanitizeLemmaString;
import static java.util.Arrays.asList;
import static java.util.Collections.shuffle;
import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class ExerciseGeneratorService {

  private final ExerciseGeneratorSourceDao exerciseGeneratorSourceDao;

  public ExerciseDto generateExercise(ExerciseType type, ExerciseStructureType structureType, ExerciseFormat format, String topic, boolean setC1Criteria) {
    List<String> c1Words = new ArrayList<>(asList(readResourceAsString(
      INFINITIVE.equals(type) ? "c1_verbs.txt" : "c1_nouns.txt"
    ).split(",")));
    boolean isFillInTheBlanks = FILL_IN_THE_BLANKS.equals(format);

    return TEXT.equals(structureType)
      ? generateFromTexts(type, topic, c1Words, setC1Criteria, isFillInTheBlanks)
      : generateFromSentences(type, topic, c1Words, setC1Criteria, isFillInTheBlanks);
  }

  private ExerciseDto generateFromTexts(ExerciseType type, String topic, List<String> c1Words, boolean setC1Criteria, boolean isFillInTheBlanks) {
    List<ExerciseGeneratorSource> sources = exerciseGeneratorSourceDao.findSourcesForExercise(TEXT, type, topic);

    ExerciseGeneratorSource targetSource = sources.stream()
      .filter(source -> {
        long matchingWordCount = source.getTextAsObject().getSentences().stream()
          .flatMap(sentence -> sentence.getWords().stream())
          .filter(word -> isTargetWord(word, type, c1Words, setC1Criteria))
          .map(Word::getWord)
          .distinct()
          .count();
        return matchingWordCount >= 5;
      })
      .findFirst()
      .orElse(null);

    if (targetSource == null) {
      return null;
    }

    StringBuilder modifiedContent = new StringBuilder(targetSource.getContent());
    List<Blank> blanks = new ArrayList<>();
    Set<String> usedHints = new HashSet<>();

    for (Sentence sentence : targetSource.getTextAsObject().getSentences()) {
      List<Word> targetWords = filterTargetWords(sentence.getWords(), type, c1Words, setC1Criteria);

      for (Word targetWord : targetWords) {
        Blank blank = processTargetWord(targetWord, modifiedContent, usedHints, isFillInTheBlanks, 0, 0);
        if (blank != null) {
          blanks.add(blank);
        }
      }
    }

    if (!isFillInTheBlanks) {
      shuffle(blanks);
    }

    return new ExerciseDto(modifiedContent.toString(), blanks);
  }

  private ExerciseDto generateFromSentences(ExerciseType type, String topic, List<String> c1Words, boolean setC1Criteria, boolean isFillInTheBlanks) {
    List<ExerciseGeneratorSource> sources = exerciseGeneratorSourceDao.findSourcesForExercise(SENTENCE, type, topic);

    List<ExerciseGeneratorSource> targetSources = sources.stream()
      .filter(source -> source.getSentenceAsObject().getWords().stream()
        .anyMatch(word -> isTargetWord(word, type, c1Words, setC1Criteria))
      )
      .collect(toList());

    if (targetSources.isEmpty()) {
      return null;
    }

    List<SentenceWithBlanks> sentencesWithBlanks = new ArrayList<>();
    List<Blank> globalBlanks = isFillInTheBlanks ? null : new ArrayList<>();
    Set<String> usedHints = new HashSet<>();

    for (ExerciseGeneratorSource source : targetSources) {
      if (sentencesWithBlanks.size() >= 5) {
        break;
      }

      Sentence sentence = source.getSentenceAsObject();
      List<Word> targetWords = filterTargetWords(sentence.getWords(), type, c1Words, setC1Criteria);

      if (targetWords.isEmpty()) {
        continue;
      }

      String sentenceText = sentence.getText();
      StringBuilder modifiedSentence = new StringBuilder(sentenceText);

      List<Blank> sentenceBlanks = isFillInTheBlanks ? new ArrayList<>() : null;
      int blanksAddedForSentence = 0;

      int sentenceOffset = sentence.getWords().isEmpty() ? 0 : sentence.getWords().get(0).getStartChar();
      int firstWordInTextOffset = calculateFirstWordOffset(sentence, sentenceText);

      for (Word targetWord : targetWords) {
        Blank blank = processTargetWord(targetWord, modifiedSentence, usedHints, isFillInTheBlanks, sentenceOffset, firstWordInTextOffset);
        if (blank == null) {
          continue;
        }

        if (isFillInTheBlanks) {
          sentenceBlanks.add(blank);
        } else {
          globalBlanks.add(blank);
        }
        blanksAddedForSentence++;
      }

      if (blanksAddedForSentence > 0) {
        sentencesWithBlanks.add(new SentenceWithBlanks(modifiedSentence.toString(), sentenceBlanks));
      }
    }

    if (sentencesWithBlanks.isEmpty()) {
      return null;
    }

    if (!isFillInTheBlanks) {
      shuffle(globalBlanks);
      return new ExerciseDto(sentencesWithBlanks, globalBlanks);
    }

    return new ExerciseDto(sentencesWithBlanks);
  }

  private boolean isTargetWord(Word word, ExerciseType type, List<String> c1Words, boolean setC1Criteria) {
    return INFINITIVE.equals(type)
      ? isInfinitiveTarget(word, c1Words, setC1Criteria)
      : isObjectTarget(word, c1Words, setC1Criteria);
  }

  private List<Word> filterTargetWords(List<Word> words, ExerciseType type, List<String> c1Words, boolean setC1Criteria) {
    return words.stream()
      .filter(word -> isTargetWord(word, type, c1Words, setC1Criteria))
      .collect(toList());
  }

  private String getHint(Word word, boolean isFillInTheBlanks) {
    return isFillInTheBlanks ? sanitizeLemmaString(word.getLemma()) : word.getWord();
  }

  private Blank createBlank(int startChar, int endChar, String hint, boolean isFillInTheBlanks) {
    return new Blank(
      isFillInTheBlanks ? startChar : null,
      isFillInTheBlanks ? endChar : null,
      hint
    );
  }

  private Blank processTargetWord(Word targetWord, StringBuilder text, Set<String> usedHints, boolean isFillInTheBlanks, int sentenceOffset, int firstWordOffset) {
    String hint = getHint(targetWord, isFillInTheBlanks);

    if (usedHints.contains(hint)) {
      return null;
    }

    usedHints.add(hint);
    int wordLength = targetWord.getEndChar() - targetWord.getStartChar();
    String blanksReplacement = "_".repeat(wordLength);

    int startChar = targetWord.getStartChar() - sentenceOffset + firstWordOffset;
    int endChar = targetWord.getEndChar() - sentenceOffset + firstWordOffset;

    text.replace(startChar, endChar, blanksReplacement);
    return createBlank(startChar, endChar, hint, isFillInTheBlanks);
  }
}

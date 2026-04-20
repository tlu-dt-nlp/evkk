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

  public ExerciseDto generateExercise(ExerciseType type, ExerciseStructureType structureType, ExerciseFormat format, String topic) {
    List<String> c1Words = new ArrayList<>(asList(readResourceAsString(
      INFINITIVE.equals(type) ? "c1_verbs.txt" : "c1_nouns.txt"
    ).split(",")));

    return TEXT.equals(structureType)
      ? generateFromTexts(type, format, topic, c1Words)
      : generateFromSentences(type, format, topic, c1Words);
  }

  private ExerciseDto generateFromTexts(ExerciseType type, ExerciseFormat format, String topic, List<String> c1Words) {
    List<ExerciseGeneratorSource> sources = exerciseGeneratorSourceDao.findSourcesForExercise(TEXT, type, topic);

    ExerciseGeneratorSource targetSource = sources.stream()
      .filter(source -> {
        long matchingWordCount = source.getTextAsObject().getSentences().stream()
          .flatMap(sentence -> sentence.getWords().stream())
          .filter(word -> isTargetWord(word, type, c1Words, false))
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

    boolean isFillInTheBlanks = FILL_IN_THE_BLANKS.equals(format);
    StringBuilder modifiedContent = new StringBuilder(targetSource.getContent());
    List<Blank> blanks = new ArrayList<>();
    Set<String> usedHints = new HashSet<>();

    for (Sentence sentence : targetSource.getTextAsObject().getSentences()) {
      List<Word> targetWords = filterTargetWords(sentence.getWords(), type, c1Words, false);

      for (Word targetWord : targetWords) {
        String hint = getHint(targetWord, isFillInTheBlanks);

        if (usedHints.contains(hint)) {
          continue;
        }

        usedHints.add(hint);
        int wordLength = targetWord.getEndChar() - targetWord.getStartChar();
        String blanksReplacement = "_".repeat(wordLength);

        modifiedContent.replace(targetWord.getStartChar(), targetWord.getEndChar(), blanksReplacement);

        blanks.add(createBlank(targetWord.getStartChar(), targetWord.getEndChar(), hint, isFillInTheBlanks));
      }
    }

    if (!isFillInTheBlanks) {
      shuffle(blanks);
    }

    return new ExerciseDto(modifiedContent.toString(), blanks);
  }

  private ExerciseDto generateFromSentences(ExerciseType type, ExerciseFormat format, String topic, List<String> c1Words) {
    List<ExerciseGeneratorSource> sources = exerciseGeneratorSourceDao.findSourcesForExercise(SENTENCE, type, topic);

    List<ExerciseGeneratorSource> targetSources = sources.stream()
      .filter(source -> source.getSentenceAsObject().getWords().stream()
        .anyMatch(word -> isTargetWord(word, type, c1Words, true))
      )
      .collect(toList());

    if (targetSources.isEmpty()) {
      return null;
    }

    boolean isFillInTheBlanks = FILL_IN_THE_BLANKS.equals(format);
    List<SentenceWithBlanks> sentencesWithBlanks = new ArrayList<>();
    List<Blank> globalBlanks = isFillInTheBlanks ? null : new ArrayList<>();
    Set<String> usedHints = new HashSet<>();

    for (ExerciseGeneratorSource source : targetSources) {
      if (sentencesWithBlanks.size() >= 5) {
        break;
      }

      Sentence sentence = source.getSentenceAsObject();
      List<Word> targetWords = filterTargetWords(sentence.getWords(), type, c1Words, true);

      if (targetWords.isEmpty()) {
        continue;
      }

      int sentenceOffset = sentence.getWords().isEmpty() ? 0 : sentence.getWords().get(0).getStartChar();
      String sentenceText = sentence.getText();
      StringBuilder modifiedSentence = new StringBuilder(sentenceText);
      List<Blank> sentenceBlanks = isFillInTheBlanks ? new ArrayList<>() : null;
      int blanksAddedForSentence = 0;

      int firstWordInTextOffset = calculateFirstWordOffset(sentence, sentenceText);

      for (Word targetWord : targetWords) {
        String hint = getHint(targetWord, isFillInTheBlanks);

        if (usedHints.contains(hint)) {
          continue;
        }

        usedHints.add(hint);
        int wordLength = targetWord.getEndChar() - targetWord.getStartChar();
        String blanksReplacement = "_".repeat(wordLength);

        int relativeStart = targetWord.getStartChar() - sentenceOffset + firstWordInTextOffset;
        int relativeEnd = targetWord.getEndChar() - sentenceOffset + firstWordInTextOffset;

        modifiedSentence.replace(relativeStart, relativeEnd, blanksReplacement);

        Blank blank = createBlank(relativeStart, relativeEnd, hint, isFillInTheBlanks);

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

  private boolean isTargetWord(Word word, ExerciseType type, List<String> c1Words, boolean allowC1) {
    return INFINITIVE.equals(type)
      ? isInfinitiveTarget(word, c1Words, allowC1)
      : isObjectTarget(word, c1Words, allowC1);
  }

  private List<Word> filterTargetWords(List<Word> words, ExerciseType type, List<String> c1Words, boolean allowC1) {
    return words.stream()
      .filter(word -> isTargetWord(word, type, c1Words, allowC1))
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

  private int calculateFirstWordOffset(Sentence sentence, String sentenceText) {
    if (sentence.getWords().isEmpty()) {
      return 0;
    }
    String firstWord = sentence.getWords().get(0).getWord();
    int offset = sentenceText.indexOf(firstWord);
    return offset == -1 ? 0 : offset;
  }
}

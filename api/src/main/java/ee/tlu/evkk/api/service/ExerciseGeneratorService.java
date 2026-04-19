package ee.tlu.evkk.api.service;

import ee.evkk.dto.ExerciseDto;
import ee.evkk.dto.ExerciseDto.Blank;
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
        long matchingWordCount = source.getAnalysisAsObject().getSentences().stream()
          .flatMap(sentence -> sentence.getWords().stream())
          .filter(word -> INFINITIVE.equals(type)
            ? isInfinitiveTarget(word, c1Words, false)
            : isObjectTarget(word, c1Words, false)
          )
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

    for (Sentence sentence : targetSource.getAnalysisAsObject().getSentences()) {
      List<Word> targetWords = sentence.getWords().stream()
        .filter(word -> INFINITIVE.equals(type)
          ? isInfinitiveTarget(word, c1Words, false)
          : isObjectTarget(word, c1Words, false)
        )
        .collect(toList());

      for (Word targetWord : targetWords) {
        String hint = isFillInTheBlanks ? sanitizeLemmaString(targetWord.getLemma()) : targetWord.getWord();

        if (usedHints.contains(hint)) {
          continue;
        }

        usedHints.add(hint);
        int wordLength = targetWord.getEndChar() - targetWord.getStartChar();
        String blanksReplacement = "_".repeat(wordLength);

        modifiedContent.replace(targetWord.getStartChar(), targetWord.getEndChar(), blanksReplacement);

        blanks.add(new Blank(
          isFillInTheBlanks ? targetWord.getStartChar() : null,
          isFillInTheBlanks ? targetWord.getEndChar() : null,
          hint
        ));
      }
    }

    if (!isFillInTheBlanks) {
      shuffle(blanks);
    }

    return new ExerciseDto(modifiedContent.toString(), blanks);
  }

  private ExerciseDto generateFromSentences(ExerciseType type, ExerciseFormat format, String topic, List<String> c1Words) {
    List<ExerciseGeneratorSource> sources = exerciseGeneratorSourceDao.findSourcesForExercise(SENTENCE, type, topic);

//    todo
    return new ExerciseDto("a", List.of());
  }
}

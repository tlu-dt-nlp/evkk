package ee.tlu.evkk.api.service;

import ee.evkk.dto.ExerciseGeneratorAnalysis;
import ee.evkk.dto.ExerciseGeneratorAnalysis.Word;
import ee.evkk.dto.FillInTheBlanksExercise;
import ee.evkk.dto.FillInTheBlanksExercise.Blank;
import ee.evkk.dto.enums.ExerciseStructureType;
import ee.evkk.dto.enums.ExerciseType;
import ee.tlu.evkk.dal.dao.ExerciseGeneratorSourceDao;
import ee.tlu.evkk.dal.dto.ExerciseGeneratorSource;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static ee.evkk.dto.enums.ExerciseStructureType.TEXT;
import static ee.evkk.dto.enums.ExerciseType.INFINITIVE;
import static ee.tlu.evkk.api.util.FileUtils.readResourceAsString;
import static ee.tlu.evkk.common.util.TextUtils.sanitizeLemmaString;
import static java.util.Arrays.asList;
import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class ExerciseGeneratorService {

  private final ExerciseGeneratorSourceDao exerciseGeneratorSourceDao;

  public Object generateExercise(ExerciseType type, ExerciseStructureType structureType, String topic) {
    List<String> c1Words = new ArrayList<>(asList(readResourceAsString(
      INFINITIVE.equals(type) ? "c1_verbs.txt" : "c1_nouns.txt"
    ).split(",")));

    return TEXT.equals(structureType)
      ? generateFromTexts(type, topic, c1Words)
      : generateFromSentences(type, topic, c1Words);
  }

  private Object generateFromTexts(ExerciseType type, String topic, List<String> c1Words) {
    List<ExerciseGeneratorSource> sources = exerciseGeneratorSourceDao.findTextsForExercise(type, topic);

    ExerciseGeneratorSource targetSource = sources.stream()
      .filter(source -> {
        long matchingWordCount = source.getAnalysisAsObject().getSentences().stream()
          .flatMap(sentence -> sentence.getWords().stream())
          .filter(word -> INFINITIVE.equals(type)
            ? isInfinitiveTarget(word, c1Words)
            : isObjectTarget(word, c1Words)
          ).count();
        return matchingWordCount >= 5;
      })
      .findFirst()
      .orElse(null);

    if (targetSource == null) {
      return null;
    }

    StringBuilder modifiedContent = new StringBuilder(targetSource.getContent());
    List<Blank> blanks = new ArrayList<>();

    for (ExerciseGeneratorAnalysis.Sentence sentence : targetSource.getAnalysisAsObject().getSentences()) {
      Word targetWord = sentence.getWords().stream()
        .filter(word -> INFINITIVE.equals(type)
          ? isInfinitiveTarget(word, c1Words)
          : isObjectTarget(word, c1Words)
        )
        .findFirst()
        .orElse(null);

      if (targetWord != null) {
        int wordLength = targetWord.getEndChar() - targetWord.getStartChar();
        String blanksReplacement = "_".repeat(wordLength);

        modifiedContent.replace(targetWord.getStartChar(), targetWord.getEndChar(), blanksReplacement);

        blanks.add(new Blank(
          targetWord.getStartChar(),
          targetWord.getEndChar(),
          sanitizeLemmaString(targetWord.getLemma())
        ));
      }
    }

    return new FillInTheBlanksExercise(modifiedContent.toString(), blanks);
  }

  private Object generateFromSentences(ExerciseType type, String topic, List<String> c1Words) {
    List<ExerciseGeneratorSource> sources = exerciseGeneratorSourceDao.findSentencesForExercise(type, topic);

    return sources.stream()
      .filter(source -> {
        ExerciseGeneratorAnalysis analysis = source.getAnalysisAsObject();
//        todo
        return true;
      })
      .collect(toList());
  }

  private boolean isInfinitiveTarget(Word word, List<String> c1Verbs) {
//    boolean isC1Verb = c1Verbs.contains(sanitizeLemmaString(word.getLemma()));
    boolean isVerb = word.getUpos().equals("VERB");
    boolean isInf = word.getFeats().contains("VerbForm=Inf");
    boolean isSup = word.getFeats().contains("VerbForm=Sup") && word.getFeats().contains("Case=Ill");
//    return isC1Verb && isVerb && (isInf || isSup);
    return isVerb && (isInf || isSup);
  }

  private boolean isObjectTarget(Word word, List<String> c1Nouns) {
//    boolean isC1Noun = c1Nouns.contains(sanitizeLemmaString(word.getLemma()));
    boolean isNoun = word.getUpos().equals("NOUN");
    boolean isMatchingDeprel = word.getDeprel().equals("obj") || word.getDeprel().equals("obl");
    boolean isMatchingCase = word.getFeats().contains("Case=Nom") || word.getFeats().contains("Case=Gen") || word.getFeats().contains("Case=Par");
    boolean isPlural = word.getFeats().contains("Number=Plur");
//    return isC1Noun && isNoun && isMatchingDeprel && isMatchingCase && isPlural;
    return isNoun && isMatchingDeprel && isMatchingCase && isPlural;
  }
}

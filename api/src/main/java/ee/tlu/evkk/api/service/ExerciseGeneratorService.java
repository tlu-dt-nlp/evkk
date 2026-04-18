package ee.tlu.evkk.api.service;

import ee.evkk.dto.ExerciseGeneratorAnalysis;
import ee.evkk.dto.ExerciseGeneratorAnalysis.Word;
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

    return sources.stream()
      .filter(source -> {
        ExerciseGeneratorAnalysis analysis = source.getAnalysisAsObject();
        long matchingWordCount = analysis.getSentences().stream()
          .flatMap(sentence -> sentence.getWords().stream())
          .filter(word -> INFINITIVE.equals(type)
            ? isInfinitiveTarget(word, c1Words)
            : isObjectTarget(word, c1Words)
          ).count();
        return matchingWordCount >= 5;
      })
      .collect(toList());
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
    boolean isInf = word.getFeats().contains("VerbForm=Inf");
    boolean isSup = word.getFeats().contains("VerbForm=Sup") && word.getFeats().contains("Case=Ill");
//    return isC1Verb && (isInf || isSup);
    return isInf || isSup;
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

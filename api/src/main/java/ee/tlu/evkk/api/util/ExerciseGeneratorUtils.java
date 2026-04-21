package ee.tlu.evkk.api.util;

import ee.evkk.dto.ExerciseGeneratorAnalysisDto;
import ee.evkk.dto.ExerciseGeneratorAnalysisDto.Word;
import ee.evkk.dto.enums.TargetWordCriteria;
import lombok.NoArgsConstructor;

import java.util.List;

import static ee.evkk.dto.enums.TargetWordCriteria.NONE;
import static ee.tlu.evkk.common.util.TextUtils.sanitizeLemmaString;
import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class ExerciseGeneratorUtils {

  public static boolean isInfinitiveTarget(Word word, List<String> criteriaWords, TargetWordCriteria targetWordCriteria) {
    boolean isVerb = word.getUpos().equals("VERB");
    boolean isInf = word.getFeats().contains("VerbForm=Inf");
    boolean isSup = word.getFeats().contains("VerbForm=Sup") && word.getFeats().contains("Case=Ill");
    boolean isValidForm = isInf || isSup;

    if (!isVerb || !isValidForm) {
      return false;
    }

    return matchesCriteria(word, criteriaWords, targetWordCriteria);
  }

  public static boolean isObjectTarget(Word word, List<String> criteriaWords, TargetWordCriteria targetWordCriteria) {
    boolean isNoun = word.getUpos().equals("NOUN");
    boolean isMatchingDeprel = word.getDeprel().equals("obj") || word.getDeprel().equals("obl");
    boolean isMatchingCase = word.getFeats().contains("Case=Nom") || word.getFeats().contains("Case=Gen") || word.getFeats().contains("Case=Par");
    boolean isPlural = word.getFeats().contains("Number=Plur");
    boolean meetsGrammarRules = isNoun && isMatchingDeprel && isMatchingCase && isPlural;

    if (!meetsGrammarRules) {
      return false;
    }

    return matchesCriteria(word, criteriaWords, targetWordCriteria);
  }

  private static boolean matchesCriteria(Word word, List<String> criteriaWords, TargetWordCriteria targetWordCriteria) {
    if (NONE.equals(targetWordCriteria)) {
      return true;
    }

    String lemma = sanitizeLemmaString(word.getLemma());
    return criteriaWords.contains(lemma);
  }

  public static int calculateFirstWordOffset(ExerciseGeneratorAnalysisDto.Sentence sentence, String sentenceText) {
    if (sentence.getWords().isEmpty()) {
      return 0;
    }
    String firstWord = sentence.getWords().get(0).getWord();
    int offset = sentenceText.indexOf(firstWord);
    return offset == -1 ? 0 : offset;
  }
}

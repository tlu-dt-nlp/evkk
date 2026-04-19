package ee.tlu.evkk.api.util;

import ee.evkk.dto.ExerciseGeneratorAnalysisDto.Word;
import lombok.NoArgsConstructor;

import java.util.List;

import static ee.tlu.evkk.common.util.TextUtils.sanitizeLemmaString;
import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class ExerciseGeneratorUtils {

  public static boolean isInfinitiveTarget(Word word, List<String> c1Verbs, boolean setC1Criteria) {
    boolean isVerb = word.getUpos().equals("VERB");
    boolean isInf = word.getFeats().contains("VerbForm=Inf");
    boolean isSup = word.getFeats().contains("VerbForm=Sup") && word.getFeats().contains("Case=Ill");

    if (setC1Criteria) {
      boolean isC1Verb = c1Verbs.contains(sanitizeLemmaString(word.getLemma()));
      return isC1Verb && isVerb && (isInf || isSup);
    }

    return isVerb && (isInf || isSup);
  }

  public static boolean isObjectTarget(Word word, List<String> c1Nouns, boolean setC1Criteria) {
    boolean isNoun = word.getUpos().equals("NOUN");
    boolean isMatchingDeprel = word.getDeprel().equals("obj") || word.getDeprel().equals("obl");
    boolean isMatchingCase = word.getFeats().contains("Case=Nom") || word.getFeats().contains("Case=Gen") || word.getFeats().contains("Case=Par");
    boolean isPlural = word.getFeats().contains("Number=Plur");

    if (setC1Criteria) {
      boolean isC1Noun = c1Nouns.contains(sanitizeLemmaString(word.getLemma()));
      return isC1Noun && isNoun && isMatchingDeprel && isMatchingCase && isPlural;
    }

    return isNoun && isMatchingDeprel && isMatchingCase && isPlural;
  }
}

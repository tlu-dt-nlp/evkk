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

  private static final String UPOS_NOUN = "NOUN";

  public static boolean isInfinitiveTarget(Word word, List<String> criteriaWords, TargetWordCriteria targetWordCriteria) {
    List<String> feats = word.getFeats();

    boolean isVerb = word.getUpos().equals("VERB");
    boolean isInf = feats.contains("VerbForm=Inf");
    boolean isSup = feats.contains("VerbForm=Sup") && feats.contains("Case=Ill");
    boolean isValidForm = isInf || isSup;

    if (!isVerb || !isValidForm) {
      return false;
    }

    return matchesCriteria(word, criteriaWords, targetWordCriteria);
  }

  public static boolean isObjectTarget(Word word, List<String> criteriaWords, TargetWordCriteria targetWordCriteria) {
    String deprel = word.getDeprel();
    List<String> feats = word.getFeats();

    boolean isNoun = word.getUpos().equals(UPOS_NOUN);
    boolean isMatchingDeprel = deprel.equals("obj") || deprel.equals("obl");
    boolean isMatchingCase = feats.contains("Case=Nom") || feats.contains("Case=Gen") || feats.contains("Case=Par");
    boolean isPlural = feats.contains("Number=Plur");
    boolean meetsGrammarRules = isNoun && isMatchingDeprel && isMatchingCase && isPlural;

    if (!meetsGrammarRules) {
      return false;
    }

    return matchesCriteria(word, criteriaWords, targetWordCriteria);
  }

  public static boolean isAdjectiveTarget(Word word, Word nextWord, List<String> criteriaWords, TargetWordCriteria targetWordCriteria) {
    boolean isInitialWordAdjectivalModifier = word.getUpos().equals("ADJ") && word.getDeprel().equals("amod");
    boolean isFollowingWordNoun = nextWord.getUpos().equals(UPOS_NOUN);

    if (!isInitialWordAdjectivalModifier || !isFollowingWordNoun) {
      return false;
    }

    return matchesCriteria(word, criteriaWords, targetWordCriteria);
  }

  public static int calculateFirstWordOffset(ExerciseGeneratorAnalysisDto.Sentence sentence, String sentenceText) {
    if (sentence.getWords().isEmpty()) {
      return 0;
    }
    String firstWord = sentence.getWords().get(0).getWord();
    int offset = sentenceText.indexOf(firstWord);
    return offset == -1 ? 0 : offset;
  }

  private static boolean matchesCriteria(Word word, List<String> criteriaWords, TargetWordCriteria targetWordCriteria) {
    if (NONE.equals(targetWordCriteria)) {
      return true;
    }

    String lemma = sanitizeLemmaString(word.getLemma());
    return criteriaWords.contains(lemma);
  }
}

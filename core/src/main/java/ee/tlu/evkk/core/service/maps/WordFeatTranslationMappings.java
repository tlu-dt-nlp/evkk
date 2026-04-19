package ee.tlu.evkk.core.service.maps;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.Set;

import static java.util.Map.entry;
import static java.util.Map.ofEntries;
import static java.util.Set.of;
import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class WordFeatTranslationMappings {

  @Getter
  private static final Map<String, String> wordTypesEt;
  @Getter
  private static final Map<String, String> numberEt;
  @Getter
  private static final Map<String, String> caseEt;
  @Getter
  private static final Map<String, String> degreeEt;
  @Getter
  private static final Map<String, String> moodEt;
  @Getter
  private static final Map<String, String> personEt;
  @Getter
  private static final Map<String, String> verbEt;

  @Getter
  private static final Map<String, String> wordTypesEn;
  @Getter
  private static final Map<String, String> numberEn;
  @Getter
  private static final Map<String, String> caseEn;
  @Getter
  private static final Map<String, String> degreeEn;
  @Getter
  private static final Map<String, String> moodEn;
  @Getter
  private static final Map<String, String> personEn;
  @Getter
  private static final Map<String, String> verbFormEn;

  @Getter
  private static final Set<String> firstType;
  @Getter
  private static final Set<String> secondType;

  static {
    wordTypesEt = ofEntries(
      entry("ADJ", "omadussõna"),
      entry("ADP", "kaassõna"),
      entry("ADV", "määrsõna"),
      entry("AUX", "tegusõna (abitegusõna)"),
      entry("CCONJ", "sidesõna (rinnastav)"),
      entry("DET", "asesõna"),
      entry("INTJ", "hüüdsõna"),
      entry("NOUN", "nimisõna"),
      entry("NUM", "arvsõna"),
      entry("PRON", "asesõna"),
      entry("PROPN", "nimisõna (pärisnimi)"),
      entry("SCONJ", "sidesõna (alistav)"),
      entry("VERB", "tegusõna"),
      entry("X", "tundmatu"),
      entry("SYM", "–"),
      entry("PUNCT", "–"),
      entry("PART", "–"),
      entry("–", "–")
    );

    numberEt = ofEntries(
      entry("Sing", "ainsuse"),
      entry("Plur", "mitmuse")
    );

    caseEt = ofEntries(
      entry("Nom", "nimetav kääne"),
      entry("Gen", "omastav kääne"),
      entry("Par", "osastav kääne"),
      entry("Add", "lühike sisseütlev kääne"),
      entry("Ill", "sisseütlev kääne"),
      entry("Ine", "seesütlev kääne"),
      entry("Ela", "seestütlev kääne"),
      entry("All", "alaleütlev kääne"),
      entry("Ade", "alalütlev kääne"),
      entry("Abl", "alaltütlev kääne"),
      entry("Tra", "saav kääne"),
      entry("Ter", "rajav kääne"),
      entry("Ess", "olev kääne"),
      entry("Abe", "ilmaütlev kääne"),
      entry("Com", "kaasaütlev kääne")
    );

    degreeEt = ofEntries(
      entry("Pos", "algvõrre"),
      entry("Cmp", "keskvõrre"),
      entry("Sup", "ülivõrre")
    );

    moodEt = ofEntries(
      entry("Ind", "kindla kõneviisi"),
      entry("Cnd", "tingiva kõneviisi"),
      entry("Imp", "käskiv kõneviis"),
      entry("Qot", "kaudse kõneviisi")
    );

    personEt = ofEntries(
      entry("1", "1. pööre"),
      entry("2", "2. pööre"),
      entry("3", "3. pööre")
    );

    verbEt = ofEntries(
      entry("Inf", "da-tegevusnimi"),
      entry("Sup", "ma-tegevusnimi"),
      entry("Conv", "des-vorm")
    );


    wordTypesEn = ofEntries(
      entry("ADJ", "adjective"),
      entry("ADP", "adposition"),
      entry("ADV", "adverb"),
      entry("AUX", "verb (auxiliary)"),
      entry("CCONJ", "conjunction (coordinating)"),
      entry("DET", "pronoun"),
      entry("INTJ", "interjection"),
      entry("NOUN", "noun"),
      entry("NUM", "numeral"),
      entry("PRON", "pronoun"),
      entry("PROPN", "noun (proper)"),
      entry("SCONJ", "conjunction (subordinating)"),
      entry("VERB", "verb"),
      entry("X", "unknown"),
      entry("SYM", "–"),
      entry("PUNCT", "–"),
      entry("PART", "–"),
      entry("–", "–")
    );

    numberEn = ofEntries(
      entry("Sing", "singular"),
      entry("Plur", "plural")
    );

    caseEn = ofEntries(
      entry("Nom", "nominative"),
      entry("Gen", "genitive"),
      entry("Par", "partitive"),
      entry("Add", "additive"),
      entry("Ill", "illative"),
      entry("Ine", "inessive"),
      entry("Ela", "elative"),
      entry("All", "allative"),
      entry("Ade", "adessive"),
      entry("Abl", "ablative"),
      entry("Tra", "translative"),
      entry("Ter", "terminative"),
      entry("Ess", "essive"),
      entry("Abe", "abessive"),
      entry("Com", "comitative")
    );

    degreeEn = ofEntries(
      entry("Pos", "positive"),
      entry("Cmp", "comparative"),
      entry("Sup", "superlative")
    );

    moodEn = ofEntries(
      entry("Ind", "indicative"),
      entry("Cnd", "conditional"),
      entry("Imp", "imperative"),
      entry("Qot", "quotative")
    );

    personEn = ofEntries(
      entry("1", "1st person"),
      entry("2", "2nd person"),
      entry("3", "3rd person")
    );

    verbFormEn = ofEntries(
      entry("Inf", "-da infinitive"),
      entry("Sup", "-ma infinitive"),
      entry("Conv", "gerund (-des form)")
    );


    firstType = of(
      "NOUN",
      "PROPN",
      "ADJ",
      "DET",
      "PRON",
      "NUM"
    );

    secondType = of(
      "AUX",
      "VERB"
    );
  }

}

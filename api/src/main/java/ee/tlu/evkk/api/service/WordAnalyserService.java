package ee.tlu.evkk.api.service;

import ee.evkk.dto.WordAnalyserRequestDto;
import ee.evkk.dto.WordAnalyserResponseDto;
import ee.evkk.dto.enums.Language;
import ee.tlu.evkk.core.service.TextService;
import ee.tlu.evkk.core.service.maps.WordFeatTranslationMappings;
import ee.tlu.evkk.dal.dto.StanzaResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import static ee.evkk.dto.enums.Language.EN;
import static ee.evkk.dto.enums.Language.ET;
import static ee.tlu.evkk.common.util.TextUtils.sanitizeLemmaStrings;
import static ee.tlu.evkk.common.util.TextUtils.sanitizeWordStrings;
import static java.util.Arrays.asList;
import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class WordAnalyserService {

  private final StanzaAnalysisService stanzaAnalysisService;
  private final TextService textService;

  private static final Set<String> firstType = WordFeatTranslationMappings.getFirstType();
  private static final Set<String> secondType = WordFeatTranslationMappings.getSecondType();
  private static Map<String, String> numberTranslations;
  private static Map<String, String> caseTranslations;
  private static Map<String, String> degreeTranslations;
  private static Map<String, String> moodTranslations;
  private static Map<String, String> personTranslations;
  private static Map<String, String> verbFormTranslations;
  private static StringBuilder tensePrefixPresent;
  private static StringBuilder tensePrefixPast;
  private static String tensePostfixNud;
  private static String tensePostfixTud;
  private static String negPolarity;
  private static String negation;
  private static String impersonal;
  private static String present;
  private static String simplePast;
  private static String past;
  private static String inflectedFormNudParticiple;
  private static String inflectedFormTudParticiple;
  private static String imperativeMood;

  public WordAnalyserResponseDto getWordAnalyserResponse(WordAnalyserRequestDto dto) {
    String sanitizedTextContent = textService.combineCorpusTextIdsAndOwnText(dto.getCorpusTextIds(), dto.getOwnTexts());
    StanzaResponseDto stanzaResponse = stanzaAnalysisService.getWordAnalyserResponse(dto);
    return new WordAnalyserResponseDto(
      sanitizeWordStrings(stanzaResponse.getSonad()),
      sanitizeLemmaStrings(stanzaResponse.getLemmad()),
      stanzaResponse.getSilbid(),
      translateWordType(stanzaResponse.getSonaliigid(), dto.getLanguage()),
      translateFeats(stanzaResponse.getVormimargendid(), dto.getLanguage()),
      sanitizedTextContent
    );
  }

  public List<String> translateWordType(List<String> tekst, Language language) {
    Map<String, String> wordTypes;
    if (ET.equals(language)) {
      wordTypes = WordFeatTranslationMappings.getWordTypesEt();
    } else {
      wordTypes = WordFeatTranslationMappings.getWordTypesEn();
    }
    return tekst.stream()
      .map(wordTypes::get)
      .collect(toList());
  }

  public List<String> translateFeats(List<List<String>> tekst, Language language) {
    getLanguageMappings(language);
    List<String> result = new ArrayList<>();

    for (List<String> wordData : tekst) {
      // muutumatud sõnad (Abbr=Yes ehk lühendid; NumForm=Digit ehk arvud jne)
      String pos = wordData.get(0);
      String feats = wordData.get(1);
      if (feats == null || feats.equals("–") || feats.equals("Abbr=Yes") || feats.contains("NumForm=Digit")) {
        result.add("–");
      }

      // käändsõnad
      else if (firstType.contains(pos)) {
        String[] featsSplit = feats.split("\\|");
        String numberLabel = "";
        String caseLabel = "";
        String degreeLabel = "";
        StringBuilder tenseLabel = new StringBuilder();

        for (String feat : featsSplit) {
          if (feat.contains("Number")) {
            numberLabel = numberTranslations.get(feat.split("=")[1]);
          }
          if (feat.contains("Case")) {
            caseLabel = caseTranslations.get(feat.split("=")[1]);
          }
          if (feat.contains("Degree")) {
            degreeLabel = degreeTranslations.get(feat.split("=")[1]);
          }
          if (feat.contains("Tense")) {
            if (feat.split("=")[1].equals("Pres")) {
              tenseLabel = tensePrefixPresent;
            } else {
              tenseLabel = tensePrefixPast;
            }
          }
          if (feat.contains("Voice") && tenseLabel.toString().contentEquals(tensePrefixPast)) {
            if (feat.split("=")[1].equals("Act")) {
              tenseLabel.append(tensePostfixNud);
            } else {
              tenseLabel.append(tensePostfixTud);
              if (EN.equals(language)) {
                tenseLabel.insert(0, "im");
              }
            }
          }
        }

        StringBuilder subResult = new StringBuilder();
        if (!numberLabel.isEmpty()) {
          subResult.append(numberLabel).append(" ");
        }
        if (!caseLabel.isEmpty()) {
          subResult.append(caseLabel);
        }
        if (!degreeLabel.isEmpty()) {
          if (!subResult.toString().isEmpty()) {
            subResult.append(", ");
          }
          subResult.append(degreeLabel);
        }
        if (tenseLabel.length() > 0) {
          if (!subResult.toString().isEmpty()) {
            subResult.append(", ");
          }
          subResult.append(tenseLabel);
        }
        result.add(subResult.toString());
      }

      // tegusõnad
      else if (secondType.contains(pos)) {
        List<String> featsSplit = asList(feats.split("\\|"));
        String moodLabel = "";
        String tenseLabel = "";
        String numberLabel = "";
        String personVoiceLabel = "";
        String negativityLabel = "";
        String verbFormLabel = "";

        // Polarity=Neg only
        if (feats.equals("Polarity=Neg")) {
          result.add(negPolarity);
        }

        // pöördelised vormid
        else if (feats.contains("VerbForm=Fin")) {
          for (String feat : featsSplit) {
            if (feat.contains("Mood")) {
              moodLabel = moodTranslations.get(feat.split("=")[1]);
            }
            if (feat.contains("Number")) {
              numberLabel = numberTranslations.get(feat.split("=")[1]);
            }
            if (feat.contains("Voice") && feat.split("=")[1].equals("Pass")) {
              personVoiceLabel = impersonal;
            }
            if ((feat.contains("Polarity") || feat.contains("Connegative"))
              && (feat.split("=")[1].equals("Neg") || feat.split("=")[1].equals("Yes"))) {
              negativityLabel = negation;
            }
          }
          for (String feat : featsSplit) {
            if (feat.contains("Tense")) {
              if (feat.split("=")[1].equals("Pres")) {
                tenseLabel = present;
              } else {
                if (EN.equals(language)) {
                  tenseLabel = past;
                } else {
                  if (moodLabel.equals("kindla kõneviisi")) {
                    tenseLabel = simplePast;
                  } else if (moodLabel.equals("tingiva kõneviisi") || moodLabel.equals("kaudse kõneviisi")) {
                    tenseLabel = past;
                  }
                }
              }
            }
            if (feat.contains("Person") && !Objects.equals(personVoiceLabel, impersonal)) {
              personVoiceLabel = personTranslations.get(feat.split("=")[1]);
            }
          }

          StringBuilder subResult = new StringBuilder(moodLabel);
          if (!Objects.equals(moodLabel, imperativeMood)) {
            subResult.append(" ").append(tenseLabel);
          }
          if (!negativityLabel.equals(negation) && !Objects.equals(personVoiceLabel, impersonal) && !numberLabel.isEmpty()) {
            if (!tenseLabel.isEmpty()) {
              subResult.append(",");
            }
            subResult.append(" ").append(numberLabel);
          }
          if (!negativityLabel.equals(negation) && !personVoiceLabel.isEmpty()) {
            if (numberLabel.isEmpty()) {
              subResult.append(",");
            }
            subResult.append(" ").append(personVoiceLabel);
          }
          if (!negativityLabel.isEmpty()) {
            if (personVoiceLabel.isEmpty() && numberLabel.isEmpty()) {
              subResult.append(",");
            }
            subResult.append(" ").append(negativityLabel);
          }
          result.add(subResult.toString());
        }

        // käändelised vormid (inflected form)
        else {
          if (featsSplit.contains("VerbForm=Part") && featsSplit.contains("Tense=Past")) {
            if (featsSplit.contains("Voice=Act")) {
              verbFormLabel = inflectedFormNudParticiple;
            } else if (featsSplit.contains("Voice=Pass")) {
              verbFormLabel = inflectedFormTudParticiple;
            }
          } else {
            for (String feat : featsSplit) {
              if (feat.split("=")[0].equals("VerbForm")) {
                verbFormLabel = verbFormTranslations.get(feat.split("=")[1]);
              }
            }
          }
          result.add(verbFormLabel);
        }
      }
    }

    return result;
  }

  private static void getLanguageMappings(Language language) {
    if (ET.equals(language)) {
      numberTranslations = WordFeatTranslationMappings.getNumberEt();
      caseTranslations = WordFeatTranslationMappings.getCaseEt();
      degreeTranslations = WordFeatTranslationMappings.getDegreeEt();
      moodTranslations = WordFeatTranslationMappings.getMoodEt();
      personTranslations = WordFeatTranslationMappings.getPersonEt();
      verbFormTranslations = WordFeatTranslationMappings.getVerbEt();
      tensePrefixPresent = new StringBuilder("oleviku kesksõna");
      tensePrefixPast = new StringBuilder("mineviku kesksõna");
      tensePostfixNud = " nud-vorm";
      tensePostfixTud = " tud-vorm";
      negPolarity = "eitussõna";
      negation = "eitus";
      impersonal = "umbisikuline tegumood";
      present = "olevik";
      simplePast = "lihtminevik";
      past = "minevik";
      inflectedFormNudParticiple = "mineviku kesksõna nud-vorm";
      inflectedFormTudParticiple = "mineviku kesksõna tud-vorm";
      imperativeMood = "käskiv kõneviis,";
    } else {
      numberTranslations = WordFeatTranslationMappings.getNumberEn();
      caseTranslations = WordFeatTranslationMappings.getCaseEn();
      degreeTranslations = WordFeatTranslationMappings.getDegreeEn();
      moodTranslations = WordFeatTranslationMappings.getMoodEn();
      personTranslations = WordFeatTranslationMappings.getPersonEn();
      verbFormTranslations = WordFeatTranslationMappings.getVerbFormEn();
      tensePrefixPresent = new StringBuilder("present participle");
      tensePrefixPast = new StringBuilder("personal past participle");
      tensePostfixNud = " (-nud)";
      tensePostfixTud = " (-tud)";
      negPolarity = "negative particle";
      negation = "negation";
      impersonal = "impersonal";
      present = "present";
      past = "past";
      inflectedFormNudParticiple = "personal past participle (-nud)";
      inflectedFormTudParticiple = "impersonal past participle (-tud)";
      imperativeMood = "imperative,";
    }
  }

}

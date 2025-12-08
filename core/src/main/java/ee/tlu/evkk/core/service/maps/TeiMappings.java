package ee.tlu.evkk.core.service.maps;

import ee.tlu.evkk.core.service.helpers.CommonMetadataForPersonPropertyCreation;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

import static ee.tlu.evkk.core.service.constants.TeiConstants.EDUCATION;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_COUNTRY;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_EDUCATION;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_NATIONALITY;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_RESEARCH_DEGREE;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_STUDY_LEVEL;
import static ee.tlu.evkk.core.service.constants.TeiConstants.NATIONALITY;
import static ee.tlu.evkk.core.service.constants.TeiConstants.RESIDENCE;
import static java.util.List.of;
import static java.util.Map.entry;
import static java.util.Map.ofEntries;
import static lombok.AccessLevel.PRIVATE;

@NoArgsConstructor(access = PRIVATE)
public class TeiMappings {

  @Getter
  private static final Map<String, String> language;
  @Getter
  private static final Map<String, String> languageCode;
  @Getter
  private static final Map<String, String> corpus;
  @Getter
  private static final Map<String, String> country;
  @Getter
  private static final Map<String, String> nationality;
  @Getter
  private static final Map<String, String> education;
  @Getter
  private static final Map<String, String> preparedness;
  @Getter
  private static final Map<String, String> age;

  @Getter
  private static final List<CommonMetadataForPersonPropertyCreation> commonMetadataForPersonPropertyCreation;

  static {
    language = ofEntries(
      entry("eesti", "Estonian"),
      entry("vene", "Russian"),
      entry("eesti, vene", "Estonian, Russian"),
      entry("soome", "Finnish"),
      entry("inglise", "English"),
      entry("saksa", "German"),
      entry("prantsuse", "French"),
      entry("jaapani", "Japanese"),
      entry("jidiš", "Yiddish"),
      entry("leedu", "Lithuanian"),
      entry("läti", "Latvian"),
      entry("poola", "Polish"),
      entry("rootsi", "Swedish"),
      entry("ukraina", "Ukrainian"),
      entry("ungari", "Hungarian"),
      entry("valgevene", "Belarusian"),
      entry("hiina", "Chinese")
    );

    languageCode = ofEntries(
      entry("eesti", "et"),
      entry("vene", "ru"),
      entry("eesti, vene", "et, ru"),
      entry("soome", "fi"),
      entry("inglise", "en"),
      entry("saksa", "de"),
      entry("prantsuse", "fr"),
      entry("jaapani", "jp"),
      entry("jidiš", "ji"),
      entry("leedu", "lt"),
      entry("läti", "lv"),
      entry("poola", "pl"),
      entry("rootsi", "se"),
      entry("ukraina", "ua"),
      entry("ungari", "hu"),
      entry("valgevene", "by"),
      entry("hiina", "cn")
    );

    corpus = ofEntries(
      entry("cFqPphvYi", "Estonian L2 olympiade"),
      entry("clWmOIrLa", "Estonian L2 proficiency exams"),
      entry("cFOoRQekA", "L2 Estonian"),
      entry("cYDRkpymb", "L1 Estonian"),
      entry("cgSRJPKTr", "L1 Russian"),
      entry("cZjHWUPtD", "L3 Russian"),
      entry("cwUSEqQLt", "Academic Estonian")
    );

    country = ofEntries(
      entry("Eesti", "Estonia"),
      entry("Inglismaa", "England"),
      entry("Leedu", "Lithuania"),
      entry("Muu", "Other"),
      entry("Saksamaa", "Germany"),
      entry("Soome", "Finland"),
      entry("Ungari", "Hungary")
    );

    nationality = ofEntries(
      entry("Ameerika Ühendriigid", "U.S."),
      entry("Brasiilia", "Brazilian"),
      entry("Bulgaaria", "Bulgarian"),
      entry("Eesti", "Estonian"),
      entry("Egiptus", "Egyptian"),
      entry("Filipiinid", "Filipino"),
      entry("Hiina", "Chinese"),
      entry("Hispaania", "Spanish"),
      entry("Holland", "Dutch"),
      entry("Iirimaa", "Irish"),
      entry("India", "Indian"),
      entry("Kreeka", "Greek"),
      entry("Leedu", "Lithuanian"),
      entry("Läti", "Latvian"),
      entry("Makedoonia", "North Macedonia"),
      entry("Määramata", "Unassigned"),
      entry("Poola", "Polish"),
      entry("Prantsusmaa", "French"),
      entry("Rumeenia", "Romanian"),
      entry("Saksamaa", "German"),
      entry("Soome", "Finnish"),
      entry("Suurbritannia", "British"),
      entry("Türgi", "Turkish"),
      entry("Ukraina", "Ukrainian"),
      entry("Valgevene", "Belarusian"),
      entry("Venemaa", "Russian"),
      entry("Venezuela", "Venezuelan")
    );

    education = ofEntries(
      entry("Alg-/põhiharidus", "elementary/basic education"),
      entry("Keskeriharidus/kutseharidus", "(secondary) vocational education"),
      entry("Keskharidus", "secondary education"),
      entry("Kõrgharidus", "higher education"),
      entry("bakalaureuseope", "Bachelor's studies"),
      entry("magistriope", "Master's studies"),
      entry("doktoriope", "Doctoral studies"),
      entry("ba", "Bachelor's degree"),
      entry("ma", "Master's degree"),
      entry("phd", "Doctoral degree")
    );

    preparedness = ofEntries(
      entry("tehisintellekt", "generative artificial intelligence"),
      entry("keeleoppematerjalid", "language learning materials"),
      entry("automaatkontroll", "automated correction"),
      entry("tolkesonastik", "translation dictionary or machine translation"),
      entry("ykskeelnesonastik", "monolingual dictionary (incl. online dictionaries)"),
      entry("terminisonastik", "term glossary or base"),
      entry("kasiraamat", "professional handbook or manual"),
      entry("muu", "other")
    );

    age = ofEntries(
      entry("kuni18", "up to 18"),
      entry("kuni26", "19–26"),
      entry("kuni40", "27–40"),
      entry("41plus", "over 40")
    );


    commonMetadataForPersonPropertyCreation = of(
      new CommonMetadataForPersonPropertyCreation(nationality, METADATA_KEY_NATIONALITY, NATIONALITY),
      new CommonMetadataForPersonPropertyCreation(country, METADATA_KEY_COUNTRY, RESIDENCE),
      new CommonMetadataForPersonPropertyCreation(education, METADATA_KEY_EDUCATION, EDUCATION),
      new CommonMetadataForPersonPropertyCreation(education, METADATA_KEY_STUDY_LEVEL, EDUCATION),
      new CommonMetadataForPersonPropertyCreation(education, METADATA_KEY_RESEARCH_DEGREE, EDUCATION)
    );
  }
}

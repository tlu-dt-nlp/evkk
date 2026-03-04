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
  private static final Map<String, String> type;
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
    type = ofEntries(
      entry("ak_eriala_analuus", "Academic studies: analysis"),
      entry("ak_eriala_essee", "Academic studies: essay"),
      entry("ak_eriala_kursusetoo", "Academic studies: course paper"),
      entry("ak_eriala_referaat", "Academic studies: report"),
      entry("ak_eriala_retsensioon", "Academic studies: review"),
      entry("ak_eriala_seminaritoo", "Academic studies: seminar paper"),
      entry("ak_eriala_ulevaade", "Academic studies: overview"),
      entry("ak_uurimus_artikkel", "Academic research: article"),
      entry("ak_uurimus_batoo", "Academic research: bachelor's thesis"),
      entry("ak_uurimus_diplomitoo", "Academic research: thesis"),
      entry("ak_uurimus_ettekanne", "Academic research: presentation"),
      entry("ak_uurimus_kokkuvote", "Academic research: summary"),
      entry("ak_uurimus_matoo", "Academic research: master's thesis"),
      entry("ak_uurimus_phdtoo", "Academic research: doctoral thesis"),
      entry("k1eesti_arvamuslugu", "L1 opinion piece"),
      entry("k1eesti_ekirjand_12kl", "L1 12th grade e-essay"),
      entry("k1eesti_ekirjand_9kl", "L1 9th grade e-essay"),
      entry("k1eesti_harjutus", "L1 exercise"),
      entry("k1eesti_eksamitoo", "L1 examination"),
      entry("k1vene_eksamitoo", "L1 Russian examination"),
      entry("k1vene_loovkirjutis", "L1 Russian creative writing"),
      entry("k2eesti_eksamitoo", "L2 examination"),
      entry("k2eesti_harjutus_dialoog", "L2 exercise: dialogue"),
      entry("k2eesti_harjutus_etteutlus", "L2 exercise: dictation"),
      entry("k2eesti_harjutus_juhend", "L2 exercise: instruction"),
      entry("k2eesti_harjutus_kirjeldus", "L2 exercise: description"),
      entry("k2eesti_harjutus_kone", "L2 exercise: speech"),
      entry("k2eesti_harjutus_kuulutus", "L2 exercise: announcement"),
      entry("k2eesti_harjutus_laused", "L2 exercise: sentence construction"),
      entry("k2eesti_harjutus_leping", "L2 exercise: contract"),
      entry("k2eesti_harjutus_lunktekst", "L2 exercise: fill-in-the-blanks"),
      entry("k2eesti_harjutus_menuu", "L2 exercise: menu"),
      entry("k2eesti_harjutus_reklaam", "L2 exercise: advertisement"),
      entry("k2eesti_harjutus_retsept", "L2 exercise: recipe"),
      entry("k2eesti_harjutus_teejuht", "L2 exercise: guide"),
      entry("k2eesti_harjutus_umberjutustus", "L2 exercise: retelling"),
      entry("k2eesti_harjutus_vastused", "L2 exercise: answering questions"),
      entry("k2eesti_kiri_isiklik", "L2 letter: informal"),
      entry("k2eesti_kiri_poolametlik", "L2 letter: (semi-)formal"),
      entry("k2eesti_kontrolltoo_test", "L2 test"),
      entry("k2eesti_loovkirjutis", "L2 creative writing"),
      entry("k2eesti_ol_loovkirjutis", "L2 olympiade creative writing"),
      entry("k2eesti_riiklik_eksamitoo", "L2 proficiency exam writing"),
      entry("k2eesti_tolge", "L2 translation"),
      entry("k3vene_eksamitoo", "L3 Russian examination"),
      entry("k3vene_loovkirjutis", "L3 Russian creative writing")
    );

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

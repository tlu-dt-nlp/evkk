package ee.tlu.evkk.core.service;

import ee.evkk.dto.AddingRequestDto;
import ee.evkk.dto.CommonTextRequestDto;
import ee.evkk.dto.CorpusDownloadDto;
import ee.evkk.dto.CorpusRequestDto;
import ee.evkk.dto.DonatedTextRequestDto;
import ee.evkk.dto.enums.CorpusDownloadForm;
import ee.tlu.evkk.core.integration.StanzaServerClient;
import ee.tlu.evkk.core.service.dto.TextWithComplexity;
import ee.tlu.evkk.dal.dao.TextAddedDao;
import ee.tlu.evkk.dal.dao.TextDao;
import ee.tlu.evkk.dal.dto.CorpusDownloadResponseEntity;
import ee.tlu.evkk.dal.dto.TextQueryDisjunctionParamHelper;
import ee.tlu.evkk.dal.dto.TextQueryMultiParamHelper;
import ee.tlu.evkk.dal.dto.TextQueryRangeParamBaseHelper;
import ee.tlu.evkk.dal.dto.TextQueryRangeParamHelper;
import ee.tlu.evkk.dal.dto.TextQuerySingleParamHelper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static ee.evkk.dto.enums.CorpusDownloadFileType.ZIP;
import static ee.evkk.dto.enums.CorpusDownloadForm.ANNOTATE_TEI;
import static ee.evkk.dto.enums.CorpusDownloadForm.BASIC_TEXT;
import static ee.tlu.evkk.common.util.TextUtils.getSortedPartitionedUUIDs;
import static ee.tlu.evkk.common.util.TextUtils.sanitizeText;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_ACADEMIC_MATERIALS;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_ACADEMIC_SUBTYPE;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_AGE_RANGE;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_AGE_RAW;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_CORPUS;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_COUNTRY;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_DEGREE;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_DOMAIN;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_EDUCATION;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_GENDER;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_NATIVE_LANGUAGE;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_NON_ACADEMIC_SUBTYPE;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_OTHER_LANGUAGES;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_STUDY_LEVEL;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_TEXT_LANGUAGE;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_TYPE;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_USED_MATERIALS;
import static ee.tlu.evkk.core.service.constants.TextPropertyConstants.PROP_YEAR_RANGE;
import static java.io.File.createTempFile;
import static java.lang.Boolean.TRUE;
import static java.lang.String.format;
import static java.lang.System.lineSeparator;
import static java.nio.charset.StandardCharsets.UTF_8;
import static java.util.Objects.nonNull;
import static java.util.UUID.randomUUID;
import static java.util.regex.Pattern.compile;
import static org.apache.logging.log4j.util.Strings.isBlank;
import static org.apache.logging.log4j.util.Strings.isNotBlank;

/**
 * @author Mikk Tarvas
 * Date: 10.02.2022
 */
@Service
@AllArgsConstructor
public class TextService {

  private final TextDao textDao;
  private final TextAddedDao textAddedDao;
  private final StanzaServerClient stanzaServerClient;

  private static final Pattern fileNameCharacterWhitelist = compile("[\\p{L}0-9& ._()!-]");

  public String getPartitionedTextResourceByIds(Set<UUID> ids, Function<List<UUID>, String> resourceFunction) {
    List<List<UUID>> batches = getSortedPartitionedUUIDs(ids);

    StringBuilder result = new StringBuilder();
    for (List<UUID> batch : batches) {
      String resource = resourceFunction.apply(batch);
      if (isNotBlank(resource)) {
        result.append(resourceFunction.apply(batch)).append(" ");
      }
    }
    return result.toString().trim();
  }

  public String detailneparing(CorpusRequestDto corpusRequestDto, boolean includeMeta) {
    List<TextQuerySingleParamHelper> singleParamHelpers = new ArrayList<>();
    List<TextQueryRangeParamBaseHelper> rangeParamBaseHelpers = new ArrayList<>();
    List<TextQueryMultiParamHelper> multiParamHelpers = new ArrayList<>();

    TextQueryDisjunctionParamHelper studyLevelAndDegreeHelper = new TextQueryDisjunctionParamHelper("p13", PROP_DEGREE, PROP_STUDY_LEVEL);
    TextQuerySingleParamHelper otherLangHelper = new TextQuerySingleParamHelper();
    TextQueryMultiParamHelper usedMultiMaterialsHelper = new TextQueryMultiParamHelper();

    multiParamHelpers.add(new TextQueryMultiParamHelper("p3", PROP_CORPUS, corpusRequestDto.getCorpuses()));

    if (corpusRequestDto.getTypes() != null && !corpusRequestDto.getTypes().isEmpty()) {
      multiParamHelpers.add(new TextQueryMultiParamHelper("p4", PROP_TYPE, corpusRequestDto.getTypes()));
    }
    if (isNotBlank(corpusRequestDto.getLanguage())) {
      singleParamHelpers.add(new TextQuerySingleParamHelper("p5", PROP_TEXT_LANGUAGE, corpusRequestDto.getLanguage()));
    }
    if (isNotBlank(corpusRequestDto.getLevel())) {
      singleParamHelpers.add(new TextQuerySingleParamHelper("p6", "keeletase", corpusRequestDto.getLevel()));
    }
    if (isNotBlank(corpusRequestDto.getDomain())) {
      singleParamHelpers.add(new TextQuerySingleParamHelper("p7", PROP_DOMAIN, corpusRequestDto.getDomain()));
    }
    if (isNotBlank(corpusRequestDto.getUsedMaterials())) {
      singleParamHelpers.add(new TextQuerySingleParamHelper("p8", PROP_USED_MATERIALS, corpusRequestDto.getUsedMaterials()));
    }
    if (corpusRequestDto.getUsedMultiMaterials() != null && !corpusRequestDto.getUsedMultiMaterials().isEmpty()) {
      usedMultiMaterialsHelper.setTable("p9");
      usedMultiMaterialsHelper.setParameter(PROP_ACADEMIC_MATERIALS);
      usedMultiMaterialsHelper.setValues(corpusRequestDto.getUsedMultiMaterials());
    }
    if (isNotBlank(corpusRequestDto.getAge())) {
      singleParamHelpers.add(new TextQuerySingleParamHelper("p10", PROP_AGE_RANGE, corpusRequestDto.getAge()));
    }
    if (isNotBlank(corpusRequestDto.getGender())) {
      singleParamHelpers.add(new TextQuerySingleParamHelper("p11", PROP_GENDER, corpusRequestDto.getGender()));
    }
    if (isNotBlank(corpusRequestDto.getEducation())) {
      singleParamHelpers.add(new TextQuerySingleParamHelper("p12", PROP_EDUCATION, corpusRequestDto.getEducation()));
    }
    if (isNotBlank(corpusRequestDto.getDegree()) && isBlank(corpusRequestDto.getStudyLevel())) {
      studyLevelAndDegreeHelper.setFirstValue(corpusRequestDto.getDegree());
      if (corpusRequestDto.getDegree().equals("ba")) {
        studyLevelAndDegreeHelper.setSecondValue("magistriope");
      } else if (corpusRequestDto.getDegree().equals("ma")) {
        studyLevelAndDegreeHelper.setSecondValue("doktoriope");
      }
    } else if (isNotBlank(corpusRequestDto.getStudyLevel()) && isBlank(corpusRequestDto.getDegree())) {
      studyLevelAndDegreeHelper.setSecondValue(corpusRequestDto.getStudyLevel());
      if (corpusRequestDto.getStudyLevel().equals("magistriope")) {
        studyLevelAndDegreeHelper.setFirstValue("ba");
      } else if (corpusRequestDto.getStudyLevel().equals("doktoriope")) {
        studyLevelAndDegreeHelper.setFirstValue("ma");
      }
    } else if (isNotBlank(corpusRequestDto.getStudyLevel()) && isNotBlank(corpusRequestDto.getDegree())) {
      studyLevelAndDegreeHelper.setFirstValue(corpusRequestDto.getDegree());
      studyLevelAndDegreeHelper.setSecondValue(corpusRequestDto.getStudyLevel());
    }
    if (isNotBlank(corpusRequestDto.getNativeLang())) {
      singleParamHelpers.add(new TextQuerySingleParamHelper("p14", PROP_NATIVE_LANGUAGE, corpusRequestDto.getNativeLang()));
    }
    if (isNotBlank(corpusRequestDto.getOtherLang())) {
      otherLangHelper.setTable("p15");
      otherLangHelper.setParameter(PROP_OTHER_LANGUAGES);
      otherLangHelper.setValue(corpusRequestDto.getOtherLang());
    }
    if (isNotBlank(corpusRequestDto.getNationality())) {
      singleParamHelpers.add(new TextQuerySingleParamHelper("p16", "kodakondsus", corpusRequestDto.getNationality()));
    }
    if (isNotBlank(corpusRequestDto.getCountry())) {
      singleParamHelpers.add(new TextQuerySingleParamHelper("p17", PROP_COUNTRY, corpusRequestDto.getCountry()));
    }
    if (corpusRequestDto.getScores() != null) {
      multiParamHelpers.add(new TextQueryMultiParamHelper("p18", "tulemusvahemik", corpusRequestDto.getScores()));
    }
    if (corpusRequestDto.getAddedYears() != null) {
      multiParamHelpers.add(new TextQueryMultiParamHelper("p19", PROP_YEAR_RANGE, corpusRequestDto.getAddedYears()));
    }
    if (corpusRequestDto.getCharacters() != null) {
      rangeParamBaseHelpers.add(createRangeBaseHelper("p20", "charCount", corpusRequestDto.getCharacters()));
    }
    if (corpusRequestDto.getWords() != null) {
      rangeParamBaseHelpers.add(createRangeBaseHelper("p21", "wordCount", corpusRequestDto.getWords()));
    }
    if (corpusRequestDto.getSentences() != null) {
      rangeParamBaseHelpers.add(createRangeBaseHelper("p22", "sentenceCount", corpusRequestDto.getSentences()));
    }

    String daoResponse = textDao.detailedTextQueryByParameters(multiParamHelpers, singleParamHelpers, rangeParamBaseHelpers, studyLevelAndDegreeHelper, otherLangHelper, usedMultiMaterialsHelper, includeMeta);
    return isNotBlank(daoResponse) ? daoResponse : new ArrayList<>().toString();
  }

  public String getDonatedTexts(DonatedTextRequestDto request, boolean includeMeta) {
    List<TextQuerySingleParamHelper> singleParamHelpers = new ArrayList<>();
    List<TextQueryMultiParamHelper> multiParamHelpers = new ArrayList<>();
    TextQuerySingleParamHelper otherLangHelper = new TextQuerySingleParamHelper();

    addSingleParam(singleParamHelpers, "p3", PROP_TYPE, request.getLiik());
    if (request.getOppematerjal() != null) {
      addSingleParam(singleParamHelpers, "p4", PROP_USED_MATERIALS, booleanToJahEi(request.getOppematerjal()));
    }
    addMultiParam(multiParamHelpers, "p5", PROP_ACADEMIC_MATERIALS, request.getAkadOppematerjal());
    addSingleParam(singleParamHelpers, "p6", "akad_oppematerjal_muu", request.getAkadOppematerjalMuu());
    addSingleParam(singleParamHelpers, "p7", PROP_NON_ACADEMIC_SUBTYPE, request.getMitteakadAlamliik());
    addSingleParam(singleParamHelpers, "p8", PROP_ACADEMIC_SUBTYPE, request.getAkadAlamliik());
    addSingleParam(singleParamHelpers, "p9", "artikkel_valjaanne", request.getArtikkelValjaanne());
    addSingleParam(singleParamHelpers, "p10", "artikkel_aasta", request.getArtikkelAasta());
    addSingleParam(singleParamHelpers, "p11", "artikkel_number", request.getArtikkelNumber());
    addSingleParam(singleParamHelpers, "p12", "artikkel_lehekyljed", request.getArtikkelLehekyljed());
    addSingleParam(singleParamHelpers, "p14", PROP_AGE_RAW, request.getAutoriVanus());
    addSingleParam(singleParamHelpers, "p15", PROP_GENDER, request.getAutoriSugu());
    addSingleParam(singleParamHelpers, "p16", PROP_STUDY_LEVEL, request.getAutoriOppeaste());
    addSingleParam(singleParamHelpers, "p17", PROP_DEGREE, request.getAutoriTeaduskraad());
    addSingleParam(singleParamHelpers, "p18", PROP_EDUCATION, request.getAutoriHaridus());
    addSingleParam(singleParamHelpers, "p19", PROP_DOMAIN, request.getAutoriValdkond());
    addSingleParam(singleParamHelpers, "p20", PROP_NATIVE_LANGUAGE, request.getAutoriEmakeel());
    if (isNotBlank(request.getAutoriMuudKeeled())) {
      otherLangHelper.setTable("p21");
      otherLangHelper.setParameter(PROP_OTHER_LANGUAGES);
      otherLangHelper.setValue(request.getAutoriMuudKeeled());
    }
    addSingleParam(singleParamHelpers, "p22", PROP_COUNTRY, request.getAutoriElukohariik());

    String daoResponse = textAddedDao.detailedTextQueryByParameters(
      singleParamHelpers,
      multiParamHelpers,
      otherLangHelper,
      includeMeta
    );
    return isNotBlank(daoResponse) ? daoResponse : new ArrayList<>().toString();
  }

  public TextWithComplexity keerukusSonaliigidMitmekesisus(CommonTextRequestDto request) {
    return stanzaServerClient.getKeerukusSonaliigidMitmekesisus(sanitizeText(request.getTekst()), request.getModel());
  }

  public byte[] tekstidfailina(CorpusDownloadDto corpusDownloadDto) throws IOException {
    List<CorpusDownloadResponseEntity> contentsAndTitles = BASIC_TEXT.equals(corpusDownloadDto.getForm())
      ? textDao.findTextContentsAndTitlesByIds(corpusDownloadDto.getFileList())
      : textDao.findTextTitlesAndContentsWithStanzaTaggingByIds(corpusDownloadDto.getFileList(), corpusDownloadDto.getForm().toString());

    if (ZIP.equals(corpusDownloadDto.getFileType())) {
      return buildZipOutput(corpusDownloadDto, contentsAndTitles);
    }
    return combineContents(contentsAndTitles, corpusDownloadDto.getForm());
  }

  private byte[] buildZipOutput(CorpusDownloadDto corpusDownloadDto, List<CorpusDownloadResponseEntity> contentsAndTitles) throws IOException {
    File tempFile = createTempFile("corpusDownloadTempZip_", randomUUID().toString(), null);
    String fileExtension = ANNOTATE_TEI.equals(corpusDownloadDto.getForm()) ? "xml" : "txt";

    try (ZipOutputStream zipOutputStream = new ZipOutputStream(new FileOutputStream(tempFile))) {
      for (int i = 0; i < contentsAndTitles.size(); i++) {
        buildSingleZipEntry(corpusDownloadDto, contentsAndTitles, i, fileExtension, zipOutputStream);
      }
    } catch (IOException e) {
      throw new IOException("Something went wrong while generating ZIP file.", e);
    }

    try (FileInputStream fileInputStream = new FileInputStream(tempFile)) {
      return fileInputStream.readAllBytes();
    }
  }

  private void buildSingleZipEntry(CorpusDownloadDto corpusDownloadDto, List<CorpusDownloadResponseEntity> contentsAndTitles, int i, String fileExtension, ZipOutputStream zipOutputStream) throws IOException {
    String contents = replaceNewLinesAndTabs(corpusDownloadDto.getForm(), contentsAndTitles.get(i).getContents());
    String title = getSanitizedFileName(contentsAndTitles.get(i).getTitle());
    UUID uuid = corpusDownloadDto.getFileList().get(i);

    ZipEntry zipEntry = new ZipEntry(
      isNotBlank(title)
        ? format("%s (%s).%s", title.trim(), uuid, fileExtension)
        : uuid + "." + fileExtension
    );
    zipOutputStream.putNextEntry(zipEntry);

    String result = nonNull(contents) ? contents : "";
    zipOutputStream.write(result.getBytes(UTF_8));
    zipOutputStream.closeEntry();
  }

  private byte[] combineContents(List<CorpusDownloadResponseEntity> contentsAndTitles, CorpusDownloadForm formType) {
    boolean isTeiFormat = ANNOTATE_TEI.equals(formType);
    StringBuilder contentsCombined = new StringBuilder();
    boolean isFirstEntry = true;

    for (CorpusDownloadResponseEntity entry : contentsAndTitles) {
      String contents = replaceNewLinesAndTabs(formType, entry.getContents());
      if (isNotBlank(contents)) {
        if (isTeiFormat) {
          contents = processTeiContent(contents, isFirstEntry);
          isFirstEntry = false;
        }
        contentsCombined.append(contents);
        contentsCombined.append(lineSeparator()).append(lineSeparator());
      }
    }

    if (isTeiFormat) {
      contentsCombined.append(lineSeparator()).append("</teiCorpus>");
    }

    return contentsCombined.toString().getBytes(UTF_8);
  }

  private String processTeiContent(String contents, boolean isFirstEntry) {
    if (isFirstEntry) {
      return contents.replaceFirst("</teiCorpus>\\s*$", "");
    }
    return contents
      .replaceFirst("<\\?xml[^>]*\\?>\\s*", "")
      .replaceFirst("<teiCorpus[^>]*>\\s*<teiHeader/>\\s*", "")
      .replaceFirst("</teiCorpus>\\s*$", "");
  }

  public String combineCorpusTextIdsAndOwnText(Set<UUID> corpusTextIds, String ownTexts) {
    StringBuilder result = new StringBuilder();
    if (nonNull(corpusTextIds) && !corpusTextIds.isEmpty()) {
      result.append(getPartitionedTextResourceByIds(corpusTextIds, textDao::findAnalysedTextsByIds));

      String unanalysedTexts = getPartitionedTextResourceByIds(corpusTextIds, textDao::findUnanalysedTextsByIds);
      if (isNotBlank(unanalysedTexts)) {
        result.append(" ").append(unanalysedTexts);
      }
    }
    if (isNotBlank(ownTexts)) {
      result.append(" ").append(ownTexts);
    }
    return sanitizeText(result.toString().trim());
  }

  public String lisatekst(AddingRequestDto andmed) {
    UUID kood = randomUUID();
    textDao.insertAdding(kood, andmed.getSisu());
    lisaTekstiOmadus(kood, "title", andmed.getPealkiri());
    lisaTekstiOmadus(kood, "kirjeldus", andmed.getKirjeldus());
    lisaTekstiOmadus(kood, PROP_TYPE, andmed.getLiik());
    if (TRUE.equals(andmed.getOppematerjal())) {
      String[] m = andmed.getAkadOppematerjal();
      if (m != null) {
        for (String s : m) {
          lisaTekstiOmadus(kood, PROP_ACADEMIC_MATERIALS, s);
        }
      }
      lisaTekstiOmadus(kood, "akad_oppematerjal_muu", andmed.getAkadOppematerjalMuu());
    }
    if (andmed.getLiik().equals("akadeemiline")) {
      lisaTekstiOmadus(kood, PROP_DOMAIN, andmed.getAutoriValdkond());
      lisaTekstiOmadus(kood, PROP_ACADEMIC_SUBTYPE, andmed.getAkadAlamliik());
      lisaTekstiOmadus(kood, "artikkel_aasta", andmed.getArtikkelAasta());
      lisaTekstiOmadus(kood, "artikkel_valjaanne", andmed.getArtikkelValjaanne());
      lisaTekstiOmadus(kood, "artikkel_number", andmed.getArtikkelNumber());
      lisaTekstiOmadus(kood, "artikkel_lehekyljed", andmed.getArtikkelLehekyljed());
      lisaTekstiOmadus(kood, PROP_STUDY_LEVEL, andmed.getAutoriOppeaste());
      lisaTekstiOmadus(kood, PROP_DEGREE, andmed.getAutoriTeaduskraad());
    }
    if (andmed.getLiik().equals("mitteakadeemiline")) {
      lisaTekstiOmadus(kood, PROP_NON_ACADEMIC_SUBTYPE, andmed.getMitteakadAlamliik());
    }
    lisaTekstiOmadus(kood, PROP_USED_MATERIALS, booleanToJahEi(andmed.getOppematerjal()));
    lisaTekstiOmadus(kood, PROP_AGE_RAW, andmed.getAutoriVanus());
    lisaTekstiOmadus(kood, PROP_GENDER, andmed.getAutoriSugu());
    lisaTekstiOmadus(kood, PROP_EDUCATION, andmed.getAutoriHaridus());
    lisaTekstiOmadus(kood, PROP_NATIVE_LANGUAGE, andmed.getAutoriEmakeel().toLowerCase());
    lisaTekstiOmadus(kood, PROP_OTHER_LANGUAGES, andmed.getAutoriMuudKeeled());
    lisaTekstiOmadus(kood, PROP_COUNTRY, andmed.getAutoriElukohariik());
    return kood.toString();
  }

  private TextQueryRangeParamBaseHelper createRangeBaseHelper(String table, String parameter, List<List<Integer>> values) {
    List<TextQueryRangeParamHelper> rangeHelpers = new ArrayList<>();
    for (List<Integer> value : values) {
      TextQueryRangeParamHelper helper = new TextQueryRangeParamHelper();
      helper.setStartValue(value.get(0));
      helper.setEndValue(value.get(1));
      rangeHelpers.add(helper);
    }
    return new TextQueryRangeParamBaseHelper(
      table,
      parameter,
      rangeHelpers.toArray(new TextQueryRangeParamHelper[0])
    );
  }

  private String getSanitizedFileName(String rawFileName) {
    StringBuilder stringBuilder = new StringBuilder();
    Matcher matcher = fileNameCharacterWhitelist.matcher(rawFileName);
    while (matcher.find()) {
      stringBuilder.append(matcher.group());
    }
    return stringBuilder.toString();
  }

  private String replaceNewLinesAndTabs(CorpusDownloadForm formType, String content) {
    return !BASIC_TEXT.equals(formType)
      ? content
      : content
        .replace("\\n", lineSeparator())
        .replace("\\t", "    ");
  }

  private static String booleanToJahEi(Boolean bool) {
    if (bool == null) return null;
    return bool ? "jah" : "ei";
  }

  private static void addSingleParam(List<TextQuerySingleParamHelper> helpers, String table, String parameter, String value) {
    if (isNotBlank(value)) {
      helpers.add(new TextQuerySingleParamHelper(table, parameter, value));
    }
  }

  private static void addMultiParam(List<TextQueryMultiParamHelper> helpers, String table, String parameter, Set<String> values) {
    if (values != null && !values.isEmpty()) {
      helpers.add(new TextQueryMultiParamHelper(table, parameter, values));
    }
  }

  private void lisaTekstiOmadus(UUID kood, String tunnus, String omadus) {
    if (isNotBlank(omadus)) {
      textDao.insertAddingProperty(kood, tunnus, omadus);
    }
  }

}

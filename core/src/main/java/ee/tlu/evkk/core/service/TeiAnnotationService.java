package ee.tlu.evkk.core.service;

import ee.tlu.evkk.core.service.helpers.CommonMetadataForPersonPropertyCreation;
import ee.tlu.evkk.core.service.helpers.TitleExtractionResult;
import ee.tlu.evkk.core.service.maps.TeiMappings;
import ee.tlu.evkk.dal.dao.TextDao;
import ee.tlu.evkk.dal.dto.Text;
import ee.tlu.evkk.dal.dto.TextAndMetadata;
import ee.tlu.evkk.dal.dto.TextMetadata;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static ee.tlu.evkk.core.service.constants.TeiConstants.AUTHOR;
import static ee.tlu.evkk.core.service.constants.TeiConstants.INDENT_NUMBER_ATTRIBUTE_VALUE;
import static ee.tlu.evkk.core.service.constants.TeiConstants.LEVEL;
import static ee.tlu.evkk.core.service.constants.TeiConstants.LICENCE_TARGET;
import static ee.tlu.evkk.core.service.constants.TeiConstants.LICENCE_TEXT;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_ACADEMIC_STUDY_MATERIALS;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_AGE;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_CORPUS;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_LANGUAGE_LEVEL;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_NATIVE_LANGUAGE;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_OTHER_LANGUAGES;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_SEX;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_SUPPORTING_MATERIALS;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_TEXT_LANGUAGE;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_TEXT_TYPE;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_TITLE;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_KEY_YEAR_OF_PUBLICATION;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_VALUE_ACADEMIC_ESTONIAN_CORPUS_CODE;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_VALUE_FEMALE;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_VALUE_L1_OPINION_PIECE;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_VALUE_NO;
import static ee.tlu.evkk.core.service.constants.TeiConstants.METADATA_VALUE_RUSSIAN;
import static ee.tlu.evkk.core.service.constants.TeiConstants.NAME;
import static ee.tlu.evkk.core.service.constants.TeiConstants.PARAGRAPH;
import static ee.tlu.evkk.core.service.constants.TeiConstants.PREPARED;
import static ee.tlu.evkk.core.service.constants.TeiConstants.PUBLISHER;
import static ee.tlu.evkk.core.service.constants.TeiConstants.PUBLISHER_TLU_DTI;
import static ee.tlu.evkk.core.service.constants.TeiConstants.SENTENCE;
import static ee.tlu.evkk.core.service.constants.TeiConstants.SETTING_DESCRIPTION_PARAGRAPH;
import static ee.tlu.evkk.core.service.constants.TeiConstants.SOURCE_DESCRIPTION_PARAGRAPH;
import static ee.tlu.evkk.core.service.constants.TeiConstants.SPONTANEOUS;
import static ee.tlu.evkk.core.service.constants.TeiConstants.TEI_HEADER;
import static ee.tlu.evkk.core.service.constants.TeiConstants.TITLE;
import static ee.tlu.evkk.core.service.constants.TeiConstants.TYPE;
import static ee.tlu.evkk.core.service.constants.TeiConstants.XML_NAMESPACE;
import static javax.xml.XMLConstants.FEATURE_SECURE_PROCESSING;
import static javax.xml.transform.OutputKeys.INDENT;
import static org.apache.logging.log4j.util.Strings.isNotBlank;

@Service
@RequiredArgsConstructor
public class TeiAnnotationService {

  private final TextDao textDao;
  private Document document;

  private static final Map<String, String> typeMappings = TeiMappings.getType();
  private static final Map<String, String> languageMappings = TeiMappings.getLanguage();
  private static final Map<String, String> languageCodeMappings = TeiMappings.getLanguageCode();
  private static final Map<String, String> corpusMappings = TeiMappings.getCorpus();
  private static final Map<String, String> preparednessMappings = TeiMappings.getPreparedness();
  private static final Map<String, String> ageMappings = TeiMappings.getAge();
  private static final List<CommonMetadataForPersonPropertyCreation> commonMetadataForPersonPropertyCreation = TeiMappings.getCommonMetadataForPersonPropertyCreation();

  public String getTeiAnnotationByTextId(UUID textId) {
    try {
      TextAndMetadata textAndMetadata = textDao.findTextAndMetadataById(textId);
      HashMap<String, String> metadata = getMetadataMap(textAndMetadata.getProperties());
      Element teiCorpus = createDocumentBase();
      Element teiElement = createTeiElement(metadata, textId, teiCorpus);
      createTextElement(teiElement, metadata, textId);
      return transformDocumentToString();
    } catch (TransformerException | ParserConfigurationException ex) {
      return ex.toString();
    }
  }

  private HashMap<String, String> getMetadataMap(List<TextMetadata> metadataList) {
    HashMap<String, String> metadata = new HashMap<>();
    for (TextMetadata meta : metadataList) {
      metadata.put(meta.getPropertyName(), meta.getPropertyValue());
    }
    return metadata;
  }

  private Element createDocumentBase() throws ParserConfigurationException {
    DocumentBuilderFactory documentFactory = DocumentBuilderFactory.newInstance();
    DocumentBuilder documentBuilder = documentFactory.newDocumentBuilder();
    document = documentBuilder.newDocument();

    Element teiCorpus = document.createElement("teiCorpus");
    document.appendChild(teiCorpus);
    Attr xmlNamespace = document.createAttribute("xmlns");
    xmlNamespace.setValue(XML_NAMESPACE);
    teiCorpus.setAttributeNode(xmlNamespace);
    return teiCorpus;
  }

  private Element createTeiElement(HashMap<String, String> metadata, UUID textId, Element teiCorpus) {
    Element emptyTeiHeader = document.createElement(TEI_HEADER);
    teiCorpus.appendChild(emptyTeiHeader);

    Element teiElement = document.createElement("TEI");
    teiCorpus.appendChild(teiElement);

    Element teiHeader = document.createElement(TEI_HEADER);
    Attr xmlLang = document.createAttribute("xml:lang");
    xmlLang.setValue("en");
    teiHeader.setAttributeNode(xmlLang);

    createFileDescription(teiHeader, metadata, textId);
    createProfileDescription(teiHeader, metadata);

    teiElement.appendChild(teiHeader);
    return teiElement;
  }

  private void createTextElement(Element teiElement, HashMap<String, String> metadata, UUID textId) {
    Element text = document.createElement("text");
    Element body = document.createElement("body");
    Element head = document.createElement("head");

    if (metadata.containsKey(METADATA_KEY_TITLE)) {
      head.appendChild(document.createTextNode(metadata.get(METADATA_KEY_TITLE)));
    }

    Optional<Text> textResult = textDao.findById(textId);
    if (textResult.isPresent()) {
      String rawText = textResult.get().getContent();
      rawText = rawText.replace("\\", "#");
      String[] rows = rawText.split("#n#n");
      if (rows.length == 1) {
        for (String row : rows[0].split("#n")) {
          Element paragraphElement = document.createElement(PARAGRAPH);
          Element sentenceElement = document.createElement(SENTENCE);
          sentenceElement.appendChild(document.createTextNode(row));
          paragraphElement.appendChild(sentenceElement);
          body.appendChild(paragraphElement);
        }
      } else {
        for (String paragraph : rows) {
          Element paragraphElement = document.createElement(PARAGRAPH);
          for (String row : paragraph.split("#n")) {
            Element sentenceElement = document.createElement(SENTENCE);
            sentenceElement.appendChild(document.createTextNode(row));
            paragraphElement.appendChild(sentenceElement);
          }
          body.appendChild(paragraphElement);
        }
      }
    }

    body.appendChild(head);
    text.appendChild(body);
    teiElement.appendChild(text);
  }

  private String transformDocumentToString() throws TransformerException {
    DOMSource domSource = new DOMSource(document);
    StringWriter stringWriter = new StringWriter();
    StreamResult streamResult = new StreamResult(stringWriter);
    TransformerFactory transformerFactory = TransformerFactory.newInstance();
    transformerFactory.setFeature(FEATURE_SECURE_PROCESSING, true);
    transformerFactory.setAttribute("indent-number", INDENT_NUMBER_ATTRIBUTE_VALUE);
    Transformer transformer = transformerFactory.newTransformer();
    transformer.setParameter(INDENT, "yes");
    transformer.transform(domSource, streamResult);
    return stringWriter.toString();
  }

  private void createFileDescription(Element teiHeader, HashMap<String, String> metadata, UUID textId) {
    Element fileDesc = document.createElement("fileDesc");

    TitleExtractionResult titleExtractionResult = createTitleStatement(fileDesc, metadata, textId);
    createPublicationStatement(fileDesc, metadata);
    createSourceDescription(titleExtractionResult, fileDesc, textId);

    teiHeader.appendChild(fileDesc);
  }

  private void createProfileDescription(Element teiHeader, HashMap<String, String> metadata) {
    Element profileDesc = document.createElement("profileDesc");
    String score = metadata.get("tulemus");

    createLanguageUsage(profileDesc, metadata);
    createTextDescription(profileDesc, metadata);
    createExamSpecificElements(profileDesc, score);
    createParticipationDescription(profileDesc, metadata);

    teiHeader.appendChild(profileDesc);
  }

  private TitleExtractionResult createTitleStatement(Element fileDesc, HashMap<String, String> metadata, UUID textId) {
    Element titleStmt = document.createElement("titleStmt");
    Element titleElement = document.createElement(TITLE);
    TitleExtractionResult titleExtractionResult = extractDataFromTitle(metadata, textId);
    titleElement.appendChild(document.createTextNode(titleExtractionResult.getTitle()));
    titleStmt.appendChild(titleElement);
    fileDesc.appendChild(titleStmt);

    return titleExtractionResult;
  }

  private void createPublicationStatement(Element fileDesc, HashMap<String, String> metadata) {
    Element publicationStmt = document.createElement("publicationStmt");

    if (metadata.containsKey(METADATA_KEY_YEAR_OF_PUBLICATION)) {
      publicationStmt.appendChild(createPublicationDate(metadata));
    }
    publicationStmt.appendChild(createPublicationPublisher());
    publicationStmt.appendChild(createPublicationAvailability());

    fileDesc.appendChild(publicationStmt);
  }

  private void createSourceDescription(TitleExtractionResult titleExtractionResult, Element fileDesc, UUID textId) {
    Element sourceDesc = document.createElement("sourceDesc");

    Element paragraph = document.createElement(PARAGRAPH);
    paragraph.appendChild(document.createTextNode(SOURCE_DESCRIPTION_PARAGRAPH + textId));
    sourceDesc.appendChild(paragraph);

    // = is an opinion piece
    if (isNotBlank(titleExtractionResult.getAuthor()) || isNotBlank(titleExtractionResult.getPublisher())) {
      if (isNotBlank(titleExtractionResult.getAuthor())) {
        createAdditionalFieldsForOpinionPiece(sourceDesc, AUTHOR, titleExtractionResult.getAuthor());
      }
      if (isNotBlank(titleExtractionResult.getPublisher())) {
        createAdditionalFieldsForOpinionPiece(sourceDesc, PUBLISHER, titleExtractionResult.getPublisher());
      }
    }

    fileDesc.appendChild(sourceDesc);
  }

  private void createAdditionalFieldsForOpinionPiece(Element sourceDesc, String elementName, String value) {
    Element element = document.createElement(elementName);
    element.appendChild(document.createTextNode(value));
    sourceDesc.appendChild(element);
  }

  private void createLanguageUsage(Element profileDesc, HashMap<String, String> metadata) {
    Element langUsage = document.createElement("langUsage");
    Element language = document.createElement("language");

    Attr ident = document.createAttribute("ident");

    if (metadata.containsKey(METADATA_KEY_TEXT_LANGUAGE) && metadata.get(METADATA_KEY_TEXT_LANGUAGE).equals(METADATA_VALUE_RUSSIAN)) {
      ident.setValue("ru");
      language.appendChild(document.createTextNode("Russian"));
    } else {
      ident.setValue("et");
      language.appendChild(document.createTextNode("Estonian"));
    }
    language.setAttributeNode(ident);

    if (metadata.containsKey(METADATA_KEY_LANGUAGE_LEVEL)) {
      Attr level = document.createAttribute(LEVEL);
      level.setValue(metadata.get(METADATA_KEY_LANGUAGE_LEVEL));
      language.setAttributeNode(level);
    }

    langUsage.appendChild(language);
    profileDesc.appendChild(langUsage);
  }

  private void createTextDescription(Element profileDesc, HashMap<String, String> metadata) {
    Element textDesc = document.createElement("textDesc");

    Attr attr = document.createAttribute(NAME);
    attr.setValue(typeMappings.get(metadata.get(METADATA_KEY_TEXT_TYPE)));
    textDesc.setAttributeNode(attr);

    if (metadata.containsKey(METADATA_KEY_CORPUS)) {
      createSingleDomain(textDesc, metadata.get(METADATA_KEY_CORPUS).equals(METADATA_VALUE_ACADEMIC_ESTONIAN_CORPUS_CODE) ? "academic" : "non-academic");
      createSingleDomain(textDesc, corpusMappings.get(metadata.get(METADATA_KEY_CORPUS)));
    }
    if (metadata.containsKey(METADATA_KEY_SUPPORTING_MATERIALS) && metadata.get(METADATA_KEY_SUPPORTING_MATERIALS).equals(METADATA_VALUE_NO)) {
      createSinglePreparedness(textDesc, metadata, SPONTANEOUS);
    }
    if (metadata.containsKey(METADATA_KEY_ACADEMIC_STUDY_MATERIALS)) {
      createSinglePreparedness(textDesc, metadata, PREPARED);
    }

    profileDesc.appendChild(textDesc);
  }

  private void createParticipationDescription(Element profileDesc, HashMap<String, String> metadata) {
    Element particDesc = document.createElement("particDesc");
    Element person = document.createElement("person");

    createPersonAttribute(metadata, person, METADATA_KEY_SEX, "sex", metadata.get(METADATA_KEY_SEX));
    createPersonAttribute(metadata, person, METADATA_KEY_AGE, "age", metadata.get(METADATA_KEY_AGE));
    createLanguageElement(metadata, person, METADATA_KEY_NATIVE_LANGUAGE);
    createLanguageElement(metadata, person, METADATA_KEY_OTHER_LANGUAGES);
    for (CommonMetadataForPersonPropertyCreation entry : commonMetadataForPersonPropertyCreation) {
      createCommonPersonProperty(metadata, person, entry);
    }

    particDesc.appendChild(person);
    profileDesc.appendChild(particDesc);
  }

  private void createExamSpecificElements(Element profileDesc, String score) {
    if (isNotBlank(score)) {
      profileDesc.appendChild(createTextClassification(score));
      profileDesc.appendChild(createSettingDescription());
    }
  }

  private Element createTextClassification(String score) {
    Element textClass = document.createElement("textClass");
    Element keywords = document.createElement("keywords");
    Element term = document.createElement("term");

    term.appendChild(document.createTextNode(score + "%"));

    Attr attr = document.createAttribute(TYPE);
    attr.setValue("score");
    term.setAttributeNode(attr);

    keywords.appendChild(term);
    textClass.appendChild(keywords);

    return textClass;
  }

  private Element createSettingDescription() {
    Element settingDesc = document.createElement("settingDesc");
    Element p = document.createElement(PARAGRAPH);

    p.appendChild(document.createTextNode(SETTING_DESCRIPTION_PARAGRAPH));
    settingDesc.appendChild(p);

    return settingDesc;
  }

  private TitleExtractionResult extractDataFromTitle(HashMap<String, String> metadata, UUID textId) {
    String title = metadata.getOrDefault(TITLE, textId.toString());
    String author = "";
    String publisher = "";
    boolean opinionPiece = metadata.containsKey(METADATA_KEY_TEXT_TYPE)
      && metadata.get(METADATA_KEY_TEXT_TYPE).equals(METADATA_VALUE_L1_OPINION_PIECE);

    if (opinionPiece && metadata.containsKey(TITLE)) {
      String rawTitle = metadata.get(TITLE);
      int colonIndex = rawTitle.indexOf(":");
      // cut out the author's name from before the colon
      if (colonIndex > 0) {
        author = rawTitle.substring(0, colonIndex).trim();
        rawTitle = rawTitle.substring(colonIndex + 1).trim();
      }
      int openParenIndex = rawTitle.indexOf("(");
      // cut out the publisher's name from inside the parentheses
      if (openParenIndex > 0) {
        publisher = rawTitle.substring(openParenIndex + 1);
        rawTitle = rawTitle.substring(0, openParenIndex).trim();
        publisher = publisher.trim();
        if (publisher.endsWith(")")) {
          publisher = publisher.substring(0, publisher.length() - 1);
        }
      }
      rawTitle = rawTitle.trim();
      rawTitle = rawTitle.substring(0, 1).toUpperCase() + rawTitle.substring(1);
      title = rawTitle + " (" + textId + ")";
    }
    return new TitleExtractionResult(title, author, publisher);
  }

  private Element createPublicationDate(HashMap<String, String> metadata) {
    Element date = document.createElement("date");
    Attr when = document.createAttribute("when");
    String yearOfPublication = metadata.get(METADATA_KEY_YEAR_OF_PUBLICATION);
    when.setValue(yearOfPublication);
    date.setAttributeNode(when);
    date.appendChild(document.createTextNode(yearOfPublication));
    return date;
  }

  private Element createPublicationPublisher() {
    Element publisher = document.createElement(PUBLISHER);
    publisher.appendChild(document.createTextNode(PUBLISHER_TLU_DTI));
    return publisher;
  }

  private Element createPublicationAvailability() {
    Element availability = document.createElement("availability");
    Element licence = document.createElement("licence");
    licence.appendChild(document.createTextNode(LICENCE_TEXT));

    Attr attr = document.createAttribute("target");
    attr.setValue(LICENCE_TARGET);
    licence.setAttributeNode(attr);

    availability.appendChild(licence);
    return availability;
  }

  private void createSingleDomain(Element textDesc, String value) {
    Element domain = document.createElement("domain");
    Attr type = document.createAttribute(TYPE);
    type.setValue(value);
    domain.setAttributeNode(type);
    textDesc.appendChild(domain);
  }

  private void createSinglePreparedness(Element textDesc, HashMap<String, String> metadata, String typeValue) {
    Element preparedness = document.createElement("preparedness");
    Attr type = document.createAttribute(TYPE);

    type.setValue(typeValue);
    preparedness.setAttributeNode(type);
    if (typeValue.equals(PREPARED)) {
      preparedness.appendChild(document.createTextNode(preparednessMappings.get(metadata.get(METADATA_KEY_ACADEMIC_STUDY_MATERIALS))));
    }

    textDesc.appendChild(preparedness);
  }

  private void createPersonAttribute(HashMap<String, String> metadata, Element person, String metadataKey, String keyToCreate, String value) {
    if (metadata.containsKey(metadataKey)) {
      Attr attr = document.createAttribute(keyToCreate);
      if (metadataKey.equals(METADATA_KEY_SEX)) {
        attr.setValue(value.equals(METADATA_VALUE_FEMALE) ? "female" : "male");
      } else {
        attr.setValue(ageMappings.get(value));
      }
      person.setAttributeNode(attr);
    }
  }

  private void createLanguageElement(HashMap<String, String> metadata, Element person, String metadataKey) {
    if (metadata.containsKey(metadataKey)) {
      Element langKnowledge = document.createElement("langKnowledge");
      Element langKnown = document.createElement("langKnown");

      if (metadataKey.equals(METADATA_KEY_NATIVE_LANGUAGE)) {
        Attr level = document.createAttribute(LEVEL);
        level.setValue("first");
        langKnown.setAttributeNode(level);
      }

      Attr tag = document.createAttribute("tag");
      tag.setValue(languageCodeMappings.get(metadata.get(metadataKey)));

      langKnown.setAttributeNode(tag);
      langKnown.appendChild(document.createTextNode(languageMappings.get(metadata.get(metadataKey))));

      langKnowledge.appendChild(langKnown);
      person.appendChild(langKnowledge);
    }
  }

  private void createCommonPersonProperty(HashMap<String, String> metadata, Element person, CommonMetadataForPersonPropertyCreation entry) {
    String metadataKey = entry.getMetadataKey();
    if (metadata.containsKey(metadataKey)) {
      Element element = document.createElement(entry.getKeyToCreate());
      String textNodeContent = entry.getResource().get(metadata.get(metadataKey));
      element.appendChild(document.createTextNode(textNodeContent));
      person.appendChild(element);
    }
  }

}

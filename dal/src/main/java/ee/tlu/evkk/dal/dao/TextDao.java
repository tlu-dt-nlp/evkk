package ee.tlu.evkk.dal.dao;

import ee.tlu.evkk.dal.dto.CorpusDownloadResponseEntity;
import ee.tlu.evkk.dal.dto.Text;
import ee.tlu.evkk.dal.dto.TextAndMetadata;
import ee.tlu.evkk.dal.dto.TextQueryDisjunctionParamHelper;
import ee.tlu.evkk.dal.dto.TextQueryMultiParamHelper;
import ee.tlu.evkk.dal.dto.TextQueryRangeParamBaseHelper;
import ee.tlu.evkk.dal.dto.TextQuerySingleParamHelper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Mapper
@Repository
public interface TextDao {

  String findTextsByIds(@Param("ids") List<UUID> ids);

  String findAnalysedTextsByIds(@Param("ids") List<UUID> ids);

  String findUnanalysedTextsByIds(@Param("ids") List<UUID> ids);

  TextAndMetadata findTextAndMetadataById(@Param("textId") UUID textId);

  String detailedTextQueryByParameters(@Param("multiParamHelpers") List<TextQueryMultiParamHelper> multiParamHelpers, @Param("singleParamHelpers") List<TextQuerySingleParamHelper> singleParamHelpers, @Param("rangeParamHelpers") List<TextQueryRangeParamBaseHelper> rangeParamHelpers, @Param("studyLevelAndDegreeHelper") TextQueryDisjunctionParamHelper studyLevelAndDegreeHelper, @Param("otherLangHelper") TextQuerySingleParamHelper otherLangHelper, @Param("usedMultiMaterialsHelper") TextQueryMultiParamHelper usedMultiMaterialsHelper);

  List<CorpusDownloadResponseEntity> findTextContentsAndTitlesByIds(@Param("ids") List<UUID> ids);

  List<CorpusDownloadResponseEntity> findTextTitlesAndContentsWithStanzaTaggingByIds(@Param("ids") List<UUID> ids, @Param("type") String type);

  Optional<Text> findById(@Param("id") UUID id);

  void insertAdding(@Param("id") UUID id, @Param("content") String content);

  void insertAddingProperty(@Param("id") UUID id, @Param("pname") String pname, @Param("pvalue") String pvalue);

  void updateTextContent(@Param("textId") UUID textId, @Param("content") String content);

  void deleteById(@Param("textId") UUID textId);

  UUID insertDonatedText(@Param("content") String content);

  void copyPropertiesFromDonatedText(@Param("donatedTextId") UUID donatedTextId, @Param("publishedTextId") UUID publishedTextId);
}

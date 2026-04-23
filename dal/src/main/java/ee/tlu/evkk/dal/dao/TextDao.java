package ee.tlu.evkk.dal.dao;

import ee.tlu.evkk.dal.dto.CorpusDownloadResponseEntity;
import ee.tlu.evkk.dal.dto.Text;
import ee.tlu.evkk.dal.dto.TextAndMetadata;
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

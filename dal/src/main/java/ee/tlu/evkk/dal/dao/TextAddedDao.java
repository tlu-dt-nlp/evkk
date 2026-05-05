package ee.tlu.evkk.dal.dao;

import ee.tlu.evkk.dal.dto.TextAndMetadata;
import ee.tlu.evkk.dal.dto.TextQueryMultiParamHelper;
import ee.tlu.evkk.dal.dto.TextQuerySingleParamHelper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TextAddedDao {

  Integer count();

  TextAndMetadata findTextAndMetadataById(@Param("textId") UUID textId);

  String detailedTextQueryByParameters(
    @Param("singleParamHelpers") List<TextQuerySingleParamHelper> singleParamHelpers,
    @Param("multiParamHelpers") List<TextQueryMultiParamHelper> multiParamHelpers,
    @Param("otherLangHelper") TextQuerySingleParamHelper otherLangHelper,
    @Param("includeMeta") boolean includeMeta
  );

  void updateTextContent(@Param("textId") UUID textId, @Param("content") String content);

  void deleteById(@Param("textId") UUID textId);
}

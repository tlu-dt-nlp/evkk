package ee.tlu.evkk.dal.dao;

import ee.tlu.evkk.dal.dto.TextQueryDisjunctionParamHelper;
import ee.tlu.evkk.dal.dto.TextQueryMultiParamHelper;
import ee.tlu.evkk.dal.dto.TextQueryRangeParamBaseHelper;
import ee.tlu.evkk.dal.dto.TextQuerySingleParamHelper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface TextQueryDao {

  String detailedTextQueryByParameters(
    @Param("textTable") String textTable,
    @Param("propertyTable") String propertyTable,
    @Param("includeMeta") boolean includeMeta,
    @Param("multiParamHelpers") List<TextQueryMultiParamHelper> multiParamHelpers,
    @Param("singleParamHelpers") List<TextQuerySingleParamHelper> singleParamHelpers,
    @Param("rangeParamHelpers") List<TextQueryRangeParamBaseHelper> rangeParamHelpers,
    @Param("studyLevelAndDegreeHelper") TextQueryDisjunctionParamHelper studyLevelAndDegreeHelper,
    @Param("otherLangHelper") TextQuerySingleParamHelper otherLangHelper,
    @Param("usedMultiMaterialsHelper") TextQueryMultiParamHelper usedMultiMaterialsHelper
  );
}

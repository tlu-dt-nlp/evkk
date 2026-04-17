package ee.tlu.evkk.dal.dao;

import ee.tlu.evkk.dal.dto.TextAndMetadata;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TextAddedDao {

  Integer count();

  TextAndMetadata findTextAndMetadataById(@Param("textId") UUID textId);
}

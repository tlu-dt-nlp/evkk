package ee.tlu.evkk.dal.dao;

import ee.tlu.evkk.dal.dto.TextProperty;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Mapper
@Repository
public interface TextPropertyAddedDao {

  Collection<TextProperty> findByTextId(@Param("textId") UUID textId);

  void updateProperty(@Param("id") UUID id, @Param("propertyValue") String propertyValue);

  void insertProperty(@Param("textId") UUID textId, @Param("propertyName") String propertyName, @Param("propertyValue") String propertyValue);

  void deleteByIds(@Param("ids") List<UUID> ids);
}

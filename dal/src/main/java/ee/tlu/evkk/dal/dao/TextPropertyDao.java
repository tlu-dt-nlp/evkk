package ee.tlu.evkk.dal.dao;

import ee.tlu.evkk.dal.dto.TextProperty;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.UUID;

@Mapper
@Repository
public interface TextPropertyDao {

  Collection<TextProperty> findByTextId(@Param("textId") UUID textId);
}

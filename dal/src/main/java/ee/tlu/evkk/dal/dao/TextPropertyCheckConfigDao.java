package ee.tlu.evkk.dal.dao;

import ee.tlu.evkk.dal.dto.TextPropertyCheckConfig;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface TextPropertyCheckConfigDao {

  List<TextPropertyCheckConfig> findAll();

  void upsert(@Param("propertyName") String propertyName, @Param("isActive") boolean isActive);
}

package ee.tlu.evkk.dal.dao;

import ee.tlu.evkk.dal.dto.Notice;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Mapper
@Repository
public interface NoticeDao {

  List<Notice> findAll();

  List<Notice> findActive();

  Optional<Notice> findById(@Param("id") UUID id);

  UUID insert(@Param("notice") Notice notice);

  int update(@Param("notice") Notice notice);

  int deleteById(@Param("id") UUID id);

  void updateSortOrder(@Param("id") UUID id, @Param("sortOrder") int sortOrder);

  void compactSortOrder();
}

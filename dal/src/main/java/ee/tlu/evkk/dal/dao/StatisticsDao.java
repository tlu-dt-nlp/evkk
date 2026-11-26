package ee.tlu.evkk.dal.dao;

import ee.evkk.dto.StatisticsFilterDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface StatisticsDao {

  String getStatistics(@Param("filter") StatisticsFilterDto filter);
}


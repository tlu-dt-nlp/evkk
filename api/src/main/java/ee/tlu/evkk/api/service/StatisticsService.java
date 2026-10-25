package ee.tlu.evkk.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import ee.evkk.dto.StatisticsFilterDto;
import ee.evkk.dto.StatisticsResponseDto;
import ee.tlu.evkk.dal.dao.StatisticsDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StatisticsService {

  private final StatisticsDao statisticsDao;
  private final ObjectMapper objectMapper;

  public StatisticsResponseDto getStatistics(StatisticsFilterDto filter) {
    try {
      String json = statisticsDao.getStatistics(filter);
      return objectMapper.readValue(json, StatisticsResponseDto.class);
    } catch (Exception e) {
      throw new RuntimeException("Failed to fetch statistics", e);
    }
  }
}


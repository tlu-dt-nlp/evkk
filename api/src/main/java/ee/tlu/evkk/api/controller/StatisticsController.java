package ee.tlu.evkk.api.controller;

import ee.evkk.dto.StatisticsFilterDto;
import ee.evkk.dto.StatisticsResponseDto;
import ee.tlu.evkk.api.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/statistics")
public class StatisticsController {

  private final StatisticsService statisticsService;

  @PostMapping
  public StatisticsResponseDto getStatistics(@RequestBody(required = false) StatisticsFilterDto filter) {
    return statisticsService.getStatistics(filter != null ? filter : new StatisticsFilterDto());
  }
}


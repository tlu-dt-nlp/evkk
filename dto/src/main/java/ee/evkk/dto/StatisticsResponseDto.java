package ee.evkk.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class StatisticsResponseDto {

  private int totalCount;
  private int avgWordCount;
  private int avgSentenceCount;
  private List<Integer> wordCountRange;
  private List<Integer> sentenceCountRange;
  private Map<String, List<String>> filterOptions;
  private Map<String, Map<String, Integer>> distributions;
}


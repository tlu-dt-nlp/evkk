package ee.evkk.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class StatisticsFilterDto {

  private Set<String> korpus;
  private Set<String> keeletase;
  private Set<String> sugu;
  private Set<String> kodakondsus;
  private Set<String> emakeel;
  private Set<String> haridus;
  private Set<String> tekstityyp;
  private Set<String> abivahendid;
  private Set<String> aasta;
  private Set<String> tekstikeel;
  private Integer wordCountMin;
  private Integer wordCountMax;
  private Integer sentenceCountMin;
  private Integer sentenceCountMax;
}


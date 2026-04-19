package ee.evkk.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class WordAnalyserResponseDto {

  private List<String> sonad;
  private List<String> lemmad;
  private List<String> silbid;
  private List<String> sonaliigid;
  private List<String> vormimargendid;
  private String tekst;
}

package ee.tlu.evkk.core.service.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TextWithComplexity {

  private List<String> sonad;
  private List<String> sonaliigid;
  private List<String> keerukus;
  private List<String> lemmad;
  private List<String> mitmekesisus;
  private Object keeletase;
  private Object abstraktsus;
  private Object grammatika;
  private Object speller;
  private List<String> laused;
  private List<Object> sonavara;

  @JsonAlias("grammatika_vead")
  private Object grammatikaVead;

  @JsonAlias("spelleri_vead")
  private Object spelleriVead;

  @JsonAlias("korrektori_loendid")
  private Object korrektoriLoendid;

  @JsonAlias("grammatika_test")
  private Object grammatikaTest;

  @JsonAlias("grammatika_test_vead")
  private Object grammatikaTestVead;

  @JsonAlias("margitud_laused")
  private Object margitudLaused;
}

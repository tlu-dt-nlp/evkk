package ee.evkk.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class DonatedTextRequestDto {

  private String liik;
  private Boolean oppematerjal;
  private Set<String> akadOppematerjal;
  private String akadOppematerjalMuu;
  private String mitteakadAlamliik;
  private String akadAlamliik;
  private String artikkelValjaanne;
  private String artikkelAasta;
  private String artikkelNumber;
  private String artikkelLehekyljed;
  private String tekstiAutor;
  private String autoriVanus;
  private String autoriSugu;
  private String autoriOppeaste;
  private String autoriTeaduskraad;
  private String autoriHaridus;
  private String autoriValdkond;
  private String autoriEmakeel;
  private String autoriMuudKeeled;
  private String autoriElukohariik;
}

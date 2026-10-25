package ee.evkk.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

import static java.util.Objects.isNull;

@Getter
@Setter
public class AddingRequestDto {

  @NotBlank
  private String pealkiri;
  private String kirjeldus;
  @NotBlank
  private String sisu;
  private String liik;
  private Boolean oppematerjal;
  private String[] akadOppematerjal;
  private String akadOppematerjalMuu;
  private String mitteakadAlamliik;
  private String akadAlamliik;
  private String artikkelValjaanne;
  private String artikkelAasta;
  private String artikkelNumber;
  private String artikkelLehekyljed;
  private String autoriVanus;
  private String autoriSugu;
  private String autoriOppeaste;
  private String autoriTeaduskraad;
  private String autoriHaridus;
  private String autoriValdkond;
  private String autoriEmakeel;
  private String autoriMuudKeeled;

  private String muukeel;
  private String autoriElukohariik;
  private String elukohariikMuu;

  public String getAutoriElukohariik() {
    if (isNull(autoriElukohariik)) return "";
    if (autoriElukohariik.equals("muu")) return this.elukohariikMuu;
    return autoriElukohariik;
  }
}

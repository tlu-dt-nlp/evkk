package ee.tlu.evkk.api.service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class HarIdUserResponse {

  @JsonProperty("personal_code")
  private String idCode;

  @JsonProperty("email")
  private String email;

  @JsonProperty("given_name")
  private String firstName;

  @JsonProperty("middle_name")
  private String middleName;

  @JsonProperty("family_name")
  private String lastName;

  @JsonProperty("ui_locales")
  private String uiLocales;

  public String getPureIdCode() {
    return this.idCode.split(":")[2];
  }
}

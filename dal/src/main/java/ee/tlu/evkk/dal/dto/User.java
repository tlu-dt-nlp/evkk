package ee.tlu.evkk.dal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User implements Serializable {

  private UUID userId;
  private String emailAddress;
  private String idCode;
  private String idCodePrefix;
  private String firstName;
  private String middleName;
  private String lastName;
  private String roleName;
  private String uiLocales;

  public User(String emailAddress, String idCode, String idCodePrefix, String firstName, String middleName, String lastName, String roleName, String uiLocales) {
    this.emailAddress = emailAddress;
    this.idCode = idCode;
    this.idCodePrefix = idCodePrefix;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.roleName = roleName;
    this.uiLocales = uiLocales;
  }
}

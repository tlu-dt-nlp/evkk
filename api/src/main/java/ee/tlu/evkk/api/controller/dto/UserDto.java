package ee.tlu.evkk.api.controller.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserDto {

  private String emailAddress;
  private String idCode;
  private String idCodePrefix;
  private String firstName;
  private String middleName;
  private String lastName;
  private String fullName;
  private String roleName;
  private String uiLocales;
}

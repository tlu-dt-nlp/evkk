package ee.tlu.evkk.api.controller.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.net.URI;

@Data
@NoArgsConstructor
public class UserLoginDto {

  private String refreshToken;
  private URI redirectUri;
  private boolean idCodeMissing = false;
  private boolean loginFailed = false;
  private boolean redirectToHarId = false;

  public UserLoginDto(String refreshToken) {
    this.refreshToken = refreshToken;
  }

  public static UserLoginDto setMissingIdCode(URI redirectUri) {
    UserLoginDto userLoginDto = new UserLoginDto();
    userLoginDto.setIdCodeMissing(true);
    userLoginDto.setRedirectUri(redirectUri);
    return userLoginDto;
  }

  public static UserLoginDto setFailedLogin(URI redirectUri) {
    UserLoginDto userLoginDto = new UserLoginDto();
    userLoginDto.setLoginFailed(true);
    userLoginDto.setRedirectUri(redirectUri);
    return userLoginDto;
  }

  public static UserLoginDto setHarIdRedirect(URI redirectUri) {
    UserLoginDto userLoginDto = new UserLoginDto();
    userLoginDto.setRedirectToHarId(true);
    userLoginDto.setRedirectUri(redirectUri);
    return userLoginDto;
  }
}

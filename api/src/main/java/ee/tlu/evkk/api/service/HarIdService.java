package ee.tlu.evkk.api.service;

import ee.evkk.dto.enums.Language;
import ee.tlu.evkk.api.controller.dto.UserLoginDto;
import ee.tlu.evkk.api.properties.HarIdProperties;
import ee.tlu.evkk.api.service.dto.HarIdCodeRequest;
import ee.tlu.evkk.api.service.dto.HarIdCodeResponse;
import ee.tlu.evkk.api.service.dto.HarIdUserResponse;
import ee.tlu.evkk.common.env.ServiceLocator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;

import static ee.evkk.dto.enums.Language.ET;
import static ee.tlu.evkk.api.constant.AuthConstants.HARID_AUTHENTICATION_SUCCESS_URL;
import static ee.tlu.evkk.api.constant.AuthConstants.HARID_AUTHENTICATION_URL;
import static ee.tlu.evkk.api.controller.dto.UserLoginDto.setFailedLogin;
import static ee.tlu.evkk.api.controller.dto.UserLoginDto.setHarIdRedirect;
import static ee.tlu.evkk.api.controller.dto.UserLoginDto.setMissingIdCode;
import static ee.tlu.evkk.common.env.ServiceLocator.ServiceName.EVKK_PUBLIC_API;
import static ee.tlu.evkk.common.env.ServiceLocator.ServiceName.EVKK_UI;
import static java.lang.String.format;
import static java.net.URI.create;
import static java.nio.charset.StandardCharsets.UTF_8;
import static java.util.Base64.getEncoder;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.http.RequestEntity.get;
import static org.springframework.http.RequestEntity.post;

@Service
@RequiredArgsConstructor
@Slf4j
public class HarIdService {

  private static final RestTemplate restTemplate = new RestTemplate();

  private final HarIdProperties harIdProperties;
  private final ServiceLocator serviceLocator;
  private final LoginService loginService;

  public URI getHarIdAuthenticationUri(Language language) throws URISyntaxException {
    return new URI(format(HARID_AUTHENTICATION_URL, getAuthorizationUrl(language), harIdProperties.getClientId(), getHarIdCallbackUrl()));
  }

  public UserLoginDto authenticateWithHarIdToken(String code) throws URISyntaxException {
    if (isEmpty(code)) {
      return setHarIdRedirect(new URI(format(HARID_AUTHENTICATION_URL, getAuthorizationUrl(ET), harIdProperties.getClientId(), getHarIdCallbackUrl())));
    }

    try {
      return redirectSuccess(authenticate(code, getHarIdCallbackUrl()));
    } catch (Exception e) {
      log.error("HarID login failed", e);
      return setFailedLogin(new URI(serviceLocator.locate(EVKK_UI) + "?loginFailed=true"));
    }
  }

  private String getAuthorizationUrl(Language language) {
    return format(harIdProperties.getAuthUrl(), language.toString().toLowerCase());
  }

  private String getHarIdCallbackUrl() {
    return serviceLocator.locate(EVKK_PUBLIC_API) + HARID_AUTHENTICATION_SUCCESS_URL;
  }

  private UserLoginDto authenticate(String code, String redirectUrl) throws URISyntaxException {
    HarIdCodeResponse harIdCodeResponse = getHarIdCode(code, redirectUrl);
    HarIdUserResponse harIdUserResponse = getHarIdUser(harIdCodeResponse);
    if (isBlank(harIdUserResponse.getPureIdCode())) {
      log.info("HarID user does not have an ID code");
      return setMissingIdCode(new URI(serviceLocator.locate(EVKK_UI) + "?idCodeMissing=true"));
    }
    return loginService.login(harIdUserResponse);
  }

  private UserLoginDto redirectSuccess(UserLoginDto userLoginDto) throws URISyntaxException {
    userLoginDto.setRedirectUri(new URI(serviceLocator.locate(EVKK_UI).toString()));
    userLoginDto.setRefreshToken(userLoginDto.getRefreshToken());
    return userLoginDto;
  }

  private HarIdCodeResponse getHarIdCode(String code, String redirectUrl) {
    RequestEntity<Void> request = post(create(harIdProperties.getTokenUrl() + "?" + new HarIdCodeRequest("authorization_code", redirectUrl, code)))
      .header("Authorization", "Basic " + generateAuthHeader())
      .build();

    return restTemplate.exchange(request, HarIdCodeResponse.class).getBody();
  }

  private HarIdUserResponse getHarIdUser(HarIdCodeResponse harIdCodeResponse) {
    RequestEntity<Void> request = get(create(harIdProperties.getGeneralDataUrl()))
      .header("Authorization", "Bearer " + harIdCodeResponse.getAccessToken())
      .header("Content-Type", "application/x-www-form-urlencoded")
      .accept(APPLICATION_JSON).build();

    return restTemplate.exchange(request, HarIdUserResponse.class).getBody();
  }

  private String generateAuthHeader() {
    String authHeader = format("%s:%s", harIdProperties.getClientId(), harIdProperties.getClientSecret());
    return getEncoder().encodeToString(authHeader.getBytes(UTF_8));
  }
}

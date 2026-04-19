package ee.tlu.evkk.api.controller;

import ee.evkk.dto.enums.Language;
import ee.tlu.evkk.api.controller.dto.UserLoginDto;
import ee.tlu.evkk.api.exception.TokenNotFoundException;
import ee.tlu.evkk.api.service.HarIdService;
import ee.tlu.evkk.api.service.LoginService;
import ee.tlu.evkk.api.service.interfaces.AbstractRefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URISyntaxException;

@RestController
@RequiredArgsConstructor
@RequestMapping("auth")
public class AuthController {

  private final HarIdService harIdService;
  private final AbstractRefreshTokenService refreshTokenService;
  private final LoginService loginService;

  @GetMapping("login/harid")
  public RedirectView loginWithHarId(@RequestParam Language language) throws URISyntaxException {
    return new RedirectView(harIdService.getHarIdAuthenticationUri(language).toString());
  }

  @GetMapping("login/harid/success")
  @Transactional
  public RedirectView loginWithHarIdSuccess(@RequestParam(value = "code", required = false) String code,
                                            HttpServletResponse response) throws URISyntaxException {
    UserLoginDto userLoginDto = harIdService.authenticateWithHarIdToken(code);
    return loginService.finalizeLogin(userLoginDto, response);
  }

  @PostMapping("renew")
  @Transactional
  public void renewTokens(HttpServletRequest request, HttpServletResponse response) throws TokenNotFoundException {
    refreshTokenService.renewToken(request, response);
  }

  @DeleteMapping("logout")
  @Transactional
  public void logout(HttpServletRequest request, HttpServletResponse response) throws TokenNotFoundException {
    loginService.logout(request, response);
  }
}

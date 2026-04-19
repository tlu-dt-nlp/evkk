package ee.tlu.evkk.api.service.interfaces;

import ee.tlu.evkk.api.exception.TokenNotFoundException;
import ee.tlu.evkk.dal.dto.RefreshToken;
import ee.tlu.evkk.dal.dto.User;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface AbstractRefreshTokenService {

  RefreshToken generateToken(User user);

  void renewToken(HttpServletRequest request, HttpServletResponse response) throws TokenNotFoundException;

  void revokeTokenAndRemoveCookie(HttpServletRequest request, HttpServletResponse response) throws TokenNotFoundException;

  void createCookie(String token, HttpServletResponse response);

  boolean isTokenInvalid(String token);
}

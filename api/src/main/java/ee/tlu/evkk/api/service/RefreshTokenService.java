package ee.tlu.evkk.api.service;

import ee.tlu.evkk.api.exception.TokenNotFoundException;
import ee.tlu.evkk.api.exception.UnauthorizedException;
import ee.tlu.evkk.api.service.interfaces.AbstractRefreshTokenService;
import ee.tlu.evkk.api.strategy.RefreshTokenExpirationStrategy;
import ee.tlu.evkk.dal.dao.AccessTokenDao;
import ee.tlu.evkk.dal.dao.RefreshTokenDao;
import ee.tlu.evkk.dal.dao.UserDao;
import ee.tlu.evkk.dal.dto.RefreshToken;
import ee.tlu.evkk.dal.dto.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.math.BigInteger;
import java.security.SecureRandom;

import static ee.tlu.evkk.api.constant.AuthConstants.COOKIE_HEADER_NAME;
import static ee.tlu.evkk.api.constant.AuthConstants.REFRESH_TOKEN_COOKIE_NAME;
import static ee.tlu.evkk.api.constant.AuthConstants.REFRESH_TOKEN_EXPIRES_IN_MILLISECONDS;
import static ee.tlu.evkk.api.constant.AuthConstants.REFRESH_TOKEN_EXPIRES_IN_SECONDS;
import static java.lang.String.format;
import static java.time.Instant.now;
import static java.util.Arrays.stream;

@Service
@RequiredArgsConstructor
public class RefreshTokenService implements AbstractRefreshTokenService {

  private final UserDao userDao;
  private final RefreshTokenDao refreshTokenDao;
  private final AccessTokenDao accessTokenDao;
  private final RefreshTokenExpirationStrategy refreshTokenExpirationStrategy;

  public RefreshToken generateToken(User user) {
    refreshTokenDao.deleteByUserId(user.getUserId());

    RefreshToken refreshToken = RefreshToken.builder()
      .token(new BigInteger(130, new SecureRandom()).toString(32))
      .expiresAt(now().plusMillis(REFRESH_TOKEN_EXPIRES_IN_MILLISECONDS))
      .userId(user.getUserId())
      .build();

    return refreshTokenDao.insert(refreshToken);
  }

  public void renewToken(HttpServletRequest request, HttpServletResponse response) throws TokenNotFoundException {
    RefreshToken token = refreshTokenDao.findByToken(getRefreshToken(request))
      .orElseThrow(UnauthorizedException::new);

    if (token.getExpiresAt().isBefore(now())) {
      refreshTokenDao.deleteByUserId(token.getUserId());
      throw new UnauthorizedException();
    }

    User user = userDao.findById(token.getUserId());
    createCookie(generateToken(user).getToken(), response);

    accessTokenDao.deleteByUserId(token.getUserId());
  }

  public void revokeTokenAndRemoveCookie(HttpServletRequest request, HttpServletResponse response) throws TokenNotFoundException {
    refreshTokenDao.deleteByToken(getRefreshToken(request));
    removeCookie(response);
  }

  public void createCookie(String token, HttpServletResponse response) {
    String cookie = format(
      "%s=%s; Max-Age=%d; SameSite=Strict; HttpOnly; Secure; Path=/",
      REFRESH_TOKEN_COOKIE_NAME, token, REFRESH_TOKEN_EXPIRES_IN_SECONDS
    );
    response.addHeader(COOKIE_HEADER_NAME, cookie);
  }

  public boolean isTokenInvalid(String token) {
    return refreshTokenDao.findByToken(token)
      .map(refreshTokenExpirationStrategy::isExpired)
      .orElse(true);
  }

  private void removeCookie(HttpServletResponse response) {
    String cookie = format(
      "%s=; Max-Age=0; SameSite=Strict; HttpOnly; Secure; Path=/",
      REFRESH_TOKEN_COOKIE_NAME
    );
    response.addHeader(COOKIE_HEADER_NAME, cookie);
  }

  private String getRefreshToken(HttpServletRequest request) throws TokenNotFoundException {
    if (request.getCookies() == null) throw new TokenNotFoundException();
    Cookie tokenCookie = stream(request.getCookies())
      .filter(cookie -> cookie.getName().equals(REFRESH_TOKEN_COOKIE_NAME))
      .findFirst().orElseThrow(TokenNotFoundException::new);
    return tokenCookie.getValue();
  }
}

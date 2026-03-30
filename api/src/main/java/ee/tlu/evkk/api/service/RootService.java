package ee.tlu.evkk.api.service;

import ee.tlu.evkk.api.controller.dto.StatusResponseDto;
import ee.tlu.evkk.api.converter.DtoMapper;
import ee.tlu.evkk.api.exception.TokenNotFoundException;
import ee.tlu.evkk.api.service.interfaces.AbstractAccessTokenService;
import ee.tlu.evkk.api.service.interfaces.AbstractRefreshTokenService;
import ee.tlu.evkk.common.env.ServiceLocator;
import ee.tlu.evkk.dal.dao.UserDao;
import ee.tlu.evkk.dal.dto.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import static ee.tlu.evkk.api.constant.AuthConstants.REFRESH_TOKEN_COOKIE_NAME;
import static ee.tlu.evkk.common.env.ServiceLocator.ServiceName.CLUSTER_FINDER;
import static java.util.Arrays.stream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RootService {

  private final AbstractAccessTokenService accessTokenService;
  private final AbstractRefreshTokenService refreshTokenService;
  private final UserDao userDao;
  private final ServiceLocator serviceLocator;
  private final DtoMapper dtoMapper;

  private static final String ELLE_VERSION = "26.4.1";

  @Transactional
  public StatusResponseDto getStatus(HttpServletRequest request) throws TokenNotFoundException {
    User user = getUser(request);
    String accessToken = getAccessToken(user);

    return StatusResponseDto.builder()
      .user(dtoMapper.toUserDto(user))
      .accessToken(accessToken)
      .clusterFinderIntegrationPath(serviceLocator.locate(CLUSTER_FINDER).toString())
      .version(ELLE_VERSION)
      .build();
  }

  private User getUser(HttpServletRequest request) throws TokenNotFoundException {
    var refreshToken = getRefreshToken(request);
    if (refreshToken == null || refreshTokenService.isTokenInvalid(refreshToken)) return null;

    return userDao.findByRefreshToken(refreshToken)
      .orElseThrow(TokenNotFoundException::new);
  }

  private String getAccessToken(User user) {
    if (user == null) return null;
    return accessTokenService.getAccessToken(user);
  }

  private String getRefreshToken(HttpServletRequest request) {
    if (request.getCookies() != null) {
      Cookie tokenCookie = stream(request.getCookies())
        .filter(cookie -> cookie.getName().equals(REFRESH_TOKEN_COOKIE_NAME))
        .findFirst().orElse(null);

      return tokenCookie != null
        ? tokenCookie.getValue()
        : null;
    }
    return null;
  }
}

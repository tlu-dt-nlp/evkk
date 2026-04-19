package ee.tlu.evkk.api.service;

import ee.tlu.evkk.api.service.interfaces.AbstractAccessTokenService;
import ee.tlu.evkk.api.service.interfaces.AbstractJwtTokenService;
import ee.tlu.evkk.dal.dao.AccessTokenDao;
import ee.tlu.evkk.dal.dto.AccessToken;
import ee.tlu.evkk.dal.dto.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AccessTokenService implements AbstractAccessTokenService {

  private final AbstractJwtTokenService jwtTokenService;
  private final AccessTokenDao accessTokenDao;

  public String getAccessToken(User user) {
    AccessToken existingToken = accessTokenDao.findByUserId(user.getUserId());
    if (existingToken == null || jwtTokenService.isPersistedTokenInvalid(existingToken)) {
      String token = jwtTokenService.generateToken(user);
      return saveToken(token, user.getUserId());
    }
    return existingToken.getToken();
  }

  public void revokeToken(String token) {
    accessTokenDao.deleteByToken(token);
  }

  public boolean isExistingTokenValid(String token) {
    return accessTokenDao.findByToken(token)
      .map(jwtTokenService::isTokenValid)
      .orElse(false);
  }

  private String saveToken(String token, UUID userId) {
    accessTokenDao.deleteByUserId(userId);

    AccessToken accessToken = AccessToken.builder()
      .token(token)
      .expiresAt(jwtTokenService.extractExpiration(token).toInstant())
      .userId(userId)
      .build();

    return accessTokenDao.insert(accessToken);
  }
}

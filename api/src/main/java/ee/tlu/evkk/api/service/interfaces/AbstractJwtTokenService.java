package ee.tlu.evkk.api.service.interfaces;

import ee.tlu.evkk.dal.dto.AccessToken;
import ee.tlu.evkk.dal.dto.User;

import java.util.Date;

public interface AbstractJwtTokenService {

  String generateToken(User user);

  User extractUser(String token);

  boolean isTokenValid(AccessToken accessToken);

  boolean isPersistedTokenInvalid(AccessToken token);

  Date extractExpiration(String token);
}

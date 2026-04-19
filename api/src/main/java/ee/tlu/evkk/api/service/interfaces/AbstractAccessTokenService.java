package ee.tlu.evkk.api.service.interfaces;

import ee.tlu.evkk.dal.dto.User;

public interface AbstractAccessTokenService {

  String getAccessToken(User user);

  void revokeToken(String token);

  boolean isExistingTokenValid(String token);
}

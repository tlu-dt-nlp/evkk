package ee.tlu.evkk.api.strategy;

import ee.tlu.evkk.dal.dto.RefreshToken;

public interface RefreshTokenExpirationStrategy {

  boolean isExpired(RefreshToken refreshToken);
}

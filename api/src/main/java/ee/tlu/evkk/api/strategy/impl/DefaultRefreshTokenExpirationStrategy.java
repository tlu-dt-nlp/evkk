package ee.tlu.evkk.api.strategy.impl;

import ee.tlu.evkk.api.strategy.RefreshTokenExpirationStrategy;
import ee.tlu.evkk.dal.dto.RefreshToken;
import org.springframework.stereotype.Service;

import static java.time.Instant.now;

@Service
public class DefaultRefreshTokenExpirationStrategy implements RefreshTokenExpirationStrategy {

  @Override
  public boolean isExpired(RefreshToken refreshToken) {
    return refreshToken.getExpiresAt().isBefore(now());
  }
}

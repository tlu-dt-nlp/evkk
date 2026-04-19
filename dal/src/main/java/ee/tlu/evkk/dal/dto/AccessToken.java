package ee.tlu.evkk.dal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class AccessToken {

  private UUID tokenId;
  private String token;
  private Instant expiresAt;
  private UUID userId;

  // Not unused - necessary in AccessTokenDao
  public AccessToken(String token, Instant expiresAt, UUID userId) {
    this.token = token;
    this.expiresAt = expiresAt;
    this.userId = userId;
  }
}

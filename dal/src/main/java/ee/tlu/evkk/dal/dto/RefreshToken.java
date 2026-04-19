package ee.tlu.evkk.dal.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
public class RefreshToken {

  private UUID tokenId;
  private String token;
  private Instant expiresAt;
  private UUID userId;
}

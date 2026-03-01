package ee.tlu.evkk.api.controller.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.Map;

@Getter
@Setter
@Builder
@Accessors(chain = true)
public class StatusResponseDto {

  private UserDto user;
  private String accessToken;
  private Map<String, String> integrationPaths;
  private String version;
}

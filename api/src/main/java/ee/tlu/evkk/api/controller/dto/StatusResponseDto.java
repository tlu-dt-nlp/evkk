package ee.tlu.evkk.api.controller.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.List;

@Getter
@Setter
@Builder
@Accessors(chain = true)
public class StatusResponseDto {

  private UserDto user;
  private String accessToken;
  private String clusterFinderIntegrationPath;
  private String version;
  private List<ActiveNoticeDto> notices;
}

package ee.tlu.evkk.api.controller;

import ee.tlu.evkk.api.controller.dto.StatusResponseDto;
import ee.tlu.evkk.api.converter.DtoMapper;
import ee.tlu.evkk.api.exception.TokenNotFoundException;
import ee.tlu.evkk.api.service.RootService;
import ee.tlu.evkk.common.env.ServiceLocator;
import ee.tlu.evkk.dal.dto.User;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

import static ee.tlu.evkk.common.env.ServiceLocator.ServiceName.CLUSTER_FINDER;
import static org.springframework.web.util.UriComponentsBuilder.fromUri;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class RootController {

  private final RootService rootService;
  private final ServiceLocator serviceLocator;
  private final DtoMapper dtoMapper;

  private static final String ELLE_VERSION = "25.10.1";

  @GetMapping("/status")
  @Transactional
  public StatusResponseDto status(HttpServletRequest request) throws TokenNotFoundException {
    User user = rootService.getUser(request);
    String accessToken = rootService.getAccessToken(user);
    return dtoMapper.toStatusResponseDto(dtoMapper.toUserDto(user), accessToken, buildIntegrationPaths(), ELLE_VERSION);
  }

  private Map<String, String> buildIntegrationPaths() {
    Map<String, UriComponentsBuilder> uris = new HashMap<>();
    UriComponentsBuilder clusterFinderUri = fromUri(serviceLocator.locate(CLUSTER_FINDER));
    uris.put("clusterFinder", clusterFinderUri);

    Map<String, String> result = new HashMap<>();
    for (Map.Entry<String, UriComponentsBuilder> entry : uris.entrySet())
      result.put(entry.getKey(), entry.getValue().toUriString());
    return result;
  }
}

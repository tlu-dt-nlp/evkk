package ee.tlu.evkk.core.integration;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestOperations;

import java.util.Map;

@RequiredArgsConstructor
public class CorrectorServerClient extends AbstractRestOperationsClient {

  private final RestOperations rest;

  public String[] getKorrektuur(String tekst) {
    Map<String, String> map = Map.of("tekst", tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<String[]> forEntity = retry().execute(context -> rest.postForEntity("/korrektuur", requestEntity, String[].class));
    return forEntity.getBody();
  }
}

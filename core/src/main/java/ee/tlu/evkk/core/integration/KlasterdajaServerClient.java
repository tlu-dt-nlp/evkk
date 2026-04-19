package ee.tlu.evkk.core.integration;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.web.client.RestOperations;

import java.util.Map;

@RequiredArgsConstructor
public class KlasterdajaServerClient extends AbstractRestOperationsClient {

  private final RestOperations restOperations;

  public String klasterdajaParsi(String tekst) {
    Map<String, String> body = Map.of("tekst", tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(body);
    return retry().execute(context -> restOperations.postForObject("/parsi", requestEntity, String.class));
  }
}

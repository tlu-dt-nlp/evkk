package ee.tlu.evkk.api.integration;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestOperations;

import java.net.URI;

import static org.springframework.web.util.UriComponentsBuilder.fromHttpUrl;

/**
 * @author Mikk Tarvas
 * Date: 2019-02-11
 */
@RequiredArgsConstructor
public class MinitornPikkusClient {

  private final RestOperations restOperations;

  public long getStringLengthOfCharSequence(CharSequence charSequence) {
    if (charSequence == null) throw new NullPointerException();
    String asString = charSequence.toString();
    URI uri = fromHttpUrl("http://minitorn.tlu.ee/~jaagup/oma/too/19/02/pikkus1.php").queryParam("tekst", asString).build().toUri();
    ResponseEntity<String> response = restOperations.getForEntity(uri, String.class);
    if (response.getBody() == null) throw new NullPointerException();
    return Long.parseLong(response.getBody());
  }

}

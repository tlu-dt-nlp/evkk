package ee.tlu.evkk.core.integration;

import ee.evkk.dto.TextToSpeechDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.web.client.RestOperations;

@RequiredArgsConstructor
public class TextToSpeechClient extends AbstractRestOperationsClient {

  private final RestOperations rest;

  @Value("${text-to-speech.url}")
  private String textToSpeechUrl;

  public byte[] getSpeech(TextToSpeechDto textToSpeechDto) {
    return retry().execute(context -> rest.postForEntity(
      textToSpeechUrl,
      new HttpEntity<>(textToSpeechDto),
      byte[].class
    )).getBody();
  }
}

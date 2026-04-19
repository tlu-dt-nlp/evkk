package ee.tlu.evkk.api.service;

import ee.evkk.dto.TextToSpeechDto;
import ee.tlu.evkk.core.integration.TextToSpeechClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import static java.util.Base64.getEncoder;

@Service
@RequiredArgsConstructor
public class TextToSpeechService {

  private final TextToSpeechClient textToSpeechClient;

  public byte[] generateSpeech(TextToSpeechDto textToSpeechDto) {
    byte[] audio = textToSpeechClient.getSpeech(textToSpeechDto);
    return getEncoder().encodeToString(audio).getBytes();
  }
}

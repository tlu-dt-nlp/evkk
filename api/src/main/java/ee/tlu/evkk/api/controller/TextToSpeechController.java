package ee.tlu.evkk.api.controller;

import ee.evkk.dto.TextToSpeechDto;
import ee.tlu.evkk.api.service.TextToSpeechService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequiredArgsConstructor
public class TextToSpeechController {

  private final TextToSpeechService textToSpeechService;

  @PostMapping("text-to-speech")
  public byte[] textToSpeech(@Valid @RequestBody TextToSpeechDto textToSpeechDto) {
    return textToSpeechService.generateSpeech(textToSpeechDto);
  }
}

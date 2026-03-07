package ee.tlu.evkk.api.controller;

import ee.tlu.evkk.core.integration.StanzaServerClient;
import ee.evkk.dto.CollocateRequestDto;
import ee.evkk.dto.CollocateResponseDto;
import ee.evkk.dto.WordAnalyserRequestDto;
import ee.evkk.dto.WordAnalyserResponseDto;
import ee.evkk.dto.WordContextRequestDto;
import ee.evkk.dto.WordContextResponseDto;
import ee.evkk.dto.WordlistRequestDto;
import ee.evkk.dto.WordlistResponseDto;
import ee.tlu.evkk.api.annotation.RateLimit;
import ee.tlu.evkk.api.annotation.RecordResponseTime;
import ee.tlu.evkk.api.service.CollocateService;
import ee.tlu.evkk.api.service.WordAnalyserService;
import ee.tlu.evkk.api.service.WordContextService;
import ee.tlu.evkk.api.service.WordlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.io.IOException;

import static ee.tlu.evkk.api.controller.paths.ToolsControllerPaths.COLLOCATES;
import static ee.tlu.evkk.api.controller.paths.ToolsControllerPaths.WORDANALYSER;
import static ee.tlu.evkk.api.controller.paths.ToolsControllerPaths.SPELLCHECK;
import static ee.tlu.evkk.api.controller.paths.ToolsControllerPaths.WORDCONTEXT;
import static ee.tlu.evkk.api.controller.paths.ToolsControllerPaths.WORDLIST;

import java.util.Map;

@RestController
@RequestMapping("/tools")
@RequiredArgsConstructor
public class ToolsController {

  private final WordlistService wordlistService;
  private final WordContextService wordContextService;
  private final CollocateService collocateService;
  private final WordAnalyserService wordAnalyserService;
  private final StanzaServerClient stanzaServerClient;

  @RateLimit
  @PostMapping(WORDLIST)
  public WordlistResponseDto getWordlistResponse(@RequestBody @Valid WordlistRequestDto dto) throws IOException {
    return wordlistService.getWordlistResponse(dto);
  }

  @RateLimit
  @PostMapping(WORDCONTEXT)
  public WordContextResponseDto getWordContextResponse(@RequestBody @Valid WordContextRequestDto dto) {
    return wordContextService.getWordContextResponse(dto);
  }

  @RateLimit
  @PostMapping(COLLOCATES)
  public CollocateResponseDto getCollocateResponse(@RequestBody @Valid CollocateRequestDto dto) throws IOException {
    return collocateService.getCollocateResponse(dto);
  }

  @RateLimit
  @RecordResponseTime("tools.wordanalyser")
  @PostMapping(WORDANALYSER)
  public WordAnalyserResponseDto getWordAnalyserResponse(@RequestBody @Valid WordAnalyserRequestDto dto) {
    return wordAnalyserService.getWordAnalyserResponse(dto);
  }

  @RateLimit
  @PostMapping(SPELLCHECK)
  public Object checkSpelling(@RequestBody Map<String, String> body) {
    return stanzaServerClient.getSpeller(body.get("tekst"));
  }
}

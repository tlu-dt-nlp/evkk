package ee.tlu.evkk.api.controller;

import ee.evkk.dto.AddingRequestDto;
import ee.evkk.dto.CommonTextRequestDto;
import ee.evkk.dto.CorpusDownloadDto;
import ee.evkk.dto.CorpusRequestDto;
import ee.evkk.dto.CorpusTextContentsDto;
import ee.tlu.evkk.api.annotation.RateLimit;
import ee.tlu.evkk.api.service.WordAnalyserService;
import ee.tlu.evkk.core.integration.CorrectorServerClient;
import ee.tlu.evkk.core.integration.StanzaServerClient;
import ee.tlu.evkk.core.service.TextService;
import ee.tlu.evkk.core.service.dto.TextWithComplexity;
import ee.tlu.evkk.dal.dao.TextDao;
import ee.tlu.evkk.dal.dto.TextAndMetadata;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

import static java.util.Arrays.asList;
import static java.util.UUID.fromString;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequiredArgsConstructor
@RequestMapping("/texts")
public class TextController {

  private final TextDao textDao;
  private final StanzaServerClient stanzaServerClient;
  private final CorrectorServerClient correctorServerClient;
  private final TextService textService;
  private final WordAnalyserService wordAnalyserService;

  @PostMapping("/kysitekstid")
  public String kysiTekstid(@RequestBody CorpusTextContentsDto dto) {
    return textService.getPartitionedTextResourceByIds(dto.getIds(), textDao::findTextsByIds);
  }

  @GetMapping("/kysitekstjametainfo")
  public TextAndMetadata kysiTekstJaMetainfo(String id) {
    return textDao.findTextAndMetadataById(fromString(id));
  }

  @PostMapping("/keerukus-sonaliigid-mitmekesisus")
  public ResponseEntity<TextWithComplexity> keerukusSonaliigidMitmekesisus(@RequestBody CommonTextRequestDto request) {
    return ok(textService.keerukusSonaliigidMitmekesisus(request));
  }

  @PostMapping("/sonaliik")
  public ResponseEntity<List<String>> sonaliik(@RequestBody CommonTextRequestDto request) {
    List<String> sonaliik = stanzaServerClient.getSonaliik(request.getTekst());
    List<String> body = wordAnalyserService.translateWordType(sonaliik, request.getLanguage());
    return ok(body);
  }

  @PostMapping("/silbid")
  public ResponseEntity<List<String>> silbid(@RequestBody CommonTextRequestDto request) {
    String[] silbid = stanzaServerClient.getSilbid(request.getTekst());
    List<String> body = asList(silbid);
    return ok(body);
  }

  @PostMapping("/vormimargendid")
  public ResponseEntity<List<String>> vormimargendid(@RequestBody CommonTextRequestDto request) {
    List<List<String>> vormimargendid = stanzaServerClient.getVormimargendid(request.getTekst());
    return ok(wordAnalyserService.translateFeats(vormimargendid, request.getLanguage()));
  }

  @PostMapping("/lemmad")
  public ResponseEntity<List<String>> lemmad(@RequestBody CommonTextRequestDto request) {
    String[] lemmad = stanzaServerClient.getLemmad(request.getTekst());
    List<String> body = asList(lemmad);
    return ok(body);
  }

  @PostMapping("/sonad")
  public ResponseEntity<List<String>> sonad(@RequestBody CommonTextRequestDto request) {
    String[] sonad = stanzaServerClient.getSonad(request.getTekst());
    List<String> body = asList(sonad);
    return ok(body);
  }

  @PostMapping("/laused")
  public ResponseEntity<List<String[]>> laused(@RequestBody CommonTextRequestDto request) {
    String[][] laused = stanzaServerClient.getLaused(request.getTekst());
    List<String[]> body = asList(laused);
    return ok(body);
  }

  @PostMapping("/korrektuur")
  public ResponseEntity<List<String>> korrektuur(@RequestBody CommonTextRequestDto request) {
    String[] vastus = correctorServerClient.getKorrektuur(request.getTekst());
    List<String> body = asList(vastus);
    return ok(body);
  }

  @PostMapping("/keeletase")
  public ResponseEntity<List<String[]>> keeletase(@RequestBody CommonTextRequestDto request) {
    String[][] tasemed = stanzaServerClient.getKeeletase(request.getTekst());
    List<String[]> body = asList(tasemed);
    return ok(body);
  }

  @PostMapping("/keerukus")
  public ResponseEntity<List<String>> keerukus(@RequestBody CommonTextRequestDto request) {
    String[] m = stanzaServerClient.getKeerukus(request.getTekst());
    List<String> body = asList(m);
    return ok(body);
  }

  @PostMapping("/mitmekesisus")
  public ResponseEntity<List<String>> mitmekesisus(@RequestBody CommonTextRequestDto request) {
    String[] m = stanzaServerClient.getMitmekesisus(request.getTekst());
    List<String> body = asList(m);
    return ok(body);
  }

  @PostMapping("/detailneparing")
  public ResponseEntity<String> detailneparing(@RequestBody CorpusRequestDto vaartused) {
    return ok(textService.detailneparing(vaartused));
  }

  @PostMapping("/tekstidfailina")
  public byte[] tekstidfailina(@RequestBody CorpusDownloadDto corpusDownloadDto, HttpServletResponse response) throws IOException {
    byte[] file = textService.tekstidfailina(corpusDownloadDto);
    response.setHeader("Content-Type", "application/octet-stream");
    response.setHeader("Content-Disposition", "attachment");
    return file;
  }

  @RateLimit
  @PostMapping("/lisatekst")
  public String lisatekst(@Valid @RequestBody AddingRequestDto andmed) {
    return textService.lisatekst(andmed);
  }
}

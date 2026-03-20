package ee.tlu.evkk.core.integration;

import ee.evkk.dto.SpellerResponseDto;
import ee.tlu.evkk.core.service.dto.TextWithComplexity;
import ee.tlu.evkk.dal.dto.StanzaResponseDto;
import ee.tlu.evkk.dal.dto.WordAndPosInfoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestOperations;

import java.util.List;
import java.util.Map;

import static java.util.Map.of;
import static java.util.Objects.requireNonNull;
import static org.springframework.http.HttpMethod.POST;

/**
 * @author Mikk Tarvas
 * Date: 30.09.2021
 */
@RequiredArgsConstructor
public class StanzaServerClient extends AbstractRestOperationsClient {

  private static final String MAP_PARAMETER = "tekst";
  private static final String MODEL_PARAMETER = "model";

  private final RestOperations rest;

  public StanzaResponseDto getSonadLemmadSilbidSonaliigidVormimargendid(String tekst) {
    Map<String, String> map = of(MAP_PARAMETER, tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<StanzaResponseDto> forEntity = retry()
      .execute(context -> rest.postForEntity("/sonad-lemmad-silbid-sonaliigid-vormimargendid", requestEntity, StanzaResponseDto.class));
    return forEntity.getBody();
  }

  public TextWithComplexity getKeerukusSonaliigidMitmekesisus(String tekst, String model) {
    Map<String, String> map = of(MAP_PARAMETER, tekst, MODEL_PARAMETER, model);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<TextWithComplexity> forEntity = retry()
      .execute(context -> rest.postForEntity("/keerukus-sonaliigid-mitmekesisus", requestEntity, TextWithComplexity.class));
    return forEntity.getBody();
  }

  public List<String> getSonaliik(String tekst) {
    Map<String, String> map = of(MAP_PARAMETER, tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<List<String>> forEntity = retry()
      .execute(context -> rest.exchange("/sonaliik", POST, requestEntity, new ParameterizedTypeReference<>() {}));
    return forEntity.getBody();
  }

  public String[] getSilbid(String tekst) {
    Map<String, String> map = of(MAP_PARAMETER, tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<String[]> forEntity = retry()
      .execute(context -> rest.postForEntity("/silbid", requestEntity, String[].class));
    return forEntity.getBody();
  }

  public List<List<String>> getVormimargendid(String tekst) {
    Map<String, String> map = of(MAP_PARAMETER, tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<List<List<String>>> forEntity = retry()
      .execute(context -> rest.exchange("/vormimargendid", POST, requestEntity, new ParameterizedTypeReference<>() {}));
    return forEntity.getBody();
  }

  public String[] getLemmad(String tekst) {
    Map<String, String> map = of(MAP_PARAMETER, tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<String[]> forEntity = retry()
      .execute(context -> rest.postForEntity("/lemmad", requestEntity, String[].class));
    return forEntity.getBody();
  }

  public WordAndPosInfoDto[] getLemmadJaPosInfo(String tekst) {
    Map<String, String> map = of(MAP_PARAMETER, tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<WordAndPosInfoDto[]> forEntity = retry()
      .execute(context -> rest.postForEntity("/lemmadjaposinfo", requestEntity, WordAndPosInfoDto[].class));
    return forEntity.getBody();
  }

  public String[][] getLaused(String tekst) {
    Map<String, String> map = of(MAP_PARAMETER, tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<String[][]> forEntity = retry()
      .execute(context -> rest.postForEntity("/laused", requestEntity, String[][].class));
    return forEntity.getBody();
  }

  public WordAndPosInfoDto[][] getSonadLausetenaJaPosInfo(String tekst) {
    Map<String, String> map = of(MAP_PARAMETER, tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<WordAndPosInfoDto[][]> forEntity = retry()
      .execute(context -> rest.postForEntity("/sonadlausetenajaposinfo", requestEntity, WordAndPosInfoDto[][].class));
    return forEntity.getBody();
  }

  public WordAndPosInfoDto[][] getLemmadLausetenaJaPosInfo(String tekst) {
    Map<String, String> map = of(MAP_PARAMETER, tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<WordAndPosInfoDto[][]> forEntity = retry()
      .execute(context -> rest.postForEntity("/lemmadlausetenajaposinfo", requestEntity, WordAndPosInfoDto[][].class));
    return forEntity.getBody();
  }

  public String[] getSonad(String tekst) {
    Map<String, String> map = of(MAP_PARAMETER, tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<String[]> forEntity = retry()
      .execute(context -> rest.postForEntity("/sonad", requestEntity, String[].class));
    return forEntity.getBody();
  }

  public WordAndPosInfoDto[] getSonadJaPosInfo(String tekst) {
    Map<String, String> map = of(MAP_PARAMETER, tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<WordAndPosInfoDto[]> forEntity = retry()
      .execute(context -> rest.postForEntity("/sonadjaposinfo", requestEntity, WordAndPosInfoDto[].class));
    return forEntity.getBody();
  }

  public String[] getKeerukus(String tekst) {
    Map<String, String> map = of(MAP_PARAMETER, tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<String[]> forEntity = retry()
      .execute(context -> rest.postForEntity("/keerukus", requestEntity, String[].class));
    return forEntity.getBody();
  }

  public String[] getMitmekesisus(String tekst) {
    Map<String, String> map = of(MAP_PARAMETER, tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<String[]> forEntity = retry()
      .execute(context -> rest.postForEntity("/mitmekesisus", requestEntity, String[].class));
    return forEntity.getBody();
  }

  public String[][] getKeeletase(String tekst) {
    Map<String, String> map = of(MAP_PARAMETER, tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<String[][]> forEntity = retry()
      .execute(context -> rest.postForEntity("/keeletase", requestEntity, String[][].class));
    return forEntity.getBody();
  }

  public String getStanzaConllu(String tekst, String failinimi, String keel) {
    Map<String, String> map = of(MAP_PARAMETER, tekst, "failinimi", failinimi, "keel", keel);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<String[]> forEntity = retry()
      .execute(context -> rest.postForEntity("/stanzaconllu", requestEntity, String[].class));
    return requireNonNull(forEntity.getBody())[0];
  }

  public String[] getTahedSonadLaused(String tekst, String keel) {
    Map<String, String> map = of(MAP_PARAMETER, tekst, "keel", keel);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<String[]> forEntity = retry()
      .execute(context -> rest.postForEntity("/tahedsonadlaused", requestEntity, String[].class));
    return forEntity.getBody();
  }

  public StanzaResponseDto getFullTextAnalysis(String tekst) {
    Map<String, String> map = of(MAP_PARAMETER, tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<StanzaResponseDto> forEntity = retry()
      .execute(context -> rest.postForEntity("/full-text-analysis", requestEntity, StanzaResponseDto.class));
    return forEntity.getBody();
  }

  public SpellerResponseDto getSpeller(String tekst) {
    Map<String, String> map = of(MAP_PARAMETER, tekst);
    HttpEntity<?> requestEntity = new HttpEntity<>(map);
    ResponseEntity<SpellerResponseDto> forEntity = retry()
      .execute(context -> rest.postForEntity("/speller", requestEntity, SpellerResponseDto.class));
    return forEntity.getBody();
  }
}

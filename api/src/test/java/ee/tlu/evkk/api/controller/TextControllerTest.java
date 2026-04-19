package ee.tlu.evkk.api.controller;

import ee.tlu.evkk.api.IntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static ee.tlu.evkk.api.TestUtils.readResourceAsString;
import static ee.tlu.evkk.api.TestUtils.stringArrayToJson;
import static java.nio.charset.StandardCharsets.UTF_8;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TextControllerTest extends IntegrationTest {

  @ParameterizedTest
  @CsvSource(value = {
    "/texts/silbid:SyllabificationRequest.json:SyllabificationResponse.json",
    "/texts/lemmad:LemmatizationRequest.json:LemmatizationResponse.json",
    "/texts/sonaliik:PartOfSpeechEstonianRequest.json:PartOfSpeechEstonianResponse.json",
    "/texts/sonaliik:PartOfSpeechEnglishRequest.json:PartOfSpeechEnglishResponse.json"
  }, delimiter = ':')
  @DisplayName("Test different Stanza outputs")
  void testDifferentStanzaOutputs(String urlPath, String requestPath, String responsePath) throws Exception {
    var request = readResourceAsString(requestPath);
    var response = readResourceAsString(responsePath);

    var mockResponse = mockMvc.perform(
        post(urlPath)
          .contentType(APPLICATION_JSON)
          .accept(APPLICATION_JSON)
          .content(request))
      .andExpect(status().isOk()).andReturn().getResponse().getContentAsString(UTF_8);

    var httpResourceResult = stringArrayToJson(mockResponse);
    var httpResourceExpected = stringArrayToJson(response);

    assertThat(httpResourceResult)
      .isEqualTo(httpResourceExpected);
  }
}

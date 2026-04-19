package ee.tlu.evkk.api.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

import static java.net.URLEncoder.encode;
import static java.nio.charset.StandardCharsets.UTF_8;

@Getter
@AllArgsConstructor
public class HarIdCodeRequest {

  @JsonProperty("grant_type")
  private String grantType;

  @JsonProperty("redirect_uri")
  private String redirectUri;

  @JsonProperty("code")
  private String code;

  @Override
  public String toString() {
    return "grant_type=" + this.grantType +
      "&redirect_uri=" + encode(this.redirectUri, UTF_8) +
      "&code=" + this.code;
  }
}

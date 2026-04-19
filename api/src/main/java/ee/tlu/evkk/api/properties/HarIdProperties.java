package ee.tlu.evkk.api.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "harid")
public class HarIdProperties {

  private String clientId;
  private String clientSecret;
  private String authUrl;
  private String generalDataUrl;
  private String tokenUrl;
}

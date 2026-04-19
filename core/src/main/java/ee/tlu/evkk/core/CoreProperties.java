package ee.tlu.evkk.core;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @author Mikk Tarvas
 * Date: 22.01.2022
 */
@Setter
@Getter
@ConfigurationProperties(prefix = "evkk.core")
public class CoreProperties {

  private String serviceProfile;
}

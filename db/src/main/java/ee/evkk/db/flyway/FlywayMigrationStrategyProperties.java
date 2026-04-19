package ee.evkk.db.flyway;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

/**
 * @author Mikk Tarvas
 * Date: 01/10/2019
 */
@Setter
@Getter
@ConfigurationProperties(prefix = "flyway")
public class FlywayMigrationStrategyProperties {

  private Boolean seedDisabled = false;
  private List<String> seedLocations;
  private List<String> commands;
}

package ee.tlu.evkk.api;

import ee.tlu.evkk.api.integration.MasinoppeEnnustusClient;
import ee.tlu.evkk.api.integration.MinitornPikkusClient;
import ee.tlu.evkk.core.CoreConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;

import java.nio.file.Paths;

/**
 * @author Mikk Tarvas
 * Date: 09.02.2020
 */
@Configuration
@Import(CoreConfiguration.class)
@PropertySource("classpath:/api.properties")
public class ApiConfiguration {

  @Value("${evkk.api.lib.paths.masinoppe-ennustus}")
  private String masinoppeEnnustusPath;

  @Bean
  public MasinoppeEnnustusClient masinoppeEnnustusClient() {
    return new MasinoppeEnnustusClient(Paths.get(masinoppeEnnustusPath));
  }

  @Bean
  public MinitornPikkusClient minitornPikkusClient(RestTemplateBuilder restTemplateBuilder) {
    return new MinitornPikkusClient(restTemplateBuilder.build());
  }

}

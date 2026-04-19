package ee.tlu.evkk.core;

import ee.tlu.evkk.common.env.ServiceLocator;
import ee.tlu.evkk.common.env.ServiceLocatorFactoryBean;
import ee.tlu.evkk.core.integration.CorrectorServerClient;
import ee.tlu.evkk.core.integration.KlasterdajaServerClient;
import ee.tlu.evkk.core.integration.StanzaServerClient;
import ee.tlu.evkk.core.integration.TextToSpeechClient;
import ee.tlu.evkk.dal.DalConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.client.RestTemplate;

import static ee.tlu.evkk.common.env.ServiceLocator.ServiceName.CORRECTOR_SERVER;
import static ee.tlu.evkk.common.env.ServiceLocator.ServiceName.KLASTERDAJA;
import static ee.tlu.evkk.common.env.ServiceLocator.ServiceName.STANZA_SERVER;

/**
 * @author Mikk Tarvas
 * Date: 21.01.2022
 */
@Configuration
@ComponentScan
@Import(DalConfiguration.class)
@EnableConfigurationProperties(CoreProperties.class)
@PropertySource("classpath:core.properties")
public class CoreConfiguration {

  @Bean
  public ServiceLocatorFactoryBean serviceLocatorFactoryBean(CoreProperties coreProperties) {
    return new ServiceLocatorFactoryBean(coreProperties.getServiceProfile());
  }

  @Bean
  public StanzaServerClient stanzaServerClient(ServiceLocator serviceLocator, RestTemplateBuilder restTemplateBuilder) {
    RestTemplate rest = restTemplateBuilder.rootUri(serviceLocator.locate(STANZA_SERVER).toString()).build();
    return new StanzaServerClient(rest);
  }

  @Bean
  public KlasterdajaServerClient klasterdajaServerClient(ServiceLocator serviceLocator, RestTemplateBuilder restTemplateBuilder) {
    RestTemplate rest = restTemplateBuilder.rootUri(serviceLocator.locate(KLASTERDAJA).toString()).build();
    return new KlasterdajaServerClient(rest);
  }

  @Bean
  public CorrectorServerClient correctorServerClient(ServiceLocator serviceLocator, RestTemplateBuilder restTemplateBuilder) {
    RestTemplate rest = restTemplateBuilder.rootUri(serviceLocator.locate(CORRECTOR_SERVER).toString()).build();
    return new CorrectorServerClient(rest);
  }

  @Bean
  public TextToSpeechClient textToSpeechClient() {
    return new TextToSpeechClient(new RestTemplate());
  }
}

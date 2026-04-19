package ee.tlu.evkk.common.env;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.lang.NonNull;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Properties;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @author Mikk Tarvas
 * Date: 21.01.2022
 */
@RequiredArgsConstructor
public class ServiceLocatorFactoryBean implements FactoryBean<ServiceLocator>, ApplicationContextAware {

  private final String serviceProfile;
  private ApplicationContext applicationContext;

  @Override
  public ServiceLocator getObject() throws Exception {
    Map<String, String> servicePaths = loadServicePaths();
    return ServiceLocator.create(servicePaths);
  }

  @Override
  public Class<?> getObjectType() {
    return ServiceLocator.class;
  }

  private Map<String, String> loadServicePaths() throws IOException {
    Resource resource = applicationContext.getResource("classpath:/services/" + serviceProfile + ".properties");
    EncodedResource encodedResource = new EncodedResource(resource, StandardCharsets.UTF_8);
    Properties properties = PropertiesLoaderUtils.loadProperties(encodedResource);
    Environment environment = applicationContext.getEnvironment();
    return properties.stringPropertyNames().stream()
      .collect(Collectors.toUnmodifiableMap(Function.identity(), name -> environment.resolveRequiredPlaceholders(properties.getProperty(name))));
  }

  @Override
  public void setApplicationContext(@NonNull ApplicationContext applicationContext) {
    this.applicationContext = applicationContext;
  }

}

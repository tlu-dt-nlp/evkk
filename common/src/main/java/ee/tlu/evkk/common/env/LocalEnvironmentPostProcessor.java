package ee.tlu.evkk.common.env;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.CompositePropertySource;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePropertySource;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Stream;

import static java.nio.file.FileVisitOption.FOLLOW_LINKS;
import static java.util.Arrays.stream;
import static java.util.Collections.unmodifiableMap;
import static java.util.Optional.empty;
import static java.util.regex.Pattern.compile;
import static java.util.stream.Collectors.toUnmodifiableList;

/**
 * This post-processor will do the following:
 * <ul>
 *  <li>Reads files from /run/secrets/ directory and adds them as a property source (file name is property name, file content is property value)</li>
 *  <li>If conf/ directory is found, registers parent directory of conf/ as "rootDir" property</li>
 *  <li>If conf/ directory is found, loads local_*.env files from said directory into property sources</li>
 * </ul>
 * <p>
 * Must be registered via /resources/META-INF/spring.factories
 *
 * @author Mikk Tarvas
 * Date: 27.10.2019
 */
public final class LocalEnvironmentPostProcessor implements EnvironmentPostProcessor {

  private static final String SECRETS_DIRECTORY = "/run/secrets/";
  private static final String[] CONF_DIR_CANDIDATES = new String[]{"./conf/", "./../conf/", "./../../conf/"};
  private static final Pattern ENV_FILE_PATTERN = compile("^local_.+\\.env$");

  @Override
  public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
    try {
      MutablePropertySources propertySources = environment.getPropertySources();
      createPropertySources().forEach(propertySources::addLast);
    } catch (IOException ex) {
      throw new UncheckedIOException("Unable to create property sources", ex);
    }
  }

  private List<PropertySource<?>> createPropertySources() throws IOException {
    Path confDir = findConfDir().orElse(null);
    List<PropertySource<?>> propertySources = new ArrayList<>(3);
    readSecrets().ifPresent(propertySources::add);
    createLocalDevProperties(confDir).ifPresent(propertySources::add);
    readLocalEnvFiles(confDir).ifPresent(propertySources::add);
    return propertySources;
  }

  private Optional<Path> findConfDir() {
    return stream(CONF_DIR_CANDIDATES).map(Path::of).filter(Files::exists).filter(Files::isDirectory).findFirst();
  }

  private Optional<PropertySource<?>> createLocalDevProperties(Path confDir) throws IOException {
    HashMap<String, Object> source = new HashMap<>();
    if (confDir != null) source.put("rootDir", confDir.getParent().toRealPath().toString());
    // Additional properties can be added here if needed
    if (source.isEmpty()) return empty();
    MapPropertySource result = new MapPropertySource("localDevProperties", unmodifiableMap(source));
    return Optional.of(result);
  }

  private Optional<PropertySource<?>> readSecrets() throws IOException {
    Path secretsDirectory = Path.of(SECRETS_DIRECTORY);
    if (!Files.isDirectory(secretsDirectory)) return empty();

    try (Stream<Path> stream = Files.list(secretsDirectory)) {
      List<Path> secrets = stream.collect(toUnmodifiableList());
      if (secrets.isEmpty()) return empty();

      Map<String, Object> map = new HashMap<>(secrets.size());
      for (Path secret : secrets) {
        String secretName = secret.getFileName().toString().strip();
        String secretValue = Files.readString(secret).strip();
        map.put(secretName, secretValue);
      }

      MapPropertySource result = new MapPropertySource("Secrets loaded from: " + secretsDirectory, unmodifiableMap(map));
      return Optional.of(result);
    }
  }

  private Optional<PropertySource<?>> readLocalEnvFiles(Path confDir) throws IOException {
    if (confDir == null) return empty();

    CompositePropertySource propertySource = new CompositePropertySource("local_*.env files loaded from: " + confDir.toRealPath());
    try (Stream<Path> stream = Files.find(confDir, Integer.MAX_VALUE,
      (path, attributes) -> ENV_FILE_PATTERN.matcher(path.getFileName().toString()).matches(), FOLLOW_LINKS)) {
      stream.sorted(Comparator.comparing(Path::getFileName))
        .map(FileSystemResource::new).map(LocalEnvironmentPostProcessor::newResourcePropertySource)
        .forEachOrdered(propertySource::addPropertySource);
    }

    if (propertySource.getPropertySources().isEmpty()) return empty();
    return Optional.of(propertySource);
  }

  private static ResourcePropertySource newResourcePropertySource(Resource resource) {
    try {
      return new ResourcePropertySource(resource);
    } catch (IOException ex) {
      throw new UncheckedIOException("Unable to load properties from: " + resource, ex);
    }
  }

}

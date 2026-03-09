package ee.tlu.evkk.common.env;

import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import static java.util.Collections.unmodifiableMap;

/**
 * @author Mikk Tarvas
 * Date: 21.01.2022
 */
@RequiredArgsConstructor
public class ServiceLocator {

  private final Map<ServiceName, URI> serviceUris;

  static ServiceLocator create(Map<String, String> servicePaths) {
    HashMap<ServiceName, URI> serviceUris = new HashMap<>(servicePaths.size());
    for (Map.Entry<String, String> entry : servicePaths.entrySet()) {
      ServiceName serviceName = ServiceName.valueOf(entry.getKey());
      URI serviceUri = URI.create(entry.getValue());
      serviceUris.put(serviceName, serviceUri);
    }
    return new ServiceLocator(unmodifiableMap(serviceUris));
  }

  @NonNull
  public URI locate(ServiceName serviceName) {
    URI serviceUri = serviceUris.get(serviceName);
    if (serviceUri == null) throw new IllegalStateException("Unable to locate service: " + serviceName);
    return serviceUri;
  }

  public enum ServiceName {
    EVKK_PUBLIC_API,
    EVKK_UI,
    STANZA_SERVER,
    CLUSTER_FINDER,
    KLASTERDAJA,
    CORRECTOR_SERVER
  }
}

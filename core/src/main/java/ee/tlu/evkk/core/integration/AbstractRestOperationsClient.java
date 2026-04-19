package ee.tlu.evkk.core.integration;

import org.springframework.retry.RetryOperations;
import org.springframework.retry.backoff.UniformRandomBackOffPolicy;
import org.springframework.retry.policy.SimpleRetryPolicy;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.web.client.ResourceAccessException;

import java.util.Map;

/**
 * @author Mikk Tarvas
 * Date: 22.01.2022
 */
public abstract class AbstractRestOperationsClient {

  private final RetryOperations retry;

  protected AbstractRestOperationsClient() {
    this.retry = createRetry();
  }

  protected RetryOperations retry() {
    return retry;
  }

  private static RetryOperations createRetry() {
    UniformRandomBackOffPolicy backOffPolicy = new UniformRandomBackOffPolicy();
    backOffPolicy.setMinBackOffPeriod(1000L);
    backOffPolicy.setMaxBackOffPeriod(2000L);

    SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy(5, Map.of(ResourceAccessException.class, true));

    RetryTemplate retryTemplate = new RetryTemplate();
    retryTemplate.setThrowLastExceptionOnExhausted(true);
    retryTemplate.setBackOffPolicy(backOffPolicy);
    retryTemplate.setRetryPolicy(retryPolicy);

    return retryTemplate;
  }

}

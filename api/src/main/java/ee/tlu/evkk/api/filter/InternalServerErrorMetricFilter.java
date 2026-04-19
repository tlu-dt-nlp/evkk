package ee.tlu.evkk.api.filter;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static javax.servlet.http.HttpServletResponse.SC_INTERNAL_SERVER_ERROR;

@Component
public class InternalServerErrorMetricFilter extends OncePerRequestFilter {

  private final Counter internalServerErrorCounter;

  public InternalServerErrorMetricFilter(MeterRegistry registry) {
    internalServerErrorCounter = registry.counter("http.errors.500.total", "status", "500");
  }

  @Override
  protected void doFilterInternal(@NonNull HttpServletRequest request,
                                  @NonNull HttpServletResponse response,
                                  @NonNull FilterChain filterChain) throws ServletException, IOException {
    filterChain.doFilter(request, response);
    if (response.getStatus() == SC_INTERNAL_SERVER_ERROR) {
      internalServerErrorCounter.increment();
    }
  }
}

package ee.tlu.evkk.api.aspect;

import ee.tlu.evkk.api.annotation.RateLimit;
import ee.tlu.evkk.api.aspect.impl.RateLimiter;
import ee.tlu.evkk.api.exception.RateLimitExceededException;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static java.util.concurrent.TimeUnit.SECONDS;
import static org.apache.commons.lang3.StringUtils.isBlank;

@Aspect
@Component
@RequiredArgsConstructor
public class RateLimitAspect {

  private final HttpServletRequest request;
  private final Map<String, RateLimiter> limiters = new ConcurrentHashMap<>();

  @Before("@annotation(rateLimit) && execution(public * *(..))")
  public void rateLimit(RateLimit rateLimit) throws RateLimitExceededException {
    String key = generateKey();
    RateLimiter limiter = limiters.computeIfAbsent(
      key,
      k -> new RateLimiter(rateLimit.limit(), rateLimit.timeFrame(), SECONDS)
    );

    if (!limiter.tryAcquire()) {
      throw new RateLimitExceededException();
    }
  }

  private String generateKey() {
    String clientIp = getClientIp(request);
    return "rate-limit-" + clientIp;
  }

  private String getClientIp(HttpServletRequest request) {
    String remoteAddr = request.getHeader("X-Forwarded-For");
    if (isBlank(remoteAddr)) {
      remoteAddr = request.getRemoteAddr();
    } else {
      // In case of multiple IPs, take the first one
      remoteAddr = remoteAddr.split(",")[0];
    }
    return remoteAddr;
  }
}

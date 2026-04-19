package ee.tlu.evkk.api.aspect;

import ee.tlu.evkk.api.annotation.RecordResponseTime;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import static io.micrometer.core.instrument.Timer.builder;
import static io.micrometer.core.instrument.Timer.start;

@Aspect
@Component
@RequiredArgsConstructor
public class ResponseTimeAspect {

  private final MeterRegistry meterRegistry;

  @Around("@annotation(recordResponseTime)")
  public Object measureResponseTime(ProceedingJoinPoint joinPoint, RecordResponseTime recordResponseTime) throws Throwable {
    Timer.Sample sample = start(meterRegistry);

    try {
      return joinPoint.proceed();
    } finally {
      sample.stop(builder(recordResponseTime.value())
        .register(meterRegistry));
    }
  }
}

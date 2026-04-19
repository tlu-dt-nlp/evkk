package ee.tlu.evkk.api.aspect.impl;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public class RateLimiter {

  private final AtomicInteger permits;
  private final int maxPermits;
  private final ScheduledExecutorService scheduler;

  public RateLimiter(int maxPermits, long timeFrame, TimeUnit timeUnit) {
    this.permits = new AtomicInteger(maxPermits);
    this.maxPermits = maxPermits;
    this.scheduler = Executors.newScheduledThreadPool(1);
    this.scheduler.scheduleAtFixedRate(this::refill, timeFrame, timeFrame, timeUnit);
  }

  public boolean tryAcquire() {
    return permits.getAndUpdate(perms -> perms > 0 ? perms - 1 : perms) > 0;
  }

  private void refill() {
    permits.set(maxPermits);
  }

  public void shutdown() {
    scheduler.shutdown();
  }
}

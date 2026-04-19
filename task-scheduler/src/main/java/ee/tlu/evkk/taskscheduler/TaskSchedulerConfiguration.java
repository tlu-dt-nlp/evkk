package ee.tlu.evkk.taskscheduler;

import ee.tlu.evkk.core.CoreConfiguration;
import ee.tlu.evkk.taskscheduler.task.TextProcessingTask;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import static java.lang.Boolean.TRUE;

/**
 * @author Mikk Tarvas
 * Date: 20.01.2022
 */
@Configuration
@PropertySource("classpath:task-scheduler.properties")
@Import(CoreConfiguration.class)
@EnableScheduling
@EnableConfigurationProperties(TaskSchedulerConfiguration.Properties.class)
@Slf4j
@RequiredArgsConstructor
public class TaskSchedulerConfiguration {

  private final Properties properties;
  private final TextProcessingTask textProcessingTask;

  private static final long FIXED_DELAY = 30000L; // 30 seconds
  private static final long INITIAL_DELAY = 300000L; // 5 minutes

  @Scheduled(fixedDelay = FIXED_DELAY, initialDelay = INITIAL_DELAY)
  public void processTexts() {
    if (properties.getTextProcessingEnabled() != TRUE) {
      log.info("TextProcessingTask is not enabled");
      return;
    }
    textProcessingTask.execute().join();
  }

  @ConfigurationProperties("evkk.task-scheduler")
  @Getter
  @Setter
  public static class Properties {

    private Boolean textProcessingEnabled;
  }

}

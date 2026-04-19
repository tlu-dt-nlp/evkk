package ee.tlu.evkk.taskscheduler.task;

import ee.tlu.evkk.core.service.TextProcessorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.boot.task.TaskExecutorBuilder;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * @author Mikk Tarvas
 * Date: 22.01.2022
 */
@Component
@RequiredArgsConstructor
public class TextProcessingTaskFactoryBean implements FactoryBean<TextProcessingTask> {

  private final TaskExecutorBuilder taskExecutorBuilder;
  private final TextProcessorService textProcessorService;
  private final PlatformTransactionManager platformTransactionManager;

  @Override
  public TextProcessingTask getObject() {
    ThreadPoolTaskExecutor executor = taskExecutorBuilder
      .threadNamePrefix("TextProcessingTask-")
      .corePoolSize(10)
      .build();
    executor.initialize();

    TransactionTemplate transactionTemplate = new TransactionTemplate(platformTransactionManager);
    transactionTemplate.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
    transactionTemplate.setIsolationLevel(TransactionDefinition.ISOLATION_DEFAULT);
    transactionTemplate.setReadOnly(false);

    return new TextProcessingTask(executor, transactionTemplate, textProcessorService);
  }

  @Override
  public Class<?> getObjectType() {
    return TextProcessingTask.class;
  }
}

package ee.evkk.db.flyway;

import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.configuration.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

import javax.annotation.Nonnull;
import java.util.Arrays;
import java.util.List;

import static java.util.Collections.unmodifiableList;
import static org.springframework.jdbc.datasource.init.DatabasePopulatorUtils.execute;

/**
 * @author Mikk Tarvas
 * Date: 01/10/2019
 */
@Slf4j
public class FlywayDatabaseSeeder {

  private final List<Resource> resources;
  private final TransactionTemplate transactionTemplate;

  public FlywayDatabaseSeeder(List<Resource> resources, TransactionTemplate transactionTemplate) {
    this.resources = unmodifiableList(resources);
    this.transactionTemplate = transactionTemplate;
  }

  public void seed(Flyway flyway) {
    Configuration configuration = flyway.getConfiguration();

    // Transform resources
    ResourceTransformer resourceTransformer = new ResourceTransformer(flyway);
    Resource[] transformed = this.resources.stream().map(resourceTransformer::transform).toArray(Resource[]::new);

    // Create populator
    ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
    populator.setScripts(transformed);
    populator.setSqlScriptEncoding(configuration.getEncoding().name());

    // Execute
    log.info("Execute database seed using resources: {}", Arrays.toString(transformed));
    executeInTransaction(() -> execute(populator, configuration.getDataSource()));
  }

  private void executeInTransaction(Runnable runnable) {
    transactionTemplate.execute(new TransactionCallbackWithoutResult() {
      @Override
      protected void doInTransactionWithoutResult(@Nonnull TransactionStatus status) {
        runnable.run();
      }
    });
  }

}

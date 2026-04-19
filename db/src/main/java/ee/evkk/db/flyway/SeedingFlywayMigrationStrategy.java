package ee.evkk.db.flyway;

import ee.tlu.evkk.common.jdbc.ConnectionPoller;
import lombok.extern.slf4j.Slf4j;
import org.flywaydb.core.Flyway;
import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;

import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

/**
 * @author Mikk Tarvas
 * Date: 01/10/2019
 */
@Slf4j
public class SeedingFlywayMigrationStrategy implements FlywayMigrationStrategy {

  private static final Map<String, Consumer<Flyway>> COMMAND_MAP;

  static {
    COMMAND_MAP = Map.of(
      "migrate", Flyway::migrate,
      "clean", Flyway::clean,
      "info", Flyway::info,
      "validate", Flyway::validate,
      "baseline", Flyway::baseline,
      "undo", Flyway::baseline,
      "repair", Flyway::repair
    );
  }

  private final List<String> commands;
  private final FlywayDatabaseSeeder flywayDatabaseSeeder;
  private final boolean seedDisabled;
  private final ConnectionPoller connectionPoller;

  public SeedingFlywayMigrationStrategy(List<String> commands, FlywayDatabaseSeeder flywayDatabaseSeeder, boolean seedDisabled, ConnectionPoller connectionPoller) {
    this.commands = commands;
    this.flywayDatabaseSeeder = flywayDatabaseSeeder;
    this.seedDisabled = seedDisabled;
    this.connectionPoller = connectionPoller;
  }

  @Override
  public void migrate(Flyway flyway) {
    connectionPoller.poll();
    boolean hasCommands = !(commands == null || commands.isEmpty());
    if (!hasCommands) throw new IllegalStateException("No commands provided for flyway");
    else for (String commandName : commands) executeCommandByName(commandName, flyway);
  }

  protected void executeCommandByName(String commandName, Flyway flyway) {
    Consumer<Flyway> command = findCommandByName(commandName);
    log.info("Executing command: {}", commandName);
    command.accept(flyway);
  }

  private Consumer<Flyway> findCommandByName(String commandName) {
    if (isSeedCommand(commandName)) {
      return flywayDatabaseSeeder::seed;
    } else {
      if (!COMMAND_MAP.containsKey(commandName)) throw new IllegalArgumentException("Unknown command: " + commandName);
      return COMMAND_MAP.get(commandName);
    }
  }

  private boolean isSeedCommand(String commandName) {
    boolean isSeedCommand = "seed".equals(commandName);
    if (isSeedCommand && seedDisabled) throw new IllegalStateException("Command: " + commandName + " not enabled");
    return isSeedCommand;
  }

}

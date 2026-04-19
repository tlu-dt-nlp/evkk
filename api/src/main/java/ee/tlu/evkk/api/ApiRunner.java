package ee.tlu.evkk.api;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @author Mikk Tarvas
 * Date: 09.02.2020
 */
@SpringBootApplication
public class ApiRunner implements CommandLineRunner {

  public static void main(String[] args) {
    SpringApplication.run(ApiRunner.class, args);
  }

  @Override
  public void run(String... args) {
    // This method will be executed after the application context is loaded.
    // Future startup logic can be added here.
  }

}

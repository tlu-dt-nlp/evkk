package ee.tlu.evkk.api.integration;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;

/**
 * @author Mikk Tarvas
 * Date: 09.02.2020
 */
@Slf4j
@RequiredArgsConstructor
public class MasinoppeEnnustusClient {

  private final Path workingDirectory;

  public String execute(CharSequence charSequence) throws IOException, InterruptedException {
    if (charSequence == null) throw new NullPointerException();
    ProcessBuilder builder = new ProcessBuilder();
    builder.directory(workingDirectory.toFile());
    builder.command("java", "-jar", "me.jar", "-pt", charSequence.toString());

    Process process = builder.start();
    int exitCode = process.waitFor();

    if (exitCode != 0) {
      String error;
      try (InputStream is = process.getErrorStream()) {
        error = new String(is.readAllBytes(), StandardCharsets.UTF_8);
      }

      if (!error.isBlank()) {
        log.error(error);
      }

      throw new IllegalStateException("Process returned non-zero exit code: " + exitCode);
    }

    String response;
    try (InputStream is = process.getInputStream()) {
      response = new String(is.readAllBytes(), StandardCharsets.UTF_8);
    }

    return response;
  }

}

package ee.tlu.evkk.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.NoArgsConstructor;
import org.springframework.core.io.ClassPathResource;

import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.io.InputStream;

import static java.lang.String.format;
import static java.nio.charset.StandardCharsets.UTF_8;
import static lombok.AccessLevel.PRIVATE;
import static org.springframework.util.StreamUtils.copyToString;

@NoArgsConstructor(access = PRIVATE)
public class TestUtils {

  private static final ObjectMapper objectMapper = new ObjectMapper();

  public static String readResourceAsString(@NotNull String path) throws IOException {
    ClassPathResource resource = new ClassPathResource(path);
    if (!resource.exists()) {
      throw new RuntimeException(format("Resource not found from path %s.", path));
    }
    try (InputStream stream = resource.getInputStream()) {
      return readFromStream(stream);
    }
  }

  public static JsonNode stringArrayToJson(@NotNull String content) throws JsonProcessingException {
    return objectMapper.readTree(content
      .replace("\n", "")
      .replace(" ", ""));
  }

  private static String readFromStream(InputStream inputStream) throws IOException {
    return copyToString(inputStream, UTF_8);
  }
}

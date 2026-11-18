package ee.tlu.evkk.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import ee.tlu.evkk.core.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Runs against the real (local) database. Every test runs in a transaction that is rolled back afterward,
 * so tests never leave data behind. Code that commits on its own (e.g. a new thread or REQUIRES_NEW) is not rolled back.
 */
@Transactional
@EnableConfigurationProperties
@TestPropertySource("classpath:api.properties")
@AutoConfigureMockMvc
@SpringBootTest
public abstract class IntegrationTest {

  @Autowired
  public MockMvc mockMvc;

  @Autowired
  public ObjectMapper objectMapper;

  @MockBean
  @SuppressWarnings("UnusedDeclaration")
  protected GeminiService geminiService;

  public String json(Object value) throws Exception {
    return objectMapper.writeValueAsString(value);
  }
}

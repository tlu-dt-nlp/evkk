package ee.tlu.evkk.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@EnableConfigurationProperties
@TestPropertySource("classpath:api.properties")
@AutoConfigureMockMvc
@SpringBootTest
public abstract class IntegrationTest {

  @Autowired
  public MockMvc mockMvc;
}

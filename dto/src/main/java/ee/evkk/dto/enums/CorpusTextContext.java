package ee.evkk.dto.enums;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public enum CorpusTextContext {
  DONATED("core.text_added", "core.text_property_added"),
  PUBLISHED("core.text", "core.text_property");

  private final String textTable;
  private final String propertyTable;
}

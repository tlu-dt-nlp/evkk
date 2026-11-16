package ee.evkk.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LanguageDetectionResponseDto {
  private String keel;
  private double toenaosus;
}

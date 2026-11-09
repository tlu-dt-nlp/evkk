package ee.evkk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class TextDetailsResponseDto {

  private final String text;
  private final List<TextMetadataDto> properties;
}

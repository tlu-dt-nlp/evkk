package ee.evkk.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class TextsToReviewResponseDto {

  private final Integer count;
}

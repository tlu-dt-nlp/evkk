package ee.evkk.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class TextUpdateRequestDto {

  private String text;

  @NotNull
  @Valid
  private List<TextMetadataDto> properties;
}

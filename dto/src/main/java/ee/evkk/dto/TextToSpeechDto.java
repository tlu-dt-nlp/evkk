package ee.evkk.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TextToSpeechDto {

  @NotBlank
  private String text;
  @NotNull
  private String speaker;
  @NotNull
  private double speed;
}

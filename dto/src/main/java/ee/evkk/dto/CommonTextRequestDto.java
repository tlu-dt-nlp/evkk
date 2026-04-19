package ee.evkk.dto;

import ee.evkk.dto.enums.Language;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommonTextRequestDto {

  private String tekst;
  private String model;
  private Language language;
}

package ee.tlu.evkk.api.text.extractor.ex;

import ee.tlu.evkk.api.exception.AbstractBusinessException;
import lombok.Getter;

@Getter
public class UnsupportedMimeTypeException extends AbstractBusinessException {

  @Override
  public String getCode() {
    return "UnsupportedMimeType";
  }
}

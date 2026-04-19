package ee.tlu.evkk.dal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class WordAndPosInfoDto implements Serializable {

  private String word;

  @JsonProperty("start_char")
  private int startChar;

  @JsonProperty("end_char")
  private int endChar;

  public void increaseChars(int amount) {
    this.startChar += amount;
    this.endChar += amount;
  }
}

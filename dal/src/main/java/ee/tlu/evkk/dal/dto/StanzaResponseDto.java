package ee.tlu.evkk.dal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StanzaResponseDto implements Serializable {

  private List<String> sonad;
  private List<String> lemmad;
  private List<String> silbid;
  private List<String> sonaliigid;
  private List<List<String>> vormimargendid;

  @JsonProperty("sonad_lausetena_ja_pos_info")
  private List<List<WordAndPosInfoDto>> sonadLausetenaJaPosInfo;

  @JsonProperty("lemmad_lausetena_ja_pos_info")
  private List<List<WordAndPosInfoDto>> lemmadLausetenaJaPosInfo;

  @JsonProperty("sonad_ja_pos_info")
  private List<WordAndPosInfoDto> sonadJaPosInfo;

  @JsonProperty("lemmad_ja_pos_info")
  private List<WordAndPosInfoDto> lemmadJaPosInfo;

  @JsonProperty("char_count")
  private int charCount;

  @JsonProperty("text_id")
  private UUID textId;
}

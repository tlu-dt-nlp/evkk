package ee.evkk.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class KeeletaseGrammatikaOigekiriAnaluusResponseDto {

  private KeeletasemedResponseDto keeletasemed;
  private int oigekirjavigu;
  private int grammatikavigu;
  private Analuus analuus;

  @Data
  @NoArgsConstructor
  private static class KeeletasemedResponseDto {

    private String keerukus;
    private String grammatika;
    private String sonavara;
  }

  @Data
  @NoArgsConstructor
  private static class Analuus {

    private List<Sentence> sentences;
    private Metadata metadata;

    @Data
    @NoArgsConstructor
    private static class Sentence {

      private String text;

      @JsonProperty("word_count")
      private int wordCount;

      private List<Word> words;

      @Data
      @NoArgsConstructor
      private static class Word {

        private String word;
        private String lemma;
        private String upos;
        private List<String> feats;

        @JsonProperty("start_char")
        private int startChar;

        @JsonProperty("end_char")
        private int endChar;

        private String deprel;
      }
    }

    @Data
    @NoArgsConstructor
    private static class Metadata {

      @JsonProperty("total_words")
      private int totalWords;

      @JsonProperty("total_sentences")
      private int totalSentences;
    }
  }
}

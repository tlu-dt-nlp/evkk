package ee.evkk.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class ExerciseGeneratorAnalysis {

  private List<Sentence> sentences;
  private Metadata metadata;

  @Data
  public static class Sentence {

    private String text;
    private List<Word> words;

    @JsonProperty("word_count")
    private int wordCount;
  }

  @Data
  public static class Word {

    private String word;
    private String lemma;
    private String upos;
    private List<String> feats;
    private String deprel;

    @JsonProperty("start_char")
    private int startChar;

    @JsonProperty("end_char")
    private int endChar;
  }

  @Data
  public static class Metadata {

    @JsonProperty("total_words")
    private int totalWords;

    @JsonProperty("total_sentences")
    private int totalSentences;
  }
}

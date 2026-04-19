package ee.evkk.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
public class CorpusRequestDto {

  private Set<String> corpuses;
  private Set<String> types;
  private String language;
  private String level;
  private String domain;
  private String usedMaterials;
  private Set<String> usedMultiMaterials;
  private String age;
  private String gender;
  private String education;
  private String studyLevel;
  private String degree;
  private String nativeLang;
  private String otherLang;
  private String nationality;
  private String country;
  private Set<String> scores;
  private Set<String> addedYears;
  private List<List<Integer>> characters;
  private List<List<Integer>> words;
  private List<List<Integer>> sentences;
}

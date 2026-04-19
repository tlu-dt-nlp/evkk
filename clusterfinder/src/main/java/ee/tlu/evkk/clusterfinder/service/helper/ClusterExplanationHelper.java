package ee.tlu.evkk.clusterfinder.service.helper;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static ee.tlu.evkk.clusterfinder.constants.FilteringConstants.CLAUSE_TYPE_SEPARATOR;

@Component
public class ClusterExplanationHelper
{
  private final String PUNCTUATION_MARKUP_KEY = "Z";

  private final Map< String, String > clusterTextsMap;

  public ClusterExplanationHelper(Map< String, String> clusterTextsMap)
  {
    this.clusterTextsMap = clusterTextsMap;
  }

  /**
   * Retrieves a list of explanations for the given list of markups.
   *
   * @param markups
   * @param isSyntactic
   * @param isMorfological
   * @param includePunctuation
   * @return A list of explanations that correspond to the given list of markups.
   */
  public List< String > getExplanation(List<String> markups, boolean isSyntactic, boolean isMorfological, boolean includePunctuation)
  {
    boolean isMorfoSyntactic = isMorfological && isSyntactic;

    if (isMorfoSyntactic)
    {
      return getMorfoSyntacticExplanation(markups);
    }
    else if (isSyntactic)
    {
      return getSyntacticExplanation(markups);
    }
    else if (isMorfological && includePunctuation)
    {
      return getMorfologicalExplanation(markups);
    }
    else
    {
      return getConcreteExplanation(markups);
    }
  }

  /**
   * Retrieves a list of syntactic explanations for the given list of markups.
   *
   * If multiple syntactic markups are present then all of the syntactic markups are parsed separately
   * and the output of the explanation is formatted as follows:
   *
   * {syntactic_part_1}/{syntactic_part_2}
   *
   * Some examples of different outputs:
   *
   * @SUBJ => alus
   * @SUBJ @OBJ => alus/sihitis
   * @SUBJ @OBJ @PRD => alus/sihitis/öeldistäide
   *
   *
   * @param markups
   * @return A list of syntactic markup explanations.
   */
  private List< String > getSyntacticExplanation(List<String> markups)
  {
    List< String > markupExplanations = new ArrayList<>();

    for (String markup: markups)
    {
      if (hasMultipleSyntacticMarkups(markup))
      {
        markupExplanations.add(joinMarkups(markup.split(" "), "/", false));
      }
      else
      {
        markupExplanations.add(clusterTextsMap.get(markup));
      }
    }

    return markupExplanations;
  }

  /**
   * Retrieves a list of morfosyntactic explanations for the given list of markups. Explanations
   * are formatted as follows:
   *
   * {morfological_part} // {syntactic_part}
   *
   * If multiple syntactic markups are present then all of the syntactic markups are parsed separately
   * and the output of the explanation is formatted as follows:
   *
   * {morfological_part} // {syntactic_part_1}/{syntactic_part_2}
   *
   * Some examples of different outputs:
   *
   * V aux inf // @SUBJ => abitegusõna, da-tegevusnimi // alus
   * V aux inf // @SUBJ @OBJ => abitegusõna, da-tegevusnimi // alus/sihitis
   * V aux inf // @SUBJ @OBJ @PRD => abitegusõna, da-tegevusnimi // alus/sihitis/öeldistäide
   *
   * @param markups
   * @return A list of syntactic markup explanations.
   */
  private List<String> getMorfoSyntacticExplanation(List<String> markups)
  {
    List< String > markupExplanations = new ArrayList<>();

    for (String markup: markups)
    {
      String[] splitMarkup = markup.split(CLAUSE_TYPE_SEPARATOR);
      if (splitMarkup.length > 1 && hasMultipleSyntacticMarkups(splitMarkup[1]))
      {
        markupExplanations.add(joinMarkups(splitMarkup, "//", true));
      }
      else if (splitMarkup.length == 1)
      {
        markupExplanations.add(clusterTextsMap.get(markup.replace("//", "").trim()));
      }
      else
      {
        markupExplanations.add(clusterTextsMap.get(markup));
      }
    }

    return markupExplanations;
  }

  /**
   * Retrieves a list of morfological explanations for the given list of markups.
   *
   * NOTE! This method is used currently as a workaround for punctuation issues.
   *
   * @param markups
   * @return A list of morfological markup explanations.
   */
  private List<String> getMorfologicalExplanation(List<String> markups)
  {
    List< String > markupExplanations = new ArrayList<>();

    for (String markup: markups)
    {
      if (StringUtils.isBlank(markup))
      {
        markupExplanations.add(clusterTextsMap.get(PUNCTUATION_MARKUP_KEY));
      }
      else
      {
        markupExplanations.add(clusterTextsMap.get(markup));
      }
    }

    return markupExplanations;
  }

  private String joinMarkups(String[] splitMarkup, String separator, boolean morfoSyntactic)
  {
    if (morfoSyntactic)
    {
      String morfologicalPart = clusterTextsMap.get(splitMarkup[0].trim());
      String syntacticalPart = Arrays.stream(splitMarkup[1].trim().split(" "))
              .map(clusterTextsMap::get)
              .collect(Collectors.joining("/"));

      return morfologicalPart + StringUtils.SPACE + separator + StringUtils.SPACE + syntacticalPart;
    }

    return Arrays.stream(splitMarkup)
            .map(clusterTextsMap::get)
            .collect(Collectors.joining(separator));
  }

  private boolean hasMultipleSyntacticMarkups(String markup)
  {
    return markup.trim().split(" ").length > 1;
  }

  private List<String> getConcreteExplanation(List<String> markups)
  {
    return markups.stream()
              .map(clusterTextsMap::get)
              .collect(Collectors.toList());
  }
}

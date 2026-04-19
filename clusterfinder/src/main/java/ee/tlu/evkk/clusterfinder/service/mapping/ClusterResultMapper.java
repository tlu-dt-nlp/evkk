package ee.tlu.evkk.clusterfinder.service.mapping;

import ee.tlu.evkk.clusterfinder.model.ClusterSearchForm;
import ee.tlu.evkk.clusterfinder.service.helper.ClusterExplanationHelper;
import ee.tlu.evkk.clusterfinder.service.helper.FilteringHelper;
import ee.tlu.evkk.clusterfinder.service.model.ClusterEntry;
import ee.tlu.evkk.clusterfinder.service.model.ClusterResult;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class ClusterResultMapper
{
  private static final int MARKUP_START_INDEX = 1;

  private static final int USAGES_START_INDEX_OFFSET = 2;

  private final ClusterExplanationHelper clusterExplanationHelper;

  public ClusterResultMapper(ClusterExplanationHelper clusterExplanationHelper)
  {
    this.clusterExplanationHelper = clusterExplanationHelper;
  }

  public ClusterResult mapResults(String clusteredText, ClusterSearchForm searchForm)
  {
    if ( clusteredText == null || clusteredText.isEmpty() )
    {
      return ClusterResult.EMPTY;
    }

    return new ClusterResult(getEntries(clusteredText, searchForm), determineSeparator(searchForm));
  }

  private List<ClusterEntry> getEntries(String clusteredText, ClusterSearchForm searchForm)
  {
    return Arrays.stream(clusteredText.split("\n"))
                 .map(c -> c.split(";"))
                 .map(clusterRow -> mapToEntry(clusterRow, searchForm.getAnalysisLength(), searchForm.isSyntacticAnalysis(), searchForm.isMorfoAnalysis(), searchForm.isIncludePunctuation()))
                 .filter(Objects::nonNull)
                 .filter(entry -> FilteringHelper.filterEntries(entry, searchForm))
                 .collect(Collectors.toList());
  }


  private String determineSeparator(ClusterSearchForm searchForm)
  {
    return searchForm.isMorfoSyntacticAnalysis() || searchForm.isMorfoAnalysis() ? ", " : " + ";
  }

  private ClusterEntry mapToEntry(String[] clusterRow, int clusterLength, boolean isSyntactic, boolean isMorfological, boolean includePunctuation)
  {
    if ( clusterRow.length == 0 )
    {
      return null;
    }

    int frequency = Integer.parseInt(clusterRow[0].replaceAll("\\s",""));
    List<String> markups = getMarkups(clusterRow, clusterLength);
    List<String> explanations = getDescriptions(markups, isSyntactic, isMorfological, includePunctuation);
    List<String> usages = getUsages(clusterRow, clusterLength);

    return new ClusterEntry(frequency, markups, explanations, usages);
  }

  private List<String> getMarkups(String[] clusterRow, int clusterLength)
  {
    return Arrays.asList(clusterRow)
                 .subList(MARKUP_START_INDEX, MARKUP_START_INDEX + clusterLength)
                 .stream()
                 .map(String::trim)
                 .map(this::replaceNonEssentialMarkup)
                 .collect(Collectors.toList());
  }

  private List<String> getDescriptions(List<String> markups, boolean isSyntactic, boolean isMorfological, boolean includePunctuation)
  {
    return clusterExplanationHelper.getExplanation(markups, isSyntactic, isMorfological, includePunctuation);
  }

  private List<String> getUsages(String[] clusterRow, int clusterLength)
  {
    return Arrays.asList(clusterRow)
                 .subList(clusterLength + USAGES_START_INDEX_OFFSET, clusterRow.length)
                 .stream()
                 .map(String::trim)
                 .collect(Collectors.toList());
  }

  private String replaceNonEssentialMarkup(String markup)
  {
    return markup.replace("<redacted>", "").replace("\"", "").trim();
  }
}

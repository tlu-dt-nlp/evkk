package ee.tlu.evkk.api.service;

import ee.evkk.dto.WordlistRequestDto;
import ee.evkk.dto.WordlistResponseDto;
import ee.evkk.dto.WordlistResponseEntryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import static ee.evkk.dto.enums.WordType.WORDS;
import static ee.tlu.evkk.api.util.FileUtils.readResourceAsString;
import static ee.tlu.evkk.common.util.TextUtils.sanitizeLemmaStrings;
import static ee.tlu.evkk.common.util.TextUtils.sanitizeWordStrings;
import static java.math.BigDecimal.valueOf;
import static java.math.RoundingMode.UP;
import static java.util.Arrays.asList;
import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class WordlistService {

  private final StanzaAnalysisService stanzaAnalysisService;

  public WordlistResponseDto getWordlistResponse(WordlistRequestDto dto) throws IOException {
    List<String> wordlist = WORDS.equals(dto.getType())
      ? sanitizeWordStrings(stanzaAnalysisService.getSonad(dto))
      : sanitizeLemmaStrings(stanzaAnalysisService.getLemmad(dto));
    if (!dto.isKeepCapitalization()) {
      wordlist = wordlist.stream().map(String::toLowerCase).collect(toList());
    }
    Map<String, Long> frequencyCounts = getFrequencyCount(wordlist);
    Map<String, BigDecimal> frequencyPercentages = getFrequencyPercentages(wordlist, frequencyCounts);
    return new WordlistResponseDto(
      filteredWordlistResponse(dto, wordlist, frequencyCounts, frequencyPercentages),
      wordlist
    );
  }

  private List<WordlistResponseEntryDto> filteredWordlistResponse(WordlistRequestDto dto, List<String> wordlist, Map<String, Long> frequencyCounts, Map<String, BigDecimal> frequencyPercentages) throws IOException {
    List<String> defaultStopwords = new ArrayList<>(asList(readResourceAsString("Stopwords.txt").split(",")));
    List<String> customStopwords = dto.getCustomStopwords() != null
      ? new ArrayList<>(dto.getCustomStopwords())
      : new ArrayList<>();
    List<String> customStopwordsLower = customStopwords
      .stream().map(String::toLowerCase)
      .collect(toList());

    return new HashSet<>(wordlist).stream()
      .filter(dto.isExcludeStopwords()
        ? word -> !defaultStopwords.contains(word.toLowerCase())
        : word -> true)
      .filter(dto.getCustomStopwords() != null
        ? word -> !isCustomStopword(word, customStopwords, customStopwordsLower, dto)
        : word -> true)
      .filter(dto.getMinFrequency() != null
        ? word -> frequencyCounts.get(word) >= dto.getMinFrequency()
        : word -> true)
      .map(word -> new WordlistResponseEntryDto(word, frequencyCounts.get(word), frequencyPercentages.get(word)))
      .collect(toList());
  }

  private boolean isCustomStopword(String word, List<String> stopwords, List<String> stopwordsLower, WordlistRequestDto dto) {
    return dto.isKeepCapitalization()
      ? stopwords.contains(word)
      : stopwordsLower.contains(word);
  }

  private Map<String, Long> getFrequencyCount(List<String> wordlist) {
    Map<String, Long> counts = new HashMap<>();
    for (String word : wordlist) {
      if (counts.get(word) != null) {
        counts.replace(word, counts.get(word) + 1);
      } else {
        counts.put(word, 1L);
      }
    }
    return counts;
  }

  private Map<String, BigDecimal> getFrequencyPercentages(List<String> wordlist, Map<String, Long> frequencyCounts) {
    Map<String, BigDecimal> percentages = new HashMap<>();
    long wordCount = wordlist.size();
    for (Map.Entry<String, Long> entry : frequencyCounts.entrySet()) {
      BigDecimal percentage = valueOf((entry.getValue() * 100.0) / wordCount).setScale(2, UP);
      percentages.put(entry.getKey(), percentage);
    }
    return percentages;
  }
}

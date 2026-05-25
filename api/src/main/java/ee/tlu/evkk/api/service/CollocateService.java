package ee.tlu.evkk.api.service;

import ee.evkk.dto.CollocateDto;
import ee.evkk.dto.CollocateOccurrencesDto;
import ee.evkk.dto.CollocateRequestDto;
import ee.evkk.dto.CollocateResponseDto;
import ee.evkk.dto.WordlistRequestDto;
import ee.evkk.dto.WordlistResponseDto;
import ee.evkk.dto.WordlistResponseEntryDto;
import ee.evkk.dto.enums.CollocateFormula;
import ee.evkk.dto.enums.WordType;
import ee.tlu.evkk.core.integration.StanzaServerClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static ee.evkk.dto.enums.CollocateFormula.LOGDICE;
import static ee.evkk.dto.enums.CollocateFormula.MI_SCORE;
import static ee.evkk.dto.enums.CollocateFormula.T_SCORE;
import static ee.evkk.dto.enums.WordType.LEMMAS;
import static ee.evkk.dto.enums.WordType.WORDS;
import static ee.tlu.evkk.common.util.TextUtils.sanitizeLemmaStrings;
import static java.lang.Math.log;
import static java.lang.Math.sqrt;
import static java.math.BigDecimal.valueOf;
import static java.math.RoundingMode.UP;
import static java.util.Arrays.asList;
import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class CollocateService {

  private final StanzaServerClient stanzaServerClient;
  private final WordlistService wordlistService;

  public CollocateResponseDto getCollocateResponse(CollocateRequestDto dto) {
    String keyword = dto.isKeepCapitalization()
      ? dto.getKeyword()
      : dto.getKeyword().toLowerCase();

    return WORDS.equals(dto.getType())
      ? wordResponse(dto, keyword)
      : lemmaResponse(dto, keyword);
  }

  private CollocateResponseDto wordResponse(CollocateRequestDto dto, String keyword) {
    WordlistResponseDto wordlistResponse = getWordlistResponse(dto, WORDS);
    Map<String, CollocateOccurrencesDto> collocates = getCollocates(wordlistResponse.getWordlist(), keyword, dto.getSearchCount());

    return combineFinalResult(collocates, wordlistResponse.getResultList(), keyword, dto.getFormula(), null);
  }

  private CollocateResponseDto lemmaResponse(CollocateRequestDto dto, String keyword) {
    String initialKeyword = null;
    WordlistResponseDto wordlistResponse = getWordlistResponse(dto, LEMMAS);
    Map<String, CollocateOccurrencesDto> collocates = getCollocates(wordlistResponse.getWordlist(), keyword, dto.getSearchCount());

    if (collocates.isEmpty()) {
      initialKeyword = dto.getKeyword();
      keyword = sanitizeLemmaStrings(asList(stanzaServerClient.getLemmad(initialKeyword))).get(0);
      if (!keyword.equalsIgnoreCase(initialKeyword)) {
        collocates = getCollocates(wordlistResponse.getWordlist(), keyword, dto.getSearchCount());
      }
    }

    return combineFinalResult(collocates, wordlistResponse.getResultList(), keyword, dto.getFormula(), initialKeyword);
  }

  private CollocateResponseDto combineFinalResult(Map<String, CollocateOccurrencesDto> collocates, List<WordlistResponseEntryDto> wordlistAndFrequencies, String keyword, CollocateFormula formula, String initialKeyword) {
    List<CollocateDto> results = new ArrayList<>();

    for (Map.Entry<String, CollocateOccurrencesDto> collocate : collocates.entrySet()) {
      WordlistResponseEntryDto keywordFromFrequencyList = wordlistAndFrequencies.stream()
        .filter(entry -> entry.getWord().equals(keyword))
        .collect(toList()).get(0);
      WordlistResponseEntryDto collocateFromFrequencyList = wordlistAndFrequencies.stream()
        .filter(entry -> entry.getWord().equals(collocate.getKey()))
        .collect(toList()).get(0);

      BigDecimal score = calculateScore(
        formula,
        keywordFromFrequencyList.getFrequencyCount(),
        collocateFromFrequencyList.getFrequencyCount(),
        collocate.getValue().getOccurrences(),
        wordlistAndFrequencies.size()
      ).setScale(2, UP);

      results.add(new CollocateDto(
        collocate.getKey(),
        score,
        collocate.getValue().getOccurrences(),
        collocateFromFrequencyList.getFrequencyCount(),
        collocateFromFrequencyList.getFrequencyPercentage(),
        collocate.getValue().getLeftOccurrences(),
        collocate.getValue().getRightOccurrences()
      ));
    }

    String lemmatizedKeyword = initialKeyword == null
      ? null
      : keyword;

    return new CollocateResponseDto(results, initialKeyword, lemmatizedKeyword);
  }

  private Map<String, CollocateOccurrencesDto> getCollocates(List<String> wordlist, String keyword, int searchCount) {
    Map<String, CollocateOccurrencesDto> result = new HashMap<>();
    for (int i = 0; i < wordlist.size(); i++) {
      if (wordlist.get(i).equals(keyword)) {
        int counter = i;
        while (counter > i - searchCount) {
          counter--;
          try {
            String collocate = wordlist.get(counter);
            CollocateOccurrencesDto dto = result.getOrDefault(collocate, new CollocateOccurrencesDto(0L, 0L, 0L));
            dto.setOccurrences(dto.getOccurrences() + 1);
            dto.setLeftOccurrences(dto.getLeftOccurrences() + 1);
            result.put(collocate, dto);
          } catch (IndexOutOfBoundsException e) {
            break;
          }
        }
        counter = i;
        while (counter < i + searchCount) {
          counter++;
          try {
            String collocate = wordlist.get(counter);
            CollocateOccurrencesDto dto = result.getOrDefault(collocate, new CollocateOccurrencesDto(0L, 0L, 0L));
            dto.setOccurrences(dto.getOccurrences() + 1);
            dto.setRightOccurrences(dto.getRightOccurrences() + 1);
            result.put(collocate, dto);
          } catch (IndexOutOfBoundsException e) {
            break;
          }
        }
      }
    }
    return result;
  }

  private BigDecimal calculateScore(CollocateFormula formula, long keywordOccurrences, long collocateOccurrences, long coOccurrences, long totalWordCount) {
    if (LOGDICE.equals(formula)) {
      return valueOf(14 + (log((double) (2 * coOccurrences) / (keywordOccurrences + collocateOccurrences)) / log(2)));
    } else if (T_SCORE.equals(formula)) {
      return valueOf((coOccurrences - ((double) (keywordOccurrences * collocateOccurrences) / totalWordCount)) / sqrt(coOccurrences));
    } else if (MI_SCORE.equals(formula)) {
      return valueOf(log((double) (coOccurrences * totalWordCount) / keywordOccurrences * collocateOccurrences) / log(2));
    }
    return valueOf(0);
  }

  private WordlistResponseDto getWordlistResponse(CollocateRequestDto dto, WordType wordType) {
    WordlistRequestDto wordlistDto = WordlistRequestDto.builder()
      .corpusTextIds(dto.getCorpusTextIds())
      .ownTexts(dto.getOwnTexts())
      .type(wordType)
      .excludeStopwords(false)
      .customStopwords(null)
      .keepCapitalization(dto.isKeepCapitalization())
      .minFrequency(1)
      .build();

    return wordlistService.getWordlistResponse(wordlistDto);
  }
}

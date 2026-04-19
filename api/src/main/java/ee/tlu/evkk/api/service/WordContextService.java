package ee.tlu.evkk.api.service;

import ee.evkk.dto.WordContextDto;
import ee.evkk.dto.WordContextRequestDto;
import ee.evkk.dto.WordContextResponseDto;
import ee.tlu.evkk.core.integration.StanzaServerClient;
import ee.tlu.evkk.core.service.TextService;
import ee.tlu.evkk.dal.dto.WordAndPosInfoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static ee.evkk.dto.enums.WordContextType.SENTENCE;
import static ee.evkk.dto.enums.WordType.LEMMAS;
import static ee.evkk.dto.enums.WordType.WORDS;
import static ee.tlu.evkk.api.util.WordContextUtils.getWordAndPosInfoByIndexFromSentencelist;
import static ee.tlu.evkk.api.util.WordContextUtils.getWordAndPosInfoByIndexFromWordlist;
import static ee.tlu.evkk.api.util.WordContextUtils.removeCapitalization;
import static ee.tlu.evkk.api.util.WordContextUtils.removeCapitalizationInList;
import static ee.tlu.evkk.api.util.WordContextUtils.sanitizeLemmaList;
import static ee.tlu.evkk.api.util.WordContextUtils.sanitizeLemmas;
import static ee.tlu.evkk.common.util.TextUtils.sanitizeLemmaStrings;
import static java.util.Arrays.asList;

@Service
@RequiredArgsConstructor
public class WordContextService {

  private final StanzaAnalysisService stanzaAnalysisService;
  private final StanzaServerClient stanzaServerClient;
  private final TextService textService;

  public WordContextResponseDto getWordContextResponse(WordContextRequestDto dto) {
    String sanitizedTextContent = textService.combineCorpusTextIdsAndOwnText(dto.getCorpusTextIds(), dto.getOwnTexts());
    if (SENTENCE.equals(dto.getDisplayType())) {
      List<List<WordAndPosInfoDto>> sentencelist = WORDS.equals(dto.getType())
        ? removeCapitalizationInList(stanzaAnalysisService.getSonadLausetenaJaPosInfo(dto), dto.isKeepCapitalization())
        : removeCapitalizationInList(sanitizeLemmaList(stanzaAnalysisService.getLemmadLausetenaJaPosInfo(dto)), false);
      return generateResponseForSentences(sentencelist, dto, sanitizedTextContent);
    } else {
      List<WordAndPosInfoDto> wordlist = WORDS.equals(dto.getType())
        ? removeCapitalization(stanzaAnalysisService.getSonadJaPosInfo(dto), dto.isKeepCapitalization())
        : removeCapitalization(sanitizeLemmas(stanzaAnalysisService.getLemmadJaPosInfo(dto)), false);
      return generateResponseForWords(wordlist, dto, sanitizedTextContent);
    }
  }

  private WordContextResponseDto generateResponseForSentences(List<List<WordAndPosInfoDto>> sentencelist, WordContextRequestDto dto, String sanitizedTextContent) {
    List<WordContextDto> initialList = generateContextListForSentences(sentencelist, dto, sanitizedTextContent);
    if (initialList.isEmpty() && LEMMAS.equals(dto.getType())) {
      String initialKeyword = dto.getKeyword();
      String sanitizedLemmatizedKeyword = sanitizeLemmaStrings(asList(stanzaServerClient.getLemmad(initialKeyword))).get(0);
      if (!sanitizedLemmatizedKeyword.equalsIgnoreCase(initialKeyword)) {
        dto.setKeyword(sanitizedLemmatizedKeyword.toLowerCase());
        List<WordContextDto> newList = generateContextListForSentences(sentencelist, dto, sanitizedTextContent);
        return new WordContextResponseDto(newList, initialKeyword, sanitizedLemmatizedKeyword);
      }
    }
    return new WordContextResponseDto(initialList, null, null);
  }

  private List<WordContextDto> generateContextListForSentences(List<List<WordAndPosInfoDto>> sentencelist, WordContextRequestDto dto, String sanitizedTextContent) {
    List<WordContextDto> result = new ArrayList<>();
    for (int i = 0; i < sentencelist.size(); i++) {
      for (int j = 0; j < sentencelist.get(i).size(); j++) {
        String keyword = dto.isKeepCapitalization() && WORDS.equals(dto.getType())
          ? dto.getKeyword()
          : dto.getKeyword().toLowerCase();

        if (sentencelist.get(i).get(j).getWord().equals(keyword)) {
          int contextBeforeStart = getWordAndPosInfoByIndexFromSentencelist(sentencelist, i, dto.getDisplayCount(), false).getStartChar();
          int contextBeforeEnd = sentencelist.get(i).get(j).getStartChar();
          int contextAfterStart = sentencelist.get(i).get(j).getEndChar();
          int contextAfterEnd = getWordAndPosInfoByIndexFromSentencelist(sentencelist, i, dto.getDisplayCount(), true).getEndChar() + 1;

          result.add(new WordContextDto(
            sanitizedTextContent.substring(contextBeforeEnd, contextAfterStart),
            sanitizedTextContent.substring(contextBeforeStart, contextBeforeEnd),
            sanitizedTextContent.substring(contextAfterStart, contextAfterEnd)
          ));
        }
      }
    }
    return result;
  }

  private WordContextResponseDto generateResponseForWords(List<WordAndPosInfoDto> wordlist, WordContextRequestDto dto, String sanitizedTextContent) {
    List<WordContextDto> initialList = generateContextListForWords(wordlist, dto, sanitizedTextContent);
    if (initialList.isEmpty() && LEMMAS.equals(dto.getType())) {
      String initialKeyword = dto.getKeyword();
      String sanitizedLemmatizedKeyword = sanitizeLemmaStrings(asList(stanzaServerClient.getLemmad(initialKeyword))).get(0);
      if (!sanitizedLemmatizedKeyword.equalsIgnoreCase(dto.getKeyword())) {
        dto.setKeyword(sanitizedLemmatizedKeyword.toLowerCase());
        List<WordContextDto> newList = generateContextListForWords(wordlist, dto, sanitizedTextContent);
        return new WordContextResponseDto(newList, initialKeyword, sanitizedLemmatizedKeyword);
      }
    }
    return new WordContextResponseDto(initialList, null, null);
  }

  private List<WordContextDto> generateContextListForWords(List<WordAndPosInfoDto> wordlist, WordContextRequestDto dto, String sanitizedTextContent) {
    List<WordContextDto> result = new ArrayList<>();
    for (int i = 0; i < wordlist.size(); i++) {
      String keyword = dto.isKeepCapitalization() && WORDS.equals(dto.getType())
        ? dto.getKeyword()
        : dto.getKeyword().toLowerCase();

      if (wordlist.get(i).getWord().equals(keyword)) {
        int contextBeforeStart = getWordAndPosInfoByIndexFromWordlist(wordlist, i, dto.getDisplayCount(), false).getStartChar();
        int contextBeforeEnd = wordlist.get(i).getStartChar();
        int contextAfterStart = wordlist.get(i).getEndChar();
        int contextAfterEnd = getWordAndPosInfoByIndexFromWordlist(wordlist, i, dto.getDisplayCount(), true).getEndChar() + 1;
        contextAfterEnd = contextAfterEnd <= sanitizedTextContent.length()
          ? contextAfterEnd
          : contextAfterEnd - 1;

        result.add(new WordContextDto(
          sanitizedTextContent.substring(contextBeforeEnd, contextAfterStart).trim(),
          sanitizedTextContent.substring(contextBeforeStart, contextBeforeEnd).trim(),
          sanitizedTextContent.substring(contextAfterStart, contextAfterEnd).trim()
        ));
      }
    }
    return result;
  }
}

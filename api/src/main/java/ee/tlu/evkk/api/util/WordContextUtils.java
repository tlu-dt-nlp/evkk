package ee.tlu.evkk.api.util;

import ee.tlu.evkk.dal.dto.WordAndPosInfoDto;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import static java.util.Arrays.stream;
import static java.util.stream.Collectors.toList;
import static lombok.AccessLevel.PRIVATE;

@Component
@NoArgsConstructor(access = PRIVATE)
public class WordContextUtils {

  public static List<WordAndPosInfoDto> removeCapitalization(List<WordAndPosInfoDto> words, boolean keepCapitalization) {
    return keepCapitalization
      ? words
      : words.stream().map(word -> {
          if (word == null || word.getWord() == null) {
            return null;
          }

          word.setWord(word.getWord().toLowerCase());
          return word;
        })
        .filter(Objects::nonNull)
        .collect(toList());
  }

  public static List<List<WordAndPosInfoDto>> removeCapitalizationInList(List<List<WordAndPosInfoDto>> words, boolean keepCapitalization) {
    return words.stream()
      .map(subWords -> removeCapitalization(subWords, keepCapitalization))
      .collect(toList());
  }

  public static List<WordAndPosInfoDto> sanitizeLemmas(List<WordAndPosInfoDto> lemmas) {
    return lemmas.stream()
      .map(lemma -> {
        if (lemma == null || lemma.getWord() == null) {
          return null;
        }

        lemma.setWord(
          lemma.getWord()
            .replace("_", "")
            .replace("=", "")
        );
        return lemma;
      })
      .filter(Objects::nonNull)
      .collect(toList());
  }

  public static List<List<WordAndPosInfoDto>> sanitizeLemmaList(List<List<WordAndPosInfoDto>> lemmas) {
    return lemmas.stream()
      .map(WordContextUtils::sanitizeLemmas)
      .collect(toList());
  }

  public static WordAndPosInfoDto getWordAndPosInfoByIndexFromWordlist(List<WordAndPosInfoDto> wordlist, int index, int displayCount, boolean ascending) {
    WordAndPosInfoDto result;
    while (true) {
      try {
        if (ascending) {
          result = wordlist.get(index + displayCount);
        } else {
          result = wordlist.get(index - displayCount);
        }
        break;
      } catch (IndexOutOfBoundsException e) {
        if (ascending) {
          index--;
        } else {
          index++;
        }
      }
    }
    return result;
  }

  public static WordAndPosInfoDto getWordAndPosInfoByIndexFromSentencelist(List<List<WordAndPosInfoDto>> sentencelist, int index, int displayCount, boolean ascending) {
    WordAndPosInfoDto result;
    while (true) {
      try {
        if (ascending) {
          var element = sentencelist.get(index + displayCount);
          result = element.get(element.size() - 1);
        } else {
          result = sentencelist.get(index - displayCount).get(0);
        }
        break;
      } catch (IndexOutOfBoundsException e) {
        if (ascending) {
          index--;
        } else {
          index++;
        }
      }
    }
    return result;
  }

  public static List<List<WordAndPosInfoDto>> sentenceArrayToList(WordAndPosInfoDto[][] array) {
    return stream(array)
      .map(Arrays::asList)
      .collect(toList());
  }
}

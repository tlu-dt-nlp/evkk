package ee.tlu.evkk.api.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import ee.evkk.dto.WordAnalyserRequestDto;
import ee.evkk.dto.WordContextRequestDto;
import ee.evkk.dto.WordlistRequestDto;
import ee.tlu.evkk.core.integration.StanzaServerClient;
import ee.tlu.evkk.core.service.TextService;
import ee.tlu.evkk.dal.dao.TextDao;
import ee.tlu.evkk.dal.dao.TextProcessorResultDao;
import ee.tlu.evkk.dal.dto.StanzaResponseDto;
import ee.tlu.evkk.dal.dto.WordAndPosInfoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import java.util.function.Supplier;

import static com.google.common.collect.Lists.partition;
import static ee.tlu.evkk.api.util.StringUtils.isNullOrBlank;
import static ee.tlu.evkk.api.util.WordContextUtils.sentenceArrayToList;
import static ee.tlu.evkk.common.util.TextUtils.sanitizeText;
import static ee.tlu.evkk.common.util.TextUtils.sanitizeTextDeep;
import static java.util.Arrays.asList;
import static java.util.Collections.emptyList;
import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import static java.util.stream.Stream.concat;
import static java.util.stream.Stream.empty;
import static org.apache.commons.collections4.CollectionUtils.isNotEmpty;

@Service
@RequiredArgsConstructor
public class StanzaAnalysisService {

  private final TextService textService;
  private final TextProcessorResultDao textProcessorResultDao;
  private final TextDao textDao;
  private final StanzaServerClient stanzaServerClient;

  private static final ObjectMapper objectMapper = new ObjectMapper();

  public List<String> getSonad(WordlistRequestDto dto) {
    return combineStringResponses(
      dto::getCorpusTextIds,
      StanzaResponseDto::getSonad,
      () -> sanitizeAndFetchStringList(dto, stanzaServerClient::getSonad)
    );
  }

  public List<String> getLemmad(WordlistRequestDto dto) {
    return combineStringResponses(
      dto::getCorpusTextIds,
      StanzaResponseDto::getLemmad,
      () -> sanitizeAndFetchStringList(dto, stanzaServerClient::getLemmad)
    );
  }

  public List<List<WordAndPosInfoDto>> getSonadLausetenaJaPosInfo(WordContextRequestDto dto) {
    return combineNestedResponses(
      dto,
      StanzaResponseDto::getSonadLausetenaJaPosInfo,
      () -> sanitizeAndFetchNested(dto, stanzaServerClient::getSonadLausetenaJaPosInfo)
    );
  }

  public List<List<WordAndPosInfoDto>> getLemmadLausetenaJaPosInfo(WordContextRequestDto dto) {
    return combineNestedResponses(
      dto,
      StanzaResponseDto::getLemmadLausetenaJaPosInfo,
      () -> sanitizeAndFetchNested(dto, stanzaServerClient::getLemmadLausetenaJaPosInfo)
    );
  }

  public List<WordAndPosInfoDto> getSonadJaPosInfo(WordContextRequestDto dto) {
    return combineWordAndPosInfoResponses(
      dto::getCorpusTextIds,
      StanzaResponseDto::getSonadJaPosInfo,
      () -> sanitizeAndFetchWordAndPosInfoList(dto, stanzaServerClient::getSonadJaPosInfo)
    );
  }

  public List<WordAndPosInfoDto> getLemmadJaPosInfo(WordContextRequestDto dto) {
    return combineWordAndPosInfoResponses(
      dto::getCorpusTextIds,
      StanzaResponseDto::getLemmadJaPosInfo,
      () -> sanitizeAndFetchWordAndPosInfoList(dto, stanzaServerClient::getLemmadJaPosInfo)
    );
  }

  public StanzaResponseDto getWordAnalyserResponse(WordAnalyserRequestDto dto) {
    List<StanzaResponseDto> corpusTextResponses = isNotEmpty(dto.getCorpusTextIds())
      ? getCorpusTextResponses(dto.getCorpusTextIds(), false)
      : new ArrayList<>();

    StanzaResponseDto ownTextResponse = isNullOrBlank(dto.getOwnTexts())
      ? new StanzaResponseDto()
      : stanzaServerClient.getSonadLemmadSilbidSonaliigidVormimargendid(sanitizeText(dto.getOwnTexts()));

    StanzaResponseDto combined = new StanzaResponseDto();

    combined.setSonad(combineFields(corpusTextResponses, StanzaResponseDto::getSonad, ownTextResponse.getSonad()));
    combined.setLemmad(combineFields(corpusTextResponses, StanzaResponseDto::getLemmad, ownTextResponse.getLemmad()));
    combined.setSilbid(combineFields(corpusTextResponses, StanzaResponseDto::getSilbid, ownTextResponse.getSilbid()));
    combined.setSonaliigid(combineFields(corpusTextResponses, StanzaResponseDto::getSonaliigid, ownTextResponse.getSonaliigid()));
    combined.setVormimargendid(combineFields(corpusTextResponses, StanzaResponseDto::getVormimargendid, ownTextResponse.getVormimargendid()));

    return combined;
  }

  private List<String> combineStringResponses(Supplier<Set<UUID>> corpusTextIdsSupplier, Function<StanzaResponseDto, List<String>> responseMapper, Supplier<List<String>> ownTextSupplier) {
    Set<UUID> corpusTextIds = corpusTextIdsSupplier.get();
    List<String> combined = new ArrayList<>();

    if (isNotEmpty(corpusTextIds)) {
      List<StanzaResponseDto> corpusTextResponses = getCorpusTextResponses(corpusTextIds, false);
      combined.addAll(corpusTextResponses.stream()
        .map(responseMapper)
        .flatMap(List::stream)
        .collect(toList()));
    }

    combined.addAll(ownTextSupplier.get());

    return combined;
  }

  private List<WordAndPosInfoDto> combineWordAndPosInfoResponses(Supplier<Set<UUID>> corpusTextIdsSupplier, Function<StanzaResponseDto, List<WordAndPosInfoDto>> responseMapper, Supplier<List<WordAndPosInfoDto>> ownTextSupplier) {
    Set<UUID> corpusTextIds = corpusTextIdsSupplier.get();
    List<WordAndPosInfoDto> combined = new ArrayList<>();
    AtomicInteger increaseCounter = new AtomicInteger();

    if (isNotEmpty(corpusTextIds)) {
      List<StanzaResponseDto> corpusTextResponses = getCorpusTextResponses(corpusTextIds, true);

      combined.addAll(corpusTextResponses.stream()
        .map(response -> {
          responseMapper.apply(response).forEach(element ->
            element.increaseChars(increaseCounter.get())
          );
          increaseCounter.addAndGet(response.getCharCount() + 1);
          return responseMapper.apply(response);
        })
        .flatMap(List::stream)
        .collect(toList())
      );
    }

    List<WordAndPosInfoDto> ownTextResponses = ownTextSupplier.get();
    ownTextResponses.forEach(element -> element.increaseChars(increaseCounter.get()));
    combined.addAll(ownTextResponses);

    return combined;
  }

  private List<List<WordAndPosInfoDto>> combineNestedResponses(WordContextRequestDto dto, Function<StanzaResponseDto, List<List<WordAndPosInfoDto>>> responseMapper, Supplier<List<List<WordAndPosInfoDto>>> ownTextSupplier) {
    Set<UUID> corpusTextIds = dto.getCorpusTextIds();
    List<List<WordAndPosInfoDto>> combined = new ArrayList<>();
    AtomicInteger increaseCounter = new AtomicInteger();

    if (isNotEmpty(corpusTextIds)) {
      List<StanzaResponseDto> corpusTextResponses = getCorpusTextResponses(corpusTextIds, true);

      combined.addAll(corpusTextResponses.stream()
        .map(response -> {
          responseMapper.apply(response).forEach(element ->
            element.forEach(subElement ->
              subElement.increaseChars(increaseCounter.get())
            )
          );
          increaseCounter.addAndGet(response.getCharCount() + 1);
          return responseMapper.apply(response);
        })
        .flatMap(List::stream)
        .collect(toList())
      );
    }

    List<List<WordAndPosInfoDto>> ownTextResponses = ownTextSupplier.get();
    ownTextResponses.forEach(e1 -> e1.forEach(e2 -> e2.increaseChars(increaseCounter.get())));
    combined.addAll(ownTextResponses);

    return combined;
  }

  private List<StanzaResponseDto> getCorpusTextResponses(Set<UUID> corpusTextIds, boolean shouldGenerateCharCount) {
    List<UUID> sortedCorpusTextIds = corpusTextIds.stream().sorted(comparing(UUID::toString)).collect(toList());
    List<List<UUID>> batches = partition(new ArrayList<>(sortedCorpusTextIds), 1000);
    List<StanzaResponseDto> results = new ArrayList<>();
    Set<UUID> missingUUIDs = new HashSet<>();

    for (List<UUID> batch : batches) {
      String json = textProcessorResultDao.findStanzaFullTextAnalysisByTextIds(new HashSet<>(batch));
      try {
        List<StanzaResponseDto> responseList = objectMapper.readValue(json, new TypeReference<>() {});
        missingUUIDs.addAll(findMissingUUIDs(responseList, batch));
        results.addAll(responseList);
      } catch (Exception e) {
        missingUUIDs.addAll(batch);
      }
    }

    if (isNotEmpty(missingUUIDs)) {
      results.add(generateResultsForMissingUUIDs(missingUUIDs, shouldGenerateCharCount));
    }
    return results;
  }

  private StanzaResponseDto generateResultsForMissingUUIDs(Set<UUID> missingUUIDs, boolean shouldGenerateCharCount) {
    String missingTexts = sanitizeText(textService.getPartitionedTextResourceByIds(missingUUIDs, textDao::findTextsByIds));
    StanzaResponseDto stanzaResponse = stanzaServerClient.getFullTextAnalysis(missingTexts);
    if (shouldGenerateCharCount) {
      stanzaResponse.setCharCount(missingTexts.length());
    }
    return stanzaResponse;
  }

  private static List<String> sanitizeAndFetchStringList(WordlistRequestDto dto, Function<String, String[]> clientListFunction) {
    return isNullOrBlank(dto.getOwnTexts())
      ? emptyList()
      : asList(clientListFunction.apply(sanitizeTextDeep(dto.getOwnTexts())));
  }

  private static List<WordAndPosInfoDto> sanitizeAndFetchWordAndPosInfoList(WordContextRequestDto dto, Function<String, WordAndPosInfoDto[]> clientListFunction) {
    return isNullOrBlank(dto.getOwnTexts())
      ? emptyList()
      : asList(clientListFunction.apply(sanitizeText(dto.getOwnTexts())));
  }

  private static List<List<WordAndPosInfoDto>> sanitizeAndFetchNested(WordContextRequestDto dto, Function<String, WordAndPosInfoDto[][]> clientListFunction) {
    return isNullOrBlank(dto.getOwnTexts())
      ? emptyList()
      : sentenceArrayToList(clientListFunction.apply(sanitizeText(dto.getOwnTexts())));
  }

  private static List<UUID> findMissingUUIDs(List<StanzaResponseDto> responseList, List<UUID> uuidBatch) {
    Set<UUID> stanzaResponseUUIDs = responseList.stream()
      .map(StanzaResponseDto::getTextId)
      .collect(toSet());

    return uuidBatch.stream()
      .filter(uuid -> !stanzaResponseUUIDs.contains(uuid))
      .collect(toList());
  }

  private static <T> List<T> combineFields(List<StanzaResponseDto> corpusTextResponses, Function<StanzaResponseDto, List<T>> fieldExtractor, List<T> ownTextField) {
    return concat(
      corpusTextResponses.stream()
        .map(fieldExtractor)
        .flatMap(List::stream),
      (ownTextField != null ? ownTextField.stream() : empty())
    ).collect(toList());
  }

}

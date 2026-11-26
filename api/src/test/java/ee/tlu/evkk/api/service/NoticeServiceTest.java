package ee.tlu.evkk.api.service;

import ee.evkk.dto.enums.NoticeSeverity;
import ee.tlu.evkk.api.controller.dto.NoticeDto;
import ee.tlu.evkk.api.controller.dto.NoticeRequestDto;
import ee.tlu.evkk.api.converter.NoticeMapper;
import ee.tlu.evkk.api.converter.NoticeMapperImpl;
import ee.tlu.evkk.api.exception.BadRequestException;
import ee.tlu.evkk.api.exception.EntityNotFoundException;
import ee.tlu.evkk.dal.dao.NoticeDao;
import ee.tlu.evkk.dal.dto.Notice;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static ee.tlu.evkk.api.exception.ErrorCode.NOTICE_ORDER_OUTDATED;
import static java.util.UUID.randomUUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NoticeServiceTest {

  @Mock
  private NoticeDao noticeDao;

  @Spy
  @SuppressWarnings("unused")
  private NoticeMapper noticeMapper = new NoticeMapperImpl();

  @InjectMocks
  private NoticeService noticeService;

  @Test
  @DisplayName("createNotice trims content, de-duplicates pages and returns the stored notice")
  void createNotice_trimsContent() {
    UUID id = randomUUID();
    when(noticeDao.insert(any())).thenReturn(id);
    when(noticeDao.findById(id)).thenReturn(Optional.of(notice(id, 1)));

    NoticeDto result = noticeService.createNotice(request("  Tere  ", " Hello "));

    assertThat(result.getId()).isEqualTo(id);
    verify(noticeDao).insert(argThat(n -> n.getContentEt().equals("Tere")
      && n.getContentEn().equals("Hello")
      && n.getPages().equals(List.of("TOOLS", "HOME"))));
  }

  @Test
  @DisplayName("updateNotice throws when notice does not exist")
  void updateNotice_notFound() {
    UUID id = randomUUID();
    NoticeRequestDto request = request("a", "b");
    when(noticeDao.update(any())).thenReturn(0);

    assertThatThrownBy(() -> noticeService.updateNotice(id, request))
      .isInstanceOf(EntityNotFoundException.class);
  }

  @Test
  @DisplayName("deleteNotice compacts sort order after deleting")
  void deleteNotice_compactsSortOrder() {
    UUID id = randomUUID();
    when(noticeDao.deleteById(id)).thenReturn(1);

    noticeService.deleteNotice(id);

    verify(noticeDao).compactSortOrder();
  }

  @Test
  @DisplayName("deleteNotice throws when notice does not exist")
  void deleteNotice_notFound() {
    UUID id = randomUUID();
    when(noticeDao.deleteById(any())).thenReturn(0);

    assertThatThrownBy(() -> noticeService.deleteNotice(id))
      .isInstanceOf(EntityNotFoundException.class);
    verify(noticeDao, never()).compactSortOrder();
  }

  @Test
  @DisplayName("reorderNotices assigns sort order by list position")
  void reorderNotices_assignsSortOrder() {
    UUID first = randomUUID();
    UUID second = randomUUID();
    when(noticeDao.findAll()).thenReturn(List.of(notice(first, 1), notice(second, 2)));

    noticeService.reorderNotices(List.of(second, first));

    verify(noticeDao).updateSortOrder(second, 1);
    verify(noticeDao).updateSortOrder(first, 2);
  }

  @Test
  @DisplayName("reorderNotices rejects incomplete or duplicate id lists")
  void reorderNotices_rejectsInvalidList() {
    UUID first = randomUUID();
    UUID second = randomUUID();
    when(noticeDao.findAll()).thenReturn(List.of(notice(first, 1), notice(second, 2)));

    assertOrderRejected(List.of(first));
    assertOrderRejected(List.of(first, first));
    assertOrderRejected(List.of(first, second, randomUUID()));
    verify(noticeDao, never()).updateSortOrder(any(), anyInt());
  }

  private void assertOrderRejected(List<UUID> orderedIds) {
    assertThatThrownBy(() -> noticeService.reorderNotices(orderedIds))
      .isInstanceOf(BadRequestException.class)
      .hasFieldOrPropertyWithValue("errorCode", NOTICE_ORDER_OUTDATED);
  }

  @Test
  @DisplayName("request validation: end time requires start time and must be after it")
  void requestValidation() {
    Instant now = Instant.now();
    NoticeRequestDto request = request("a", "b");
    assertThat(request.isValidToPrecededByValidFrom()).isTrue();
    assertThat(request.isValidRange()).isTrue();

    request.setValidTo(now);
    assertThat(request.isValidToPrecededByValidFrom()).isFalse();

    request.setValidFrom(now.plusSeconds(60));
    assertThat(request.isValidToPrecededByValidFrom()).isTrue();
    assertThat(request.isValidRange()).isFalse();

    request.setValidFrom(now.minusSeconds(60));
    assertThat(request.isValidRange()).isTrue();
  }

  private static NoticeRequestDto request(String contentEt, String contentEn) {
    NoticeRequestDto request = new NoticeRequestDto();
    request.setContentEt(contentEt);
    request.setContentEn(contentEn);
    request.setSeverity(NoticeSeverity.INFO);
    request.setPages(List.of("TOOLS", "HOME", "TOOLS"));
    return request;
  }

  private static Notice notice(UUID id, int sortOrder) {
    return Notice.builder()
      .id(id)
      .contentEt("Tere")
      .contentEn("Hello")
      .severity(NoticeSeverity.INFO)
      .pages(List.of())
      .sortOrder(sortOrder)
      .build();
  }
}

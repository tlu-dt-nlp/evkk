package ee.tlu.evkk.api.service;

import ee.tlu.evkk.api.controller.dto.ActiveNoticeDto;
import ee.tlu.evkk.api.controller.dto.NoticeDto;
import ee.tlu.evkk.api.controller.dto.NoticeRequestDto;
import ee.tlu.evkk.api.converter.NoticeMapper;
import ee.tlu.evkk.api.exception.BadRequestException;
import ee.tlu.evkk.api.exception.EntityNotFoundException;
import ee.tlu.evkk.dal.dao.NoticeDao;
import ee.tlu.evkk.dal.dto.Notice;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static ee.tlu.evkk.api.exception.ErrorCode.NOTICE_ORDER_OUTDATED;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoticeService {

  private final NoticeDao noticeDao;
  private final NoticeMapper noticeMapper;

  public List<NoticeDto> getAllNotices() {
    return noticeDao.findAll().stream()
      .map(noticeMapper::toNoticeDto)
      .collect(toList());
  }

  public List<ActiveNoticeDto> getActiveNotices() {
    return noticeDao.findActive().stream()
      .map(noticeMapper::toActiveNoticeDto)
      .collect(toList());
  }

  @Transactional
  public NoticeDto createNotice(NoticeRequestDto request) {
    UUID id = noticeDao.insert(noticeMapper.toNotice(null, request));
    return getNotice(id);
  }

  @Transactional
  public NoticeDto updateNotice(UUID id, NoticeRequestDto request) {
    if (noticeDao.update(noticeMapper.toNotice(id, request)) == 0) {
      throw new EntityNotFoundException();
    }
    return getNotice(id);
  }

  @Transactional
  public void deleteNotice(UUID id) {
    if (noticeDao.deleteById(id) == 0) {
      throw new EntityNotFoundException();
    }
    noticeDao.compactSortOrder();
  }

  @Transactional
  public List<NoticeDto> reorderNotices(List<UUID> orderedIds) {
    Set<UUID> existingIds = noticeDao.findAll().stream()
      .map(Notice::getId)
      .collect(toSet());
    Set<UUID> requestedIds = new HashSet<>(orderedIds);

    if (requestedIds.size() != orderedIds.size() || !requestedIds.equals(existingIds)) {
      throw new BadRequestException(NOTICE_ORDER_OUTDATED, "Notice order must contain every existing notice exactly once");
    }

    // the sort_order unique constraint is deferred, so intermediate duplicates within the transaction are fine
    for (int i = 0; i < orderedIds.size(); i++) {
      noticeDao.updateSortOrder(orderedIds.get(i), i + 1);
    }
    return getAllNotices();
  }

  private NoticeDto getNotice(UUID id) {
    return noticeDao.findById(id)
      .map(noticeMapper::toNoticeDto)
      .orElseThrow(EntityNotFoundException::new);
  }
}

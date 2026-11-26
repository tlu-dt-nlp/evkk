package ee.tlu.evkk.api.controller;

import ee.tlu.evkk.api.controller.dto.NoticeDto;
import ee.tlu.evkk.api.controller.dto.NoticeRequestDto;
import ee.tlu.evkk.api.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.NO_CONTENT;

@RestController
@RequiredArgsConstructor
@RequestMapping("admin/notices")
@Secured("ROLE_ADMIN")
public class AdminNoticeController {

  private final NoticeService noticeService;

  @GetMapping
  public List<NoticeDto> getNotices() {
    return noticeService.getAllNotices();
  }

  @PostMapping
  public NoticeDto createNotice(@RequestBody @Valid NoticeRequestDto request) {
    return noticeService.createNotice(request);
  }

  @PutMapping("{id}")
  public NoticeDto updateNotice(@PathVariable UUID id, @RequestBody @Valid NoticeRequestDto request) {
    return noticeService.updateNotice(id, request);
  }

  @DeleteMapping("{id}")
  @ResponseStatus(NO_CONTENT)
  public void deleteNotice(@PathVariable UUID id) {
    noticeService.deleteNotice(id);
  }

  @PutMapping("order")
  public List<NoticeDto> reorderNotices(@RequestBody List<UUID> orderedIds) {
    return noticeService.reorderNotices(orderedIds);
  }
}

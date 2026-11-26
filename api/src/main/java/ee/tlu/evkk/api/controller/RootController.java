package ee.tlu.evkk.api.controller;

import ee.tlu.evkk.api.controller.dto.ActiveNoticeDto;
import ee.tlu.evkk.api.controller.dto.StatusResponseDto;
import ee.tlu.evkk.api.exception.TokenNotFoundException;
import ee.tlu.evkk.api.service.NoticeService;
import ee.tlu.evkk.api.service.RootService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class RootController {

  private final RootService rootService;
  private final NoticeService noticeService;

  @GetMapping("/status")
  public StatusResponseDto status(HttpServletRequest request) throws TokenNotFoundException {
    return rootService.getStatus(request);
  }

  @GetMapping("/notices")
  public List<ActiveNoticeDto> notices() {
    return noticeService.getActiveNotices();
  }
}

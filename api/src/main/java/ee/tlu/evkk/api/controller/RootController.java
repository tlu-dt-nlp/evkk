package ee.tlu.evkk.api.controller;

import ee.tlu.evkk.api.controller.dto.StatusResponseDto;
import ee.tlu.evkk.api.exception.TokenNotFoundException;
import ee.tlu.evkk.api.service.RootService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class RootController {

  private final RootService rootService;

  @GetMapping("/status")
  public StatusResponseDto status(HttpServletRequest request) throws TokenNotFoundException {
    return rootService.getStatus(request);
  }
}

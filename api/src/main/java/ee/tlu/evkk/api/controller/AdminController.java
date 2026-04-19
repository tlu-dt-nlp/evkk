package ee.tlu.evkk.api.controller;

import ee.tlu.evkk.dal.dao.TextAddedDao;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
@Secured("ROLE_ADMIN")
public class AdminController {

  private final TextAddedDao textAddedDao;

  @GetMapping("texts-to-review")
  public Integer textsToReview() {
    return textAddedDao.count();
  }
}

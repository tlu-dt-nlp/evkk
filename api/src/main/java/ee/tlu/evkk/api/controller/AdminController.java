package ee.tlu.evkk.api.controller;

import ee.tlu.evkk.api.service.AdminTextService;
import ee.tlu.evkk.dal.dto.TextAndMetadata;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
@Secured("ROLE_ADMIN")
public class AdminController {

  private final AdminTextService adminTextService;

  @GetMapping("/texts-to-review")
  public ResponseEntity<Integer> getTextsToReview() {
    return ResponseEntity.ok(adminTextService.getTextsToReview());
  }

  @GetMapping("/donated-texts/{id}")
  public ResponseEntity<TextAndMetadata> getDonatedTextDetails(@PathVariable UUID id) {
    return adminTextService.getDonatedTextDetails(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/published-texts/{id}")
  public ResponseEntity<TextAndMetadata> getPublishedTextDetails(@PathVariable UUID id) {
    return adminTextService.getPublishedTextDetails(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }
}

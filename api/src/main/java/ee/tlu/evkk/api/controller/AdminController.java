package ee.tlu.evkk.api.controller;

import ee.evkk.dto.TextDetailsResponseDto;
import ee.evkk.dto.TextUpdateRequestDto;
import ee.evkk.dto.TextsToReviewResponseDto;
import ee.tlu.evkk.api.service.AdminTextService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
@Secured("ROLE_ADMIN")
public class AdminController {

  private final AdminTextService adminTextService;

  @GetMapping("/texts-to-review")
  public ResponseEntity<TextsToReviewResponseDto> getTextsToReview() {
    return ResponseEntity.ok(adminTextService.getTextsToReview());
  }

  @GetMapping("/donated-texts/{id}")
  public ResponseEntity<TextDetailsResponseDto> getDonatedTextDetails(@PathVariable UUID id) {
    return adminTextService.getDonatedTextDetails(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping("/published-texts/{id}")
  public ResponseEntity<TextDetailsResponseDto> getPublishedTextDetails(@PathVariable UUID id) {
    return adminTextService.getPublishedTextDetails(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/published-texts/{id}")
  public ResponseEntity<TextDetailsResponseDto> updatePublishedText(
    @PathVariable UUID id,
    @RequestBody @Valid TextUpdateRequestDto request
  ) {
    return ResponseEntity.ok(adminTextService.updatePublishedText(id, request));
  }
}

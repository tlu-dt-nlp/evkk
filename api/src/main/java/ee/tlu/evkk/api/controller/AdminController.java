package ee.tlu.evkk.api.controller;

import ee.evkk.dto.CorpusRequestDto;
import ee.evkk.dto.DonatedTextRequestDto;
import ee.evkk.dto.TextDetailsResponseDto;
import ee.evkk.dto.TextUpdateRequestDto;
import ee.evkk.dto.TextsToReviewResponseDto;
import ee.tlu.evkk.api.service.AdminTextService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.UUID;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

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

  @PostMapping(value = "/donated-texts", produces = APPLICATION_JSON_VALUE)
  public ResponseEntity<String> getDonatedTexts(@RequestBody DonatedTextRequestDto request) {
    return ResponseEntity.ok(adminTextService.getDonatedTexts(request));
  }

  @GetMapping("/donated-texts/{id}")
  public ResponseEntity<TextDetailsResponseDto> getDonatedTextDetails(@PathVariable UUID id) {
    return adminTextService.getDonatedTextDetails(id)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/donated-texts/{id}")
  public ResponseEntity<TextDetailsResponseDto> updateDonatedText(
    @PathVariable UUID id,
    @RequestBody @Valid TextUpdateRequestDto request
  ) {
    return ResponseEntity.ok(adminTextService.updateDonatedText(id, request));
  }

  @DeleteMapping("/donated-texts/{id}")
  public ResponseEntity<Void> deleteDonatedText(@PathVariable UUID id) {
    adminTextService.deleteDonatedText(id);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/donated-texts/{id}/publish")
  public ResponseEntity<TextDetailsResponseDto> publishDonatedText(
    @PathVariable UUID id,
    @RequestBody(required = false) @Valid TextUpdateRequestDto request
  ) {
    return ResponseEntity.ok(adminTextService.publishDonatedText(id, request));
  }

  @PostMapping(value = "/published-texts", produces = APPLICATION_JSON_VALUE)
  public ResponseEntity<String> getPublishedTexts(@RequestBody CorpusRequestDto request) {
    return ResponseEntity.ok(adminTextService.getPublishedTexts(request));
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

  @DeleteMapping("/published-texts/{id}")
  public ResponseEntity<Void> deletePublishedText(@PathVariable UUID id) {
    adminTextService.deletePublishedText(id);
    return ResponseEntity.noContent().build();
  }
}

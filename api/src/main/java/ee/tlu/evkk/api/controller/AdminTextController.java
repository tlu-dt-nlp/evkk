package ee.tlu.evkk.api.controller;

import ee.evkk.dto.CorpusRequestDto;
import ee.evkk.dto.DonatedTextRequestDto;
import ee.evkk.dto.TextDetailsResponseDto;
import ee.evkk.dto.TextUpdateRequestDto;
import ee.evkk.dto.TextsToReviewResponseDto;
import ee.tlu.evkk.api.service.AdminTextService;
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
import java.util.UUID;

import static org.springframework.http.HttpStatus.NO_CONTENT;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@RestController
@RequiredArgsConstructor
@RequestMapping("admin/texts")
@Secured("ROLE_ADMIN")
public class AdminTextController {

  private final AdminTextService adminTextService;

  @GetMapping("to-review")
  public TextsToReviewResponseDto getTextsToReview() {
    return adminTextService.getTextsToReview();
  }

  @PostMapping(value = "donated", produces = APPLICATION_JSON_VALUE)
  public String getDonatedTexts(@RequestBody DonatedTextRequestDto request) {
    return adminTextService.getDonatedTexts(request);
  }

  @GetMapping("donated/{id}")
  public TextDetailsResponseDto getDonatedTextDetails(@PathVariable UUID id) {
    return adminTextService.getDonatedTextDetails(id);
  }

  @PutMapping("donated/{id}")
  public TextDetailsResponseDto updateDonatedText(
    @PathVariable UUID id,
    @RequestBody @Valid TextUpdateRequestDto request
  ) {
    return adminTextService.updateDonatedText(id, request);
  }

  @DeleteMapping("donated/{id}")
  @ResponseStatus(NO_CONTENT)
  public void deleteDonatedText(@PathVariable UUID id) {
    adminTextService.deleteDonatedText(id);
  }

  @PostMapping("donated/{id}/publish")
  public TextDetailsResponseDto publishDonatedText(
    @PathVariable UUID id,
    @RequestBody(required = false) @Valid TextUpdateRequestDto request
  ) {
    return adminTextService.publishDonatedText(id, request);
  }

  @PostMapping(value = "published", produces = APPLICATION_JSON_VALUE)
  public String getPublishedTexts(@RequestBody CorpusRequestDto request) {
    return adminTextService.getPublishedTexts(request);
  }

  @GetMapping("published/{id}")
  public TextDetailsResponseDto getPublishedTextDetails(@PathVariable UUID id) {
    return adminTextService.getPublishedTextDetails(id);
  }

  @PutMapping("published/{id}")
  public TextDetailsResponseDto updatePublishedText(
    @PathVariable UUID id,
    @RequestBody @Valid TextUpdateRequestDto request
  ) {
    return adminTextService.updatePublishedText(id, request);
  }

  @DeleteMapping("published/{id}")
  @ResponseStatus(NO_CONTENT)
  public void deletePublishedText(@PathVariable UUID id) {
    adminTextService.deletePublishedText(id);
  }
}

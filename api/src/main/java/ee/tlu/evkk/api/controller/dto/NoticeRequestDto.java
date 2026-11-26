package ee.tlu.evkk.api.controller.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ee.evkk.dto.enums.NoticeSeverity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeRequestDto {

  private static final String PAGE_KEY_PATTERN = "^[A-Z0-9_]++(?:/[A-Z0-9_]++)*+$";

  @NotBlank
  private String contentEt;

  @NotBlank
  private String contentEn;

  @NotNull
  private NoticeSeverity severity;

  /**
   * UI page keys the notice is shown on, e.g. HOME, TOOLS or TOOLS/WORDLIST. Empty list = all pages.
   */
  @NotNull
  @Size(max = 100)
  private List<@NotNull @Pattern(regexp = PAGE_KEY_PATTERN) String> pages;

  private boolean dismissible;

  private Instant validFrom;

  private Instant validTo;

  @JsonIgnore
  @AssertTrue
  public boolean isValidToPrecededByValidFrom() {
    return validTo == null || validFrom != null;
  }

  @JsonIgnore
  @AssertTrue
  public boolean isValidRange() {
    return validTo == null || validFrom == null || validTo.isAfter(validFrom);
  }
}

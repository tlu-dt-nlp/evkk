package ee.tlu.evkk.dal.dto;

import ee.evkk.dto.enums.NoticeSeverity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notice {

  private UUID id;
  private String contentEt;
  private String contentEn;
  private NoticeSeverity severity;
  private List<String> pages;
  private boolean dismissible;
  private Instant validFrom;
  private Instant validTo;
  private int sortOrder;
  private Instant createdAt;
  private Instant updatedAt;
}

package ee.tlu.evkk.api.controller.dto;

import ee.evkk.dto.enums.NoticeSeverity;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
@Builder
public class ActiveNoticeDto {

  private UUID id;
  private String contentEt;
  private String contentEn;
  private NoticeSeverity severity;
  private List<String> pages;
  private boolean dismissible;
}

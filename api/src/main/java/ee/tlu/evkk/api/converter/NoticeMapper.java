package ee.tlu.evkk.api.converter;

import ee.tlu.evkk.api.controller.dto.ActiveNoticeDto;
import ee.tlu.evkk.api.controller.dto.NoticeDto;
import ee.tlu.evkk.api.controller.dto.NoticeRequestDto;
import ee.tlu.evkk.dal.dto.Notice;
import org.mapstruct.Mapper;

import java.util.UUID;

import static java.util.stream.Collectors.toList;
import static org.mapstruct.ReportingPolicy.ERROR;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ERROR)
public interface NoticeMapper {

  NoticeDto toNoticeDto(Notice notice);

  ActiveNoticeDto toActiveNoticeDto(Notice notice);

  default Notice toNotice(UUID id, NoticeRequestDto request) {
    return Notice.builder()
      .id(id)
      .contentEt(request.getContentEt().trim())
      .contentEn(request.getContentEn().trim())
      .severity(request.getSeverity())
      .pages(request.getPages().stream().distinct().collect(toList()))
      .dismissible(request.isDismissible())
      .validFrom(request.getValidFrom())
      .validTo(request.getValidTo())
      .build();
  }
}

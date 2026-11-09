package ee.tlu.evkk.api.converter;

import ee.evkk.dto.TextDetailsResponseDto;
import ee.evkk.dto.TextMetadataDto;
import ee.tlu.evkk.api.controller.dto.UserDto;
import ee.tlu.evkk.dal.dto.TextAndMetadata;
import ee.tlu.evkk.dal.dto.TextMetadata;
import ee.tlu.evkk.dal.dto.User;
import org.mapstruct.Mapper;
import org.mapstruct.MapperConfig;
import org.mapstruct.Mapping;

import static java.lang.String.format;
import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.mapstruct.ReportingPolicy.IGNORE;

@Mapper(componentModel = "spring")
@MapperConfig(unmappedTargetPolicy = IGNORE)
public interface DtoMapper {

  @SuppressWarnings("unused")
  TextMetadataDto toDto(TextMetadata source);

  TextDetailsResponseDto toDto(TextAndMetadata source);

  @Mapping(target = "fullName", expression = "java(getFullName(user))")
  UserDto toUserDto(User user);

  @SuppressWarnings("unused")
  default String getFullName(User user) {
    return format("%s%s %s",
      user.getFirstName(),
      isEmpty(user.getMiddleName()) ? "" : " " + user.getMiddleName(),
      user.getLastName()
    );
  }
}

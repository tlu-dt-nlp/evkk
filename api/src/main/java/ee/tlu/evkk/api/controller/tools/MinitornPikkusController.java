package ee.tlu.evkk.api.controller.tools;

import ee.tlu.evkk.api.controller.tools.dto.MinitornPikkusRequestDto;
import ee.tlu.evkk.api.controller.tools.dto.MinitornPikkusResponseDto;
import ee.tlu.evkk.api.integration.MinitornPikkusClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

/**
 * @author Mikk Tarvas
 * Date: 11.02.2020
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/tools/minitorn-pikkus")
public class MinitornPikkusController {

  private final MinitornPikkusClient client;

  @PostMapping
  public MinitornPikkusResponseDto post(@RequestBody @Valid MinitornPikkusRequestDto requestEntity) {
    long length = client.getStringLengthOfCharSequence(requestEntity.getInput());
    return new MinitornPikkusResponseDto(length);
  }
}

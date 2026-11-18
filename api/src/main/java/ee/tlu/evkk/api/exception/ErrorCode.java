package ee.tlu.evkk.api.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Error codes returned to the UI in 400 responses, which maps them to translated messages (see ErrorCode400 in useFetch.js).
 */
@Getter
@RequiredArgsConstructor
public enum ErrorCode {

  NOTICE_ORDER_OUTDATED("NoticeOrderOutdated");

  private final String code;
}

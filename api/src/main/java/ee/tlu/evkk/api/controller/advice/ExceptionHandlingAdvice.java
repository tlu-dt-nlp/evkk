package ee.tlu.evkk.api.controller.advice;

import ee.tlu.evkk.api.controller.error.ErrorEntity;
import ee.tlu.evkk.api.controller.error.ErrorEntityFactory;
import ee.tlu.evkk.api.exception.AbstractBusinessException;
import ee.tlu.evkk.api.exception.RateLimitExceededException;
import ee.tlu.evkk.api.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;
import java.util.Locale;

import static java.util.Collections.singletonList;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.TOO_MANY_REQUESTS;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

/**
 * @author Mikk Tarvas
 * Date: 04.06.2020
 */
@Slf4j
@ControllerAdvice
@RequiredArgsConstructor
public class ExceptionHandlingAdvice {

  private final ErrorEntityFactory errorEntityFactory;

  @ExceptionHandler(AbstractBusinessException.class)
  public ResponseEntity<List<ErrorEntity>> handleAbstractBusinessException(Locale locale, AbstractBusinessException ex) {
    ErrorEntity errorEntity = errorEntityFactory.create(locale, ex);
    return createResponseEntity(singletonList(errorEntity));
  }

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<Object> unauthorizedException() {
    return new ResponseEntity<>(UNAUTHORIZED);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<Object> accessDeniedException() {
    if (SecurityContextHolder.getContext().getAuthentication().getPrincipal() instanceof String) {
      return new ResponseEntity<>(UNAUTHORIZED);
    }
    return new ResponseEntity<>(FORBIDDEN);
  }

  @ExceptionHandler(RateLimitExceededException.class)
  public ResponseEntity<Object> handleRateLimitExceededException() {
    return new ResponseEntity<>(TOO_MANY_REQUESTS);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Object> handleException(Exception ex) {
    log.error("Internal Server Error occurred", ex);
    return new ResponseEntity<>(INTERNAL_SERVER_ERROR);
  }

  private ResponseEntity<List<ErrorEntity>> createResponseEntity(List<ErrorEntity> errors) {
    return ResponseEntity.status(BAD_REQUEST).body(errors);
  }

}

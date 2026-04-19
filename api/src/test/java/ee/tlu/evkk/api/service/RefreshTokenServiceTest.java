package ee.tlu.evkk.api.service;

import ee.tlu.evkk.api.IntegrationTest;
import ee.tlu.evkk.api.service.interfaces.AbstractRefreshTokenService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletResponse;

import static ee.tlu.evkk.api.constant.AuthConstants.COOKIE_HEADER_NAME;
import static ee.tlu.evkk.api.constant.AuthConstants.REFRESH_TOKEN_COOKIE_NAME;
import static ee.tlu.evkk.api.constant.AuthConstants.REFRESH_TOKEN_EXPIRES_IN_SECONDS;
import static java.lang.String.format;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentCaptor.forClass;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class RefreshTokenServiceTest extends IntegrationTest {

  private static final String DUMMY_TOKEN = "dummyToken123";
  @Autowired
  private AbstractRefreshTokenService refreshTokenService;

  @Test
  @DisplayName("Refresh token cookie created and set correctly")
  void refreshTokenCookieIsCreatedAndSetCorrectly() {
    HttpServletResponse response = mock(HttpServletResponse.class);

    refreshTokenService.createCookie(DUMMY_TOKEN, response);

    ArgumentCaptor<String> headerNameCaptor = forClass(String.class);
    ArgumentCaptor<String> cookieValueCaptor = forClass(String.class);
    verify(response).addHeader(headerNameCaptor.capture(), cookieValueCaptor.capture());

    assertEquals(COOKIE_HEADER_NAME, headerNameCaptor.getValue());
    assertEquals(
      format("%s=%s; Max-Age=%d; SameSite=Strict; HttpOnly; Secure; Path=/",
        REFRESH_TOKEN_COOKIE_NAME,
        DUMMY_TOKEN,
        REFRESH_TOKEN_EXPIRES_IN_SECONDS
      ),
      cookieValueCaptor.getValue()
    );
  }
}

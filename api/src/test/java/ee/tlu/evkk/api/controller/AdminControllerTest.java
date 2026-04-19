package ee.tlu.evkk.api.controller;

import ee.tlu.evkk.api.IntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.test.context.support.WithMockUser;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AdminControllerTest extends IntegrationTest {

  @Test
  @DisplayName("Unauthenticated user cannot get amount of texts to review")
  void unauthenticatedUserCannotGetAmountOfTextsToReview() throws Exception {
    mockMvc.perform(
        get("/admin/texts-to-review"))
      .andExpect(status().isUnauthorized());
  }

  @Test
  @DisplayName("Authenticated user cannot get amount of texts to review")
  @WithMockUser(username = "user")
  void authenticatedUserCannotGetAmountOfTextsToReview() throws Exception {
    mockMvc.perform(
        get("/admin/texts-to-review"))
      .andExpect(status().isForbidden());
  }

  @Test
  @DisplayName("Authenticated admin user can get amount of texts to review")
  @WithMockUser(username = "admin", roles = {"ADMIN"})
  void authenticatedUserCanGetAmountOfTextsToReview() throws Exception {
    mockMvc.perform(
        get("/admin/texts-to-review"))
      .andExpect(status().isOk());
  }
}
